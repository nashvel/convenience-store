<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Database connection
$host = 'localhost';
$dbname = 'convenience_store';
$username = 'root';
$password = '';

$mysqli = new mysqli($host, $username, $password, $dbname);

if ($mysqli->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $mysqli->connect_error]));
}

// Get the posted data
$data = json_decode(file_get_contents('php://input'), true);

$userId = $data['userId'] ?? null;
$cartItems = $data['cartItems'] ?? [];
$shippingInfo = $data['shippingInfo'] ?? [];
$subtotal = $data['subtotal'] ?? 0;
$tax = $data['tax'] ?? 0;
$total = $data['total'] ?? 0;

if (!$userId || empty($cartItems) || empty($shippingInfo)) {
    die(json_encode(['success' => false, 'message' => 'Missing required order data.']));
}

$mysqli->begin_transaction();

try {
    // Insert into orders table
        $stmt = $mysqli->prepare("INSERT INTO orders (customer_id, store_id, total_amount, status, delivery_address, created_at) VALUES (?, ?, ?, 'pending', ?, NOW())");
    
    // For simplicity, we'll use the store_id from the first cart item.
    // In a real multi-store cart, you might create separate orders per store.
    $storeId = $cartItems[0]['store_id']; 
        $deliveryAddress = json_encode($shippingInfo);

    $stmt->bind_param("iids", $userId, $storeId, $total, $deliveryAddress);
    $stmt->execute();
    
    $orderId = $mysqli->insert_id;
    $stmt->close();

    // Insert into order_items table
    $stmt = $mysqli->prepare("INSERT INTO order_items (order_id, product_id, quantity, price, created_at) VALUES (?, ?, ?, ?, NOW())");

    foreach ($cartItems as $item) {
        $productId = $item['id'];
        $quantity = $item['quantity'];
        $price = $item['price'];
        $stmt->bind_param("iiid", $orderId, $productId, $quantity, $price);
        $stmt->execute();
    }

    $stmt->close();
        $mysqli->commit();

    // Add a notification for the user
    $message = "Your order #{$orderId} has been placed and is pending review. You will receive an email once it's accepted.";
    $link = "/orders/" . $orderId;
    $stmt = $mysqli->prepare("INSERT INTO notifications (user_id, message, link, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("iss", $userId, $message, $link);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true, 'message' => 'Order placed successfully!', 'orderId' => $orderId]);

} catch (Exception $e) {
    $mysqli->rollback();
    echo json_encode(['success' => false, 'message' => 'Failed to place order: ' . $e->getMessage()]);
}

$mysqli->close();
?>
