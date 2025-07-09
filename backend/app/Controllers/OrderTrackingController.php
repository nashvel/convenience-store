<?php

namespace App\Controllers;

use App\Models\OrderModel;
use App\Models\OrderTrackingModel;
use App\Models\NotificationModel;
use CodeIgniter\RESTful\ResourceController;

class OrderTrackingController extends ResourceController
{
    protected $format = 'json';

    public function start_delivery($order_id)
    {
        $orderModel = new OrderModel();
        $notificationModel = new NotificationModel();

        $order = $orderModel->find($order_id);

        if (!$order) {
            return $this->failNotFound('Order not found.');
        }

        // Update order status to 'in_transit'
        $orderModel->update($order_id, ['status' => 'in_transit']);

        // Create a notification for the customer
        $notificationModel->save([
            'user_id' => $order['customer_id'],
            'message' => 'Your order #' . $order_id . ' is on its way!',
            'link' => '/orders/track/' . $order_id,
        ]);

        return $this->respond(['message' => 'Delivery started successfully.']);
    }

    public function update_location($order_id)
    {
        $trackingModel = new OrderTrackingModel();
        
        // Assuming you have a way to get the authenticated rider's ID
        // For example, from a JWT token or session
        $rider_id = $this->request->user->id; // Placeholder for authenticated user ID

        $data = $this->request->getJSON();

        if (!isset($data->latitude) || !isset($data->longitude)) {
            return $this->failValidationError('Latitude and longitude are required.');
        }

        $trackingModel->save([
            'order_id'  => $order_id,
            'rider_id'  => $rider_id,
            'latitude'  => $data->latitude,
            'longitude' => $data->longitude,
            'timestamp' => date('Y-m-d H:i:s')
        ]);

        return $this->respondCreated(['message' => 'Location updated.']);
    }

    public function get_latest_location($order_id)
    {
        $trackingModel = new OrderTrackingModel();

        $latestLocation = $trackingModel->getLatestLocation($order_id);

        if (!$latestLocation) {
            return $this->failNotFound('No location data found for this order.');
        }

        return $this->respond($latestLocation);
    }

    public function get_tracking_details($order_id)
    {
        $orderModel = new OrderModel();
        $trackingModel = new OrderTrackingModel();

        $order = $orderModel->getOrderDetails($order_id);

        if (!$order) {
            return $this->failNotFound('Order not found.');
        }

        // Fetch order items separately
        $items = $orderModel->getOrderItems($order_id);

        $latestLocation = $trackingModel->getLatestLocation($order_id);

        // Calculate Estimated Delivery Time (EDT) by adding 30 minutes to order creation time
        $created_at = new \DateTime($order['created_at']);
        $created_at->add(new \DateInterval('PT30M'));
        $edt = $created_at->format('Y-m-d H:i:s');

        $data = [
            'id' => $order['id'],
            'status' => $order['status'],
            'created_at' => $order['created_at'],
            'estimated_delivery_time' => $edt,
            'items' => $items,
            'store' => [
                'name' => $order['store_name'],
                'latitude' => $order['store_latitude'],
                'longitude' => $order['store_longitude'],
            ],
            'customer' => [
                'name' => $order['customer_name'],
                'address' => $order['delivery_address'],
                'latitude' => $order['delivery_latitude'],
                'longitude' => $order['delivery_longitude'],
            ],
            'rider' => $latestLocation ? [
                'name' => $order['rider_name'],
                'latitude' => $latestLocation['latitude'],
                'longitude' => $latestLocation['longitude'],
                'timestamp' => $latestLocation['created_at'], // Corrected from 'timestamp'
            ] : null
        ];

        return $this->respond($data);
    }

    public function cancel_delivery($order_id)
    {
        $orderModel = new OrderModel();
        $notificationModel = new NotificationModel();
        $reason = $this->request->getJSON()->reason ?? 'failed_attempt';

        $order = $orderModel->find($order_id);
        if (!$order) {
            return $this->failNotFound('Order not found.');
        }

        if ($reason === 'redeliver_later') {
            // Revert order status to 'accepted' for redelivery
            $orderModel->update($order_id, ['status' => 'accepted']);

            // Notify customer about redelivery
            $notificationModel->save([
                'user_id' => $order['customer_id'],
                'message' => 'Heads up! Your delivery for order #' . $order_id . ' will be re-attempted shortly.',
                'link' => '/orders/track/' . $order_id,
            ]);

            $this->_sendCancellationEmail($order_id, 'redeliver_later');

            return $this->respond(['message' => 'Delivery rescheduled. The order will be redelivered.']);
        } else {
            // Default to 'failed_attempt', mark as cancelled
            $orderModel->update($order_id, ['status' => 'cancelled']);

            // Notify customer about the failed attempt
            $notificationModel->save([
                'user_id' => $order['customer_id'],
                'message' => 'We are sorry, but the delivery for order #' . $order_id . ' was unsuccessful. Please contact support for assistance.',
                'link' => '/orders/track/' . $order_id,
            ]);

            $this->_sendCancellationEmail($order_id, 'failed_attempt');

            return $this->respond(['message' => 'Delivery marked as a failed attempt.']);
        }
    }

    private function _sendCancellationEmail($order_id, $reason)
    {
        $db = \Config\Database::connect();
        $order = $db->table('orders')
                     ->select('orders.*, users.email, users.first_name')
                     ->join('users', 'users.id = orders.customer_id')
                     ->where('orders.id', $order_id)
                     ->get()
                     ->getRow();

        if (!$order || empty($order->email)) {
            log_message('error', "Could not send cancellation email for order #{$order_id}. Customer email not found.");
            return;
        }

        $subject = '';
        $body = '';

        if ($reason === 'redeliver_later') {
            $subject = "Update on your Order #{$order_id}";
            $body = "<p>Hello {$order->first_name},</p>"
                  . "<p>Heads up! Your delivery for order #{$order_id} was unable to be completed on the first attempt. It will be re-attempted shortly.</p>"
                  . "<p>You can track your order for the latest updates.</p>"
                  . "<p>Thank you for your patience!</p>";
        } else { // failed_attempt
            $subject = "Important Update on your Order #{$order_id}";
            $body = "<p>Hello {$order->first_name},</p>"
                  . "<p>We're very sorry, but the delivery for your order #{$order_id} was unsuccessful after an attempt by our rider.</p>"
                  . "<p>The order has now been cancelled. If you have any questions or believe this is in error, please contact our support team.</p>"
                  . "<p>We apologize for any inconvenience this has caused.</p>";
        }

        if (!empty($subject)) {
            $email = \Config\Services::email();
            $email->setTo($order->email);
            $email->setSubject($subject);
            $email->setMessage($body);

            if (!$email->send()) {
                log_message('error', 'Failed to send cancellation email to ' . $order->email . ': ' . $email->printDebugger(['headers']));
            }
        }
    }
}
