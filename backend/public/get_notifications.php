<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

$userId = $_GET['userId'] ?? null;

if (!$userId) {
    die(json_encode(['success' => false, 'message' => 'User ID is required.']));
}

$stmt = $mysqli->prepare("SELECT id, message, link, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC");

if ($stmt === false) {
    die(json_encode(['success' => false, 'message' => 'Failed to prepare statement: ' . $mysqli->error]));
}

$stmt->bind_param("i", $userId);

if (!$stmt->execute()) {
    die(json_encode(['success' => false, 'message' => 'Failed to execute statement: ' . $stmt->error]));
}

$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

$stmt->close();
$mysqli->close();

echo json_encode(['success' => true, 'notifications' => $notifications]);
?>
