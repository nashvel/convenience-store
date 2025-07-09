<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\ProductModel;
use App\Models\NotificationModel;

class OrderController extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        $userId = $this->request->getGet('userId');
        $storeId = $this->request->getGet('store_id');
        $riderId = $this->request->getGet('rider_id');

        if (!$userId && !$storeId && !$riderId) {
            return $this->failUnauthorized('User ID, Store ID, or Rider ID is required.');
        }

        $db = \Config\Database::connect();
        try {
            $query = $db->table('orders')
                    ->select('
                        orders.*, 
                        users.first_name, 
                        users.last_name,
                        rider.first_name as rider_first_name,
                        rider.last_name as rider_last_name,
                        user_addresses.latitude as customer_latitude,
                        user_addresses.longitude as customer_longitude,
                        user_addresses.latitude,
                        user_addresses.longitude,
                        user_addresses.line1,
                        store.name as store_name,
                        store_address.line1 as store_line1, 
                        store_address.city as store_city, 
                        store_address.province as store_province, 
                        store_address.latitude as store_latitude, 
                        store_address.longitude as store_longitude,
                        user_addresses.zip_code,
                        user_addresses.full_name as delivery_full_name,
                        user_addresses.phone as delivery_phone
                    ')
                    ->join('users', 'users.id = orders.customer_id')
                    ->join('users as rider', 'rider.id = orders.rider_id', 'left')
                    ->join('user_addresses', 'user_addresses.id = orders.delivery_address_id', 'left')
                    ->join('stores as store', 'store.id = orders.store_id')
                    ->join('user_addresses as store_address', 'store_address.user_id = store.client_id', 'left')
                    ->groupBy('orders.id');

            if ($userId) {
                $query->where('orders.customer_id', $userId);
            } elseif ($storeId) {
                $query->where('orders.store_id', $storeId);
            } elseif ($riderId) {
                $query->where('orders.rider_id', $riderId);
            }

            $orders = $query->orderBy('orders.created_at', 'DESC')->get()->getResultArray();

            // For each order, fetch order items
            foreach ($orders as &$order) {
                $order['items'] = $db->table('order_items')
                                      ->select('order_items.*, products.name as product_name, products.image as product_image')
                                      ->join('products', 'products.id = order_items.product_id')
                                      ->where('order_id', $order['id'])
                                      ->get()
                                      ->getResultArray();
            }

            return $this->respond(['success' => true, 'orders' => $orders]);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while fetching orders.');
        }
    }

    public function create()
    {
        $db = \Config\Database::connect();
        $db->transStart();

        try {
            $data = $this->request->getJSON(true);

            $userId = $data['userId'];
            $cartItems = $data['cartItems'];
            $shippingInfo = $data['shippingInfo'];

            if (empty($cartItems)) {
                return $this->fail('Cart is empty.');
            }

            // Server-side total calculation for security
            $productModel = new ProductModel();
            $productIds = array_map(fn($item) => $item['productId'], $cartItems);
            $products = $productModel->whereIn('id', $productIds)->findAll();
            $productMap = [];
            foreach ($products as $product) {
                $productMap[$product['id']] = $product;
            }

            $subtotal = 0;
            foreach ($cartItems as $item) {
                if (isset($productMap[$item['productId']])) {
                    $product = $productMap[$item['productId']];
                    $subtotal += $product['price'] * $item['quantity'];
                } else {
                    $db->transRollback();
                    return $this->failNotFound('Product with ID ' . $item['productId'] . ' not found.');
                }
            }

            $tax = $data['tax'] ?? 0;
            $shippingFee = $data['shipping_fee'] ?? 0;
            $totalAmount = $subtotal + $tax + $shippingFee;

            // For simplicity, we'll use the store_id from the first cart item.
            $storeId = $cartItems[0]['store_id'];

            // Insert into orders table
            $orderData = [
                'customer_id' => $userId,
                'store_id' => $storeId,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'delivery_address_id' => $shippingInfo['id'], // Use the address ID
                'payment_method' => $data['payment_method'] ?? 'cod',
                'delivery_fee' => $shippingFee,
                'created_at' => date('Y-m-d H:i:s')
            ];
            $db->table('orders')->insert($orderData);
            $orderId = $db->insertID();

            // Insert into order_items table
            $orderItemsData = [];
            foreach ($cartItems as $item) {
                $orderItemsData[] = [
                    'order_id' => $orderId,
                    'product_id' => $item['productId'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ];
            }
            $db->table('order_items')->insertBatch($orderItemsData);

            // Add a notification for the user
            $message = "Your order #{$orderId} has been placed and is pending review. You will receive an email once it's accepted.";
            $link = "/my-orders/" . $orderId;
            $notificationModel = new \App\Models\NotificationModel();
            $notificationModel->save([
                'user_id' => $userId,
                'message' => $message,
                'link' => $link,
                'type' => 'order_placed',
                'created_at' => date('Y-m-d H:i:s')
            ]);

            // Dispatch event for real-time notification
            // Instead of using headers, let's use a more reliable method
            $this->response->setJSON([
                'success' => true,
                'message' => 'Order created successfully',
                'orderId' => $orderId,
                'notification' => [
                    'type' => 'newNotification'
                ]
            ]);
            


            // Send email to store owner
            $storeOwner = $db->table('stores')
                              ->select('users.email, users.first_name')
                              ->join('users', 'users.id = stores.client_id')
                              ->where('stores.id', $storeId)
                              ->get()
                              ->getRow();

                        if ($storeOwner && !empty($storeOwner->email)) {
                // Generate JWTs for email actions
                $jwtSecret = getenv('jwt.secret');
                $issueTime = time();
                $expireTime = $issueTime + 86400 * 7; // Token valid for 7 days

                $acceptToken = JWT::encode(['iss' => getenv('app.baseURL'), 'aud' => getenv('app.baseURL'), 'iat' => $issueTime, 'exp' => $expireTime, 'order_id' => $orderId, 'action' => 'accept'], $jwtSecret, 'HS256');
                $rejectToken = JWT::encode(['iss' => getenv('app.baseURL'), 'aud' => getenv('app.baseURL'), 'iat' => $issueTime, 'exp' => $expireTime, 'order_id' => $orderId, 'action' => 'reject'], $jwtSecret, 'HS256');

                $acceptLink = getenv('app.baseURL') . '/api/orders/action/' . $acceptToken;
                $rejectLink = getenv('app.baseURL') . '/api/orders/action/' . $rejectToken;

                $email = \Config\Services::email();
                $email->setTo($storeOwner->email);
                $email->setSubject('New Order Notification - Order #' . $orderId);

                                $message = "<p>Hello {$storeOwner->first_name},</p>"
                         . "<p>You have received a new order. Here are the details:</p>"
                         . "<ul>";

                $total = 0;
                foreach ($cartItems as $item) {
                    $itemTotal = $item['price'] * $item['quantity'];
                    $total += $itemTotal;
                    $message .= "<li>{$item['name']} (x{$item['quantity']}) - Total: ₱" . number_format($itemTotal, 2) . "</li>";
                }

                                $message .= "</ul>"
                         . "<p><strong>Total Order Amount: ₱" . number_format($total, 2) . "</strong></p>"
                         . "<p>Please review the order and take action:</p>"
                         . "<div style='margin-top: 20px;'>"
                         . "<a href='{$acceptLink}' style='background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;'>Accept Order</a>"
                         . "<a href='{$rejectLink}' style='background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reject Order</a>"
                         . "</div>"
                         . "<p>Thank you!</p>";

                $email->setMessage($message);
                if (!$email->send()) {
                    log_message('error', 'Failed to send new order email to ' . $storeOwner->email . ': ' . $email->printDebugger(['headers']));
                }
            }

            $db->transComplete();

            if ($db->transStatus() === false) {
                 return $this->failServerError('Transaction failed.');
            }

            return $this->respondCreated(['success' => true, 'message' => 'Order placed successfully!', 'orderId' => $orderId]);

        } catch (\Exception $e) {
            $db->transRollback();
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while creating the order: ' . $e->getMessage());
        }
    }

        public function show($id = null)
    {
        $db = \Config\Database::connect();

        try {
            $order = $db->table('orders')->select('*, total_amount as total')->where('id', $id)->get()->getRowArray();

            if (!$order) {
                return $this->failNotFound('Order not found.');
            }

            $order['items'] = $db->table('order_items')
                                  ->select('order_items.*, products.name, products.image')
                                  ->join('products', 'products.id = order_items.product_id')
                                  ->where('order_id', $id)
                                  ->get()
                                  ->getResultArray();

            return $this->respond(['success' => true, 'order' => $order]);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while fetching the order: ' . $e->getMessage());
        }
    }

    public function cancel($id = null)
    {
        $db = \Config\Database::connect();

        try {
            $order = $db->table('orders')->where('id', $id)->get()->getRowArray();

            if (!$order) {
                return $this->failNotFound('Order not found.');
            }

            if ($order['status'] !== 'pending') {
                return $this->fail('Only pending orders can be cancelled.');
            }

            $db->table('orders')->where('id', $id)->update(['status' => 'cancelled']);

            return $this->respond(['success' => true, 'message' => 'Order cancelled successfully.']);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while cancelling the order: ' . $e->getMessage());
        }
    }

    public function handleOrderAction($token = null)
    {
        if ($token === null) {
            return $this->fail('Invalid action link.');
        }

        try {
            $jwtSecret = getenv('jwt.secret');
            $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));

            $orderId = $decoded->order_id;
            $action = $decoded->action;

            $db = \Config\Database::connect();
            $order = $db->table('orders')->where('id', $orderId)->get()->getRow();

            if (!$order) {
                return $this->failNotFound('<h1>Order Not Found</h1><p>The order you are trying to modify does not exist.</p>');
            }

                        if ($order->status !== 'pending') {
                return $this->respond("<h1>Order Already Processed</h1><p>This order has already been processed. Current status: <strong>{$order->status}</strong></p>");
            }

                        if ($action === 'accept') {
                                                $db->query("UPDATE orders SET status = 'accepted' WHERE id = ?", [$orderId]);
                log_message('info', "Order #{$orderId} status updated to 'accepted'.");
                $this->sendCustomerNotification($orderId, 'accepted');
                return $this->respond('<h1>Order Accepted</h1><p>The order has been successfully marked as accepted. The customer has been notified and you can now prepare it for delivery.</p>');
            } elseif ($action === 'reject') {
                                $db->query("UPDATE orders SET status = 'rejected' WHERE id = ?", [$orderId]);
                log_message('info', "Order #{$orderId} status updated to 'rejected'.");
                $this->sendCustomerNotification($orderId, 'rejected');
                return $this->respond('<h1>Order Rejected</h1><p>The order has been successfully rejected. The customer has been notified.</p>');
            } else {
                return $this->fail('Invalid action specified.');
            }

        } catch (\Exception $e) {
            log_message('error', 'JWT Decode Error: ' . $e->getMessage());
            return $this->fail('<h1>Link Expired or Invalid</h1><p>This action link is either invalid or has expired. Please manage the order from your dashboard.</p>');
        }
    }

    public function updateStatus($id = null)
    {
        $db = \Config\Database::connect();
        $data = $this->request->getJSON(true);

        if (!isset($data['status'])) {
            return $this->fail('New status is required.');
        }

        $newStatus = $data['status'];
        $allowedStatus = ['accepted', 'rejected', 'in_transit', 'delivered', 'cancelled'];

        if (!in_array($newStatus, $allowedStatus)) {
            return $this->fail('Invalid status provided.');
        }

        try {
            $order = $db->table('orders')->where('id', $id)->get()->getRow();
            if (!$order) {
                return $this->failNotFound('Order not found.');
            }

            $updateData = ['status' => $newStatus];

            // If status is 'accepted' and a rider_id is provided, update it
            if ($newStatus === 'accepted' && !empty($data['rider_id'])) {
                $riderId = $data['rider_id'];
                log_message('info', 'Assigning rider ID: ' . $riderId . ' to order ID: ' . $id);
                $updateData['rider_id'] = $riderId;
            }

            $db->table('orders')->where('id', $id)->update($updateData);

            // Optionally, send a notification to the customer about the status change.
            $this->sendCustomerNotification($id, $newStatus);

            return $this->respond(['success' => true, 'message' => 'Order status updated successfully.']);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while updating the order status.');
        }
    }

    private function sendCustomerNotification($orderId, $status)
    {
        $db = \Config\Database::connect();
        $order = $db->table('orders')
                     ->select('orders.*, users.email, users.first_name')
                     ->join('users', 'users.id = orders.customer_id')
                     ->where('orders.id', $orderId)
                     ->get()
                     ->getRow();

        if (!$order || empty($order->email)) {
            log_message('error', "Could not send customer notification for order #{$orderId}. Customer email not found.");
            return;
        }

        $subject = '';
        $body = '';

        if ($status === 'accepted') {
            $subject = "Your Order #{$orderId} has been accepted!";
            $body = "<p>Hello {$order->first_name},</p>"
                  . "<p>Great news! Your order #{$orderId} has been accepted by the store and is now being processed.</p>"
                  . "<p>You will receive another notification once it is out for delivery.</p>"
                  . "<p>Thank you for shopping with us!</p>";
        } elseif ($status === 'rejected') {
            $subject = "Update on your Order #{$orderId}";
            $body = "<p>Hello {$order->first_name},</p>"
                  . "<p>We're sorry, but your order #{$orderId} has been rejected by the store. This may be due to item availability or other reasons.</p>"
                  . "<p>If you have any questions, please contact the store directly. We apologize for any inconvenience.</p>";
        }

        if (!empty($subject)) {
            $email = \Config\Services::email();
            $email->setTo($order->email);
            $email->setSubject($subject);
            $email->setMessage($body);

            if (!$email->send()) {
                log_message('error', 'Failed to send customer notification email to ' . $order->email . ': ' . $email->printDebugger(['headers']));
            }
        }
    }
}
