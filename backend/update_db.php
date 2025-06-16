<?php
require __DIR__ . '/public/setup.php';

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Disable foreign key checks
$mysqli->query("SET FOREIGN_KEY_CHECKS = 0");

// Drop all tables
$tables = ['users', 'roles', 'stores', 'categories', 'products', 'orders', 'order_items', 'reviews', 'chats', 'chat_messages', 'settings', 'user_devices', 'remember_me_tokens', 'order_tracking', 'rider_locations', 'email_verifications'];
foreach ($tables as $table) {
    $mysqli->query("DROP TABLE IF EXISTS $table");
}

// Re-enable foreign key checks
$mysqli->query("SET FOREIGN_KEY_CHECKS = 1");

// Run setup script
require __DIR__ . '/public/setup.php';

// Close connection
$mysqli->close();

echo "Database updated successfully!\n";
