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

    // Get list of all tables
    $result = $mysqli->query("SHOW TABLES");
    
    echo "Database Tables:\n";
    while ($row = $result->fetch_row()) {
        echo "- " . $row[0] . "\n";
    }

    // Check specific tables
    $tables = ['users', 'stores'];
    foreach ($tables as $table) {
        $result = $mysqli->query("SHOW TABLES LIKE '$table'");
        if ($result->num_rows > 0) {
            echo "\nTable $table exists. Structure:\n";
            $columns = $mysqli->query("DESCRIBE $table");
            while ($column = $columns->fetch_assoc()) {
                echo "- " . $column['Field'] . " (" . $column['Type'] . ")\n";
            }
        } else {
            echo "\nTable $table does not exist.\n";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
