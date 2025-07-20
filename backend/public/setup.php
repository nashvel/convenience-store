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
    $tables = ['cart_items', 'user_addresses', 'users', 'roles', 'stores', 'categories', 'products', 'product_variants', 'attributes', 'attribute_values', 'product_variant_attributes', 'orders', 'order_items', 'order_item_addons', 'addons', 'addon_variants', 'addon_categories', 'reviews', 'chats', 'chat_messages', 'chat_message_media', 'settings', 'user_devices', 'remember_me_tokens', 'order_tracking', 'rider_locations', 'email_verifications', 'notifications', 'achievements', 'rider_achievements', 'promotions', 'promotion_scopes', 'store_promotions', 'site_settings'];
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
            store_id INT(11) UNSIGNED NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL UNIQUE,
            avatar VARCHAR(255) NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            is_blacklisted BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            deleted_at DATETIME NULL,
            FOREIGN KEY (role_id) REFERENCES roles(id)
        )
    ");

    // Create user_addresses table (depends on users)
    $mysqli->query("
        CREATE TABLE user_addresses (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(11) UNSIGNED NOT NULL,
            label VARCHAR(50) NOT NULL, -- e.g., 'Home', 'Work'
            is_default BOOLEAN DEFAULT FALSE,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            line1 VARCHAR(255) NOT NULL,
            line2 VARCHAR(255) NULL,
            city VARCHAR(100) NOT NULL,
            province VARCHAR(100) NOT NULL,
            zip_code VARCHAR(20) NOT NULL,
            latitude DECIMAL(10, 8) NULL,
            longitude DECIMAL(11, 8) NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");



    // Create categories table (no dependencies)
    $mysqli->query("
        CREATE TABLE categories (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            icon VARCHAR(255) NULL,
            parent_id INT(11) UNSIGNED NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
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
            contact_number VARCHAR(20) NULL,
            opening_time TIME NULL,
            closing_time TIME NULL,
            latitude DECIMAL(10, 8) NULL,
            longitude DECIMAL(11, 8) NULL,
            is_active BOOLEAN DEFAULT TRUE,
            store_type VARCHAR(50) NOT NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (client_id) REFERENCES users(id)
        )
    ");

    // Add foreign key from users to stores after both tables are created
    $mysqli->query("ALTER TABLE users ADD CONSTRAINT fk_users_store_id FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL;");

    // Create products table (depends on stores and categories)
    $mysqli->query("
        CREATE TABLE products (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            store_id INT(11) UNSIGNED NOT NULL,
            category_id INT(11) UNSIGNED NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            product_type ENUM('single', 'variable') NOT NULL DEFAULT 'single',
            price DECIMAL(10, 2) NULL, -- Nullable for variable products, price is in variants table
            stock INT(11) NULL, -- Nullable for variable products, stock is in variants table
            image VARCHAR(255) NULL,
            is_active BOOLEAN DEFAULT TRUE,
            is_approved BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )
    ");

    // Create attributes table for product variants (e.g., Color, Size)
    $mysqli->query("
        CREATE TABLE attributes (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        )
    ");

    // Create attribute_values table (e.g., Red, Blue, Small, Large)
    $mysqli->query("
        CREATE TABLE attribute_values (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            attribute_id INT(11) UNSIGNED NOT NULL,
            value VARCHAR(100) NOT NULL,
            FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE,
            UNIQUE KEY (attribute_id, value)
        )
    ");

    // Create product_variants table
    $mysqli->query("
        CREATE TABLE product_variants (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            product_id INT(11) UNSIGNED NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            stock INT(11) NOT NULL,
            sku VARCHAR(100) NULL UNIQUE,
            image_url VARCHAR(255) NULL,
            attributes JSON NULL,
            is_active BOOLEAN DEFAULT TRUE,
            is_approved BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
    ");

    // Create product_variant_attributes pivot table to link variants to their attribute values
    $mysqli->query("
        CREATE TABLE product_variant_attributes (
            variant_id INT(11) UNSIGNED NOT NULL,
            attribute_value_id INT(11) UNSIGNED NOT NULL,
            PRIMARY KEY (variant_id, attribute_value_id),
            FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
            FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(id) ON DELETE CASCADE
        )
    ");

    // Create cart_items table (depends on users and products)
    $mysqli->query("
        CREATE TABLE cart_items (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(11) UNSIGNED NOT NULL,
            product_id INT(11) UNSIGNED NOT NULL,
            variant_id INT(11) UNSIGNED NULL,
            quantity INT(11) NOT NULL DEFAULT 1,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
        )
    ");

    // Create orders table (depends on users, stores, and user_addresses)
    $mysqli->query("
        CREATE TABLE orders (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            customer_id INT(11) UNSIGNED NOT NULL,
            store_id INT(11) UNSIGNED NOT NULL,
            rider_id INT(11) UNSIGNED NULL,
            delivery_address_id INT(11) UNSIGNED NOT NULL,
            status ENUM('pending', 'accepted', 'rejected', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
            total_amount DECIMAL(10,2) NOT NULL,
            payment_method VARCHAR(50) NOT NULL DEFAULT 'cod',
            delivery_fee DECIMAL(10,2) NOT NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (customer_id) REFERENCES users(id),
            FOREIGN KEY (store_id) REFERENCES stores(id),
            FOREIGN KEY (rider_id) REFERENCES users(id),
            FOREIGN KEY (delivery_address_id) REFERENCES user_addresses(id)
        )
    ");

    // Create notifications table (depends on users)
    $mysqli->query("
        CREATE TABLE notifications (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(11) UNSIGNED NOT NULL,
            message TEXT NOT NULL,
            link VARCHAR(255) NULL,
            type VARCHAR(50) NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
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

    // Create addon_categories table (for organizing add-ons like Drinks, Sides, etc.)
    $mysqli->query("
        CREATE TABLE addon_categories (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            store_id INT(11) UNSIGNED NOT NULL,
            name VARCHAR(100) NOT NULL,
            description TEXT NULL,
            display_order INT(11) DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
        )
    ");

    // Create addons table (main add-ons like Coke, Fries, etc.)
    $mysqli->query("
        CREATE TABLE addons (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            store_id INT(11) UNSIGNED NOT NULL,
            addon_category_id INT(11) UNSIGNED NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            image VARCHAR(255) NULL,
            base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            is_required BOOLEAN DEFAULT FALSE,
            max_selections INT(11) DEFAULT 1,
            display_order INT(11) DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            is_approved BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
            FOREIGN KEY (addon_category_id) REFERENCES addon_categories(id) ON DELETE CASCADE
        )
    ");

    // Create addon_variants table (for size, color, etc. variations)
    $mysqli->query("
        CREATE TABLE addon_variants (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            addon_id INT(11) UNSIGNED NOT NULL,
            variant_name VARCHAR(100) NOT NULL,
            variant_value VARCHAR(100) NOT NULL,
            price_modifier DECIMAL(10,2) DEFAULT 0.00,
            stock_quantity INT(11) DEFAULT 0,
            is_unlimited_stock BOOLEAN DEFAULT TRUE,
            is_active BOOLEAN DEFAULT TRUE,
            is_approved BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
        )
    ");

    // Create order_item_addons table (links order items to selected add-ons)
    $mysqli->query("
        CREATE TABLE order_item_addons (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            order_item_id INT(11) UNSIGNED NOT NULL,
            addon_id INT(11) UNSIGNED NOT NULL,
            addon_variant_id INT(11) UNSIGNED NULL,
            quantity INT(11) NOT NULL DEFAULT 1,
            price DECIMAL(10,2) NOT NULL,
            created_at DATETIME NULL,
            FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
            FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
            FOREIGN KEY (addon_variant_id) REFERENCES addon_variants(id) ON DELETE CASCADE
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
            shipping_method VARCHAR(50) NOT NULL DEFAULT 'door_to_door',
            shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
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
            message TEXT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at DATETIME NULL,
            FOREIGN KEY (chat_id) REFERENCES chats(id),
            FOREIGN KEY (sender_id) REFERENCES users(id)
        )
    ");

    // Create chat_message_media table (depends on chat_messages)
    $mysqli->query("
        CREATE TABLE chat_message_media (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            chat_message_id INT(11) UNSIGNED NOT NULL,
            media_type ENUM('image', 'video') NOT NULL,
            media_url VARCHAR(255) NOT NULL,
            thumbnail_url VARCHAR(255) NULL,
            created_at DATETIME NULL,
            FOREIGN KEY (chat_message_id) REFERENCES chat_messages(id) ON DELETE CASCADE
        )
    ");

    // Create achievements table (managed by admin)
    $mysqli->query("
        CREATE TABLE achievements (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            icon VARCHAR(100) NOT NULL, -- e.g., 'FaTrophy'
            metric VARCHAR(100) NOT NULL, -- e.g., 'completed_orders', 'perfect_rating_streak_days'
            goal INT(11) NOT NULL, -- e.g., 250 (for orders), 30 (for days)
            created_at DATETIME NULL,
            updated_at DATETIME NULL
        )
    ");

    // Create rider_achievements table (tracks rider progress)
    $mysqli->query("
        CREATE TABLE rider_achievements (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            rider_id INT(11) UNSIGNED NOT NULL,
            achievement_id INT(11) UNSIGNED NOT NULL,
            progress INT(11) DEFAULT 0,
            unlocked_at DATETIME NULL,
            created_at DATETIME NULL,
            updated_at DATETIME NULL,
            FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
            UNIQUE KEY unique_rider_achievement (rider_id, achievement_id)
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

    // Create promotions table
    $mysqli->query("
        CREATE TABLE promotions (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NULL,
            discount_type ENUM('percentage', 'fixed') NOT NULL,
            discount_value DECIMAL(10, 2) NOT NULL,
            start_date DATETIME NOT NULL,
            end_date DATETIME NOT NULL,
            promo_image_banner VARCHAR(255) NULL,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            created_at DATETIME NULL,
            updated_at DATETIME NULL
        )
    ");

    // Create promotion_scopes table
    $mysqli->query("
        CREATE TABLE promotion_scopes (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            promotion_id INT(11) UNSIGNED NOT NULL,
            scope_type ENUM('all_products', 'store', 'category', 'product') NOT NULL,
            scope_value INT(11) UNSIGNED NULL, -- Can be store_id, category_id, or product_id. NULL for 'all_products'
            FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE
        )
    ");

    // Create store_promotions table
    $mysqli->query("
        CREATE TABLE store_promotions (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            store_id INT(11) UNSIGNED NOT NULL,
            promotion_id INT(11) UNSIGNED NOT NULL,
            is_participating BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
            FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE
        )
    ");

    // Create site_settings table
    $mysqli->query("
        CREATE TABLE site_settings (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            setting_name VARCHAR(255) NOT NULL UNIQUE,
            setting_value VARCHAR(255) NOT NULL
        )
    ");



    echo "Database setup completed successfully!\n";


} catch (Exception $e) {
    echo "Error setting up database: " . $e->getMessage() . "\n";
}
