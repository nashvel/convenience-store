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
    $tables = ['users', 'roles', 'stores', 'categories', 'products', 'orders', 'order_items', 'reviews', 'chats', 'chat_messages', 'settings', 'user_devices', 'remember_me_tokens', 'order_tracking', 'rider_locations', 'email_verifications'];
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
            stock INT(11) NOT NULL DEFAULT 0,
            featured BOOLEAN DEFAULT FALSE,
            sales_count INT(11) NOT NULL DEFAULT 0,
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

    // Create notifications table (depends on users)
    $mysqli->query("
        CREATE TABLE notifications (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(11) UNSIGNED NOT NULL,
            message TEXT NOT NULL,
            link VARCHAR(255) NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
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

    // --- SEEDING DATA ---

    // Hash a default password
    $defaultPassword = password_hash('password123', PASSWORD_DEFAULT);

    // Insert Client Users
    $mysqli->query("
        INSERT INTO users (role_id, email, password_hash, first_name, last_name, phone, address, is_verified, created_at)
        VALUES
        (2, 'zereffdraken@gmail.com', '$defaultPassword', 'Jay', 'Nashville', '111111111', '001 Tech Road', TRUE, NOW()),
        (2, 'nozelikari@gmail.com', '$defaultPassword', 'Jill', 'Fashion', '222222222', '002 Fashion Ave', TRUE, NOW()),
        (2, 'yutarosalad3@gmail.com', '$defaultPassword', 'Jared', 'Home', '333333333', '003 Home St', TRUE, NOW())
    ");
    $client1_id = $mysqli->insert_id;
    $client2_id = $client1_id + 1;
    $client3_id = $client1_id + 2;

    // Insert Stores
    $mysqli->query("
        INSERT INTO stores (client_id, name, description, address, logo, created_at)
        VALUES
        ($client1_id, 'Tech World', 'Your one-stop shop for all things tech.', '001 Tech Road', 'techworld.png', NOW()),
        ($client2_id, 'Fashion Hub', 'The latest trends in fashion.', '002 Fashion Ave', 'fashionhub.png', NOW()),
        ($client3_id, 'Home Essentials', 'Everything you need for your home.', '003 Home St', 'homeessentials.png', NOW())
    ");
    $store1_id = $mysqli->insert_id;
    $store2_id = $store1_id + 1;
    $store3_id = $store1_id + 2;

    // Insert Categories
    $mysqli->query("
        INSERT INTO categories (name, icon, created_at) VALUES
        ('Electronics', 'fa-laptop', NOW()),
        ('Fashion', 'fa-tshirt', NOW()),
        ('Home', 'fa-home', NOW()),
        ('Books', 'fa-book', NOW()),
        ('Sports', 'fa-futbol', NOW()),
        ('Food', 'fa-utensils', NOW())
    ");
    $cat_electronics_id = $mysqli->insert_id;
    $cat_fashion_id = $cat_electronics_id + 1;
    $cat_home_id = $cat_electronics_id + 2;
    $cat_books_id = $cat_electronics_id + 3;
    $cat_sports_id = $cat_electronics_id + 4;
    $cat_food_id = $cat_electronics_id + 5;

    // Insert Products
    $mysqli->query("
        INSERT INTO products (store_id, category_id, name, description, price, image, stock, featured, sales_count, is_approved, created_at)
        VALUES
        -- Tech World Products
        ($store1_id, $cat_electronics_id, 'Wireless Mouse', 'Ergonomic wireless mouse.', 49.99, 'mouse.jpg', 150, TRUE, 250, TRUE, NOW()),
        ($store1_id, $cat_electronics_id, 'Mechanical Keyboard', 'RGB mechanical keyboard.', 69.99, 'keyboard.jpg', 120, FALSE, 120, TRUE, NOW()),
        ($store1_id, $cat_electronics_id, 'USB-C Hub', '7-in-1 USB-C hub.', 39.99, 'usbc_hub.jpg', 200, FALSE, 80, TRUE, NOW()),
        ($store1_id, $cat_electronics_id, 'Noise Cancelling Headphones', 'Over-ear headphones.', 199.99, 'headphones.jpg', 80, TRUE, 300, TRUE, NOW()),
        ($store1_id, $cat_electronics_id, '4K Webcam', 'Webcam with ring light.', 89.99, 'webcam.jpg', 100, FALSE, 90, TRUE, NOW()),
        ($store1_id, $cat_electronics_id, 'Portable SSD', '1TB portable SSD.', 129.99, 'ssd.jpg', 70, TRUE, 180, TRUE, NOW()),
        ($store1_id, $cat_electronics_id, 'Gaming Monitor', '27-inch 144Hz gaming monitor.', 299.99, 'monitor.jpg', 50, FALSE, 40, TRUE, NOW()),
        ($store1_id, $cat_electronics_id, 'Laptop Stand', 'Adjustable aluminum laptop stand.', 29.99, 'laptop_stand.jpg', 180, FALSE, 60, TRUE, NOW()),
        ($store1_id, $cat_books_id, 'The Great Gatsby', 'A classic novel.', 12.99, 'thegreatgatsby.jpg', 250, FALSE, 150, TRUE, NOW()),
        ($store1_id, $cat_food_id, 'Energy Drink', 'A can of energy drink.', 2.99, 'energy_drink.jpg', 500, FALSE, 400, TRUE, NOW()),

        -- Fashion Hub Products
        ($store2_id, $cat_fashion_id, 'Summer Dress', 'Light and airy summer dress.', 39.99, 'summer_dress.jpg', 120, TRUE, 210, TRUE, NOW()),
        ($store2_id, $cat_fashion_id, 'Leather Jacket', 'Classic leather jacket.', 149.99, 'leather_jacket.jpg', 60, FALSE, 90, TRUE, NOW()),
        ($store2_id, $cat_fashion_id, 'Skinny Jeans', 'Comfortable skinny jeans.', 59.99, 'jeans.jpg', 200, FALSE, 180, TRUE, NOW()),
        ($store2_id, $cat_fashion_id, 'T-Shirt', 'Plain white t-shirt.', 19.99, 'tshirt.jpg', 300, FALSE, 250, TRUE, NOW()),
        ($store2_id, $cat_fashion_id, 'Sneakers', 'Stylish sneakers.', 79.99, 'sneakers.jpg', 150, TRUE, 320, TRUE, NOW()),
        ($store2_id, $cat_fashion_id, 'Sunglasses', 'UV protection sunglasses.', 24.99, 'sunglasses.jpg', 180, FALSE, 110, TRUE, NOW()),
        ($store2_id, $cat_fashion_id, 'Watch', 'Minimalist wrist watch.', 99.99, 'watch.jpg', 90, FALSE, 70, TRUE, NOW()),
        ($store2_id, $cat_fashion_id, 'Beanie', 'Warm winter beanie.', 14.99, 'beanie.jpg', 220, FALSE, 130, TRUE, NOW()),
        ($store2_id, $cat_fashion_id, 'Umbrella', 'Windproof umbrella.', 29.99, 'umbrella.jpg', 130, FALSE, 50, TRUE, NOW()),
        ($store2_id, $cat_sports_id, 'Basketball', 'Official size basketball.', 24.99, 'basketball.jpg', 100, TRUE, 190, TRUE, NOW()),

        -- Home Essentials Products
        ($store3_id, $cat_home_id, 'Pillow', 'Memory foam pillow.', 19.99, 'pillow.jpg', 200, TRUE, 280, TRUE, NOW()),
        ($store3_id, $cat_home_id, 'Scented Candles', 'Set of 3 scented candles.', 24.99, 'candles.jpg', 250, FALSE, 180, TRUE, NOW()),
        ($store3_id, $cat_home_id, 'Coffee Maker', '12-cup coffee maker.', 49.99, 'coffee_maker.jpg', 80, FALSE, 120, TRUE, NOW()),
        ($store3_id, $cat_home_id, 'Towel Set', '6-piece towel set.', 34.99, 'towel_set.jpg', 150, FALSE, 90, TRUE, NOW()),
        ($store3_id, $cat_home_id, 'Cookware Set', '10-piece non-stick cookware set.', 89.99, 'cookware.jpg', 60, TRUE, 220, TRUE, NOW()),
        ($store3_id, $cat_home_id, 'Picture Frame', '8x10 picture frame.', 9.99, 'picture_frame.jpg', 300, FALSE, 50, TRUE, NOW()),
        ($store3_id, $cat_home_id, 'Wall Clock', 'Modern wall clock.', 19.99, 'wall_clock.jpg', 120, FALSE, 70, TRUE, NOW()),
        ($store3_id, $cat_home_id, 'Desk Lamp', 'LED desk lamp.', 29.99, 'desk_lamp.jpg', 140, FALSE, 100, TRUE, NOW()),
        ($store3_id, $cat_home_id, 'Throw Blanket', 'Cozy throw blanket.', 24.99, 'blanket.jpg', 180, TRUE, 260, TRUE, NOW()),
        ($store3_id, $cat_food_id, 'Instant Noodles', 'Pack of 5 instant noodles.', 4.99, 'noodles.jpg', 500, FALSE, 450, TRUE, NOW())
    ");

    echo "Database setup and seeding completed successfully!\n";
} catch (Exception $e) {
    echo "Error setting up database: " . $e->getMessage() . "\n";
}
