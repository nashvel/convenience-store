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

    // Disable foreign key checks
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");

    // Drop all tables
    $tables = ['users', 'roles', 'stores', 'categories', 'products', 'orders', 'order_items', 'reviews', 'chats', 'chat_messages', 'settings', 'user_devices', 'remember_me_tokens', 'order_tracking', 'rider_locations'];
    foreach ($tables as $table) {
        $mysqli->query("DROP TABLE IF EXISTS $table");
    }

    // Re-enable foreign key checks
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");

    // Create roles table first
    $mysqli->query("
        CREATE TABLE roles (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(255),
            created_at DATETIME NULL,
            updated_at DATETIME NULL
        )
    ");

    // Create users table next (depends on roles)
    $mysqli->query("
        CREATE TABLE users (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            role_id INT(11) UNSIGNED NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL UNIQUE,
            avatar VARCHAR(255) NULL,
            address TEXT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            is_blacklisted BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            deleted_at DATETIME NULL
        )
    ");

    // Insert default roles
    $mysqli->query("
        INSERT INTO roles (name, description, created_at) VALUES
        ('customer', 'Regular customer', NOW()),
        ('client', 'Store owner', NOW()),
        ('rider', 'Delivery rider', NOW()),
        ('admin', 'System administrator', NOW())
    ");

    // Create categories table (no dependencies)
    $mysqli->query("
        CREATE TABLE categories (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            icon VARCHAR(255) NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL
        )
    ");

    // Create stores table (depends on users)
    $mysqli->query("
        CREATE TABLE stores (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            client_id INT(11) UNSIGNED NOT NULL,
            name VARCHAR(100) NOT NULL,
            description TEXT NULL,
            address TEXT NOT NULL,
            logo VARCHAR(255) NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (client_id) REFERENCES users(id)
        )
    ");

    // Create products table (depends on stores and categories)
    $mysqli->query("
        CREATE TABLE products (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            store_id INT(11) UNSIGNED NOT NULL,
            category_id INT(11) UNSIGNED NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            price DECIMAL(10,2) NOT NULL,
            image VARCHAR(255) NULL,
            is_approved BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (store_id) REFERENCES stores(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    ");

    // Create orders table (depends on users and stores)
    $mysqli->query("
        CREATE TABLE orders (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            customer_id INT(11) UNSIGNED NOT NULL,
            store_id INT(11) UNSIGNED NOT NULL,
            rider_id INT(11) UNSIGNED NULL,
            status ENUM('pending', 'accepted', 'rejected', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
            total_amount DECIMAL(10,2) NOT NULL,
            delivery_address TEXT NOT NULL,
            delivery_fee DECIMAL(10,2) NOT NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (customer_id) REFERENCES users(id),
            FOREIGN KEY (store_id) REFERENCES stores(id),
            FOREIGN KEY (rider_id) REFERENCES users(id)
        )
    ");

    // Create user_devices table (depends on users)
    $mysqli->query("
        CREATE TABLE user_devices (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(11) UNSIGNED NOT NULL,
            device_name VARCHAR(255) NOT NULL,
            device_type VARCHAR(50) NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            location VARCHAR(255) NULL,
            user_agent TEXT NOT NULL,
            last_active DATETIME NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ");

    // Create remember_me_tokens table (depends on users and user_devices)
    $mysqli->query("
        CREATE TABLE remember_me_tokens (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(11) UNSIGNED NOT NULL,
            token VARCHAR(255) NOT NULL,
            device_id INT(11) UNSIGNED NOT NULL,
            expires_at DATETIME NOT NULL,
            is_revoked BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (device_id) REFERENCES user_devices(id),
            UNIQUE KEY unique_token (user_id, token)
        )
    ");

    // Create order_items table (depends on orders and products)
    $mysqli->query("
        CREATE TABLE order_items (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            order_id INT(11) UNSIGNED NOT NULL,
            product_id INT(11) UNSIGNED NOT NULL,
            quantity INT(11) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            size VARCHAR(10) NULL,
            created_at DATETIME NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ");

    // Create order_tracking table (depends on orders and users)
    $mysqli->query("
        CREATE TABLE order_tracking (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            order_id INT(11) UNSIGNED NOT NULL,
            rider_id INT(11) UNSIGNED NOT NULL,
            status ENUM('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled') NOT NULL,
            latitude DECIMAL(10,8) NULL,
            longitude DECIMAL(10,8) NULL,
            estimated_delivery_time DATETIME NULL,
            actual_delivery_time DATETIME NULL,
            notes TEXT NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (rider_id) REFERENCES users(id)
        )
    ");

    // Create rider_locations table (depends on users and orders)
    $mysqli->query("
        CREATE TABLE rider_locations (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            rider_id INT(11) UNSIGNED NOT NULL,
            order_id INT(11) UNSIGNED NULL,
            latitude DECIMAL(10,8) NOT NULL,
            longitude DECIMAL(10,8) NOT NULL,
            speed DECIMAL(5,2) NULL,
            heading DECIMAL(5,2) NULL,
            battery_level TINYINT(3) NULL,
            created_at DATETIME NULL,
            FOREIGN KEY (rider_id) REFERENCES users(id),
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )
    ");

    // Create reviews table (depends on users, products, and orders)
    $mysqli->query("
        CREATE TABLE reviews (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            customer_id INT(11) UNSIGNED NOT NULL,
            product_id INT(11) UNSIGNED NOT NULL,
            order_id INT(11) UNSIGNED NOT NULL,
            rating TINYINT(1) NOT NULL,
            comment TEXT NULL,
            is_thumbs_up BOOLEAN DEFAULT FALSE,
            is_thumbs_down BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            FOREIGN KEY (customer_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id),
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )
    ");

    // Create email_verifications table
    $mysqli->query("
        CREATE TABLE email_verifications (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(11) UNSIGNED NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            deleted_at DATETIME NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ");

    // Create chats table (depends on stores and users)
    $mysqli->query("
        CREATE TABLE chats (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            store_id INT(11) UNSIGNED NOT NULL,
            customer_id INT(11) UNSIGNED NOT NULL,
            order_id INT(11) UNSIGNED NULL,
            created_at DATETIME NULL,
            FOREIGN KEY (store_id) REFERENCES stores(id),
            FOREIGN KEY (customer_id) REFERENCES users(id),
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )
    ");

    // Create chat_messages table (depends on chats and users)
    $mysqli->query("
        CREATE TABLE chat_messages (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            chat_id INT(11) UNSIGNED NOT NULL,
            sender_id INT(11) UNSIGNED NOT NULL,
            message TEXT NOT NULL,
            image VARCHAR(255) NULL,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            FOREIGN KEY (chat_id) REFERENCES chats(id),
            FOREIGN KEY (sender_id) REFERENCES users(id)
        )
    ");

    // Create settings table (no dependencies)
    $mysqli->query("
        CREATE TABLE settings (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `key` VARCHAR(50) NOT NULL,
            value TEXT NOT NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            UNIQUE KEY unique_key (`key`)
        )
    ");

    // Add default settings
    $mysqli->query("
        INSERT INTO settings (`key`, value, created_at) VALUES
        ('app_name', 'NashQuickMart', NOW()),
        ('app_description', 'Quick and Easy Shopping at Your Fingertips\nOrder your favorite convenience store items with just a few clicks', NOW()),
        ('facebook_url', '', NOW()),
        ('twitter_url', '', NOW()),
        ('instagram_url', '', NOW()),
        ('api_logging', 'true', NOW())
    ");

    echo "Database setup completed successfully!\n";
} catch (Exception $e) {
    echo "Error setting up database: " . $e->getMessage() . "\n";
}
