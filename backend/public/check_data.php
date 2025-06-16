<?php

$host = 'localhost';
$dbname = 'convenience_store';
$username = 'root';
$password = '';

try {
    $mysqli = new mysqli($host, $username, $password, $dbname);
    
    if ($mysqli->connect_error) {
        throw new Exception("Connection failed: " . $mysqli->connect_error);
    }

    // Check roles
    echo "\nRoles:\n";
    $result = $mysqli->query("SELECT * FROM roles");
    while ($row = $result->fetch_assoc()) {
        echo "- ID: " . $row['id'] . ", Name: " . $row['name'] . "\n";
    }

    // Check users
    echo "\nUsers:\n";
    $result = $mysqli->query("SELECT id, role_id, email, first_name, last_name FROM users");
    while ($row = $result->fetch_assoc()) {
        echo "- ID: " . $row['id'] . ", Role: " . $row['role_id'] . ", Email: " . $row['email'] . ", Name: " . $row['first_name'] . " " . $row['last_name'] . "\n";
    }

    // Check stores
    echo "\nStores:\n";
    $result = $mysqli->query("SELECT id, client_id, name, is_active FROM stores");
    while ($row = $result->fetch_assoc()) {
        echo "- ID: " . $row['id'] . ", Client: " . $row['client_id'] . ", Name: " . $row['name'] . ", Active: " . ($row['is_active'] ? 'Yes' : 'No') . "\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
