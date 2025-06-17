<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class OrderController extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        $userId = $this->request->getGet('userId');
        if (!$userId) {
            return $this->failUnauthorized('User ID is required.');
        }

        $db = \Config\Database::connect();
        try {
            $orders = $db->table('orders')
                         ->select('*, total_amount as total')
                         ->where('customer_id', $userId)
                         ->orderBy('created_at', 'DESC')
                         ->get()
                         ->getResultArray();

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
            $total = $data['total'];

            if (empty($cartItems)) {
                return $this->fail('Cart is empty.');
            }

            // For simplicity, we'll use the store_id from the first cart item.
            $storeId = $cartItems[0]['store_id'];
            $deliveryAddress = json_encode($shippingInfo);

            // Insert into orders table
            $orderData = [
                'customer_id' => $userId,
                'store_id' => $storeId,
                'total_amount' => $total,
                'status' => 'pending',
                'delivery_address' => $deliveryAddress,
                'created_at' => date('Y-m-d H:i:s')
            ];
            $db->table('orders')->insert($orderData);
            $orderId = $db->insertID();

            // Insert into order_items table
            $orderItemsData = [];
            foreach ($cartItems as $item) {
                $orderItemsData[] = [
                    'order_id' => $orderId,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ];
            }
            $db->table('order_items')->insertBatch($orderItemsData);

            // Add a notification for the user
            $message = "Your order #{$orderId} has been placed and is pending review. You will receive an email once it's accepted.";
            $link = "/orders/" . $orderId;
            $notificationData = [
                'user_id' => $userId,
                'message' => $message,
                'link' => $link,
                'created_at' => date('Y-m-d H:i:s')
            ];
            $db->table('notifications')->insert($notificationData);

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
}
