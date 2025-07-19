<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/uploads/logos/(:segment)', 'FileController::serveLogo/$1', ['filter' => 'cors']);
$routes->get('/uploads/products/(:segment)', 'FileController::serveProductImage/$1', ['filter' => 'cors']);

$routes->group('api', ['filter' => 'cors'], function ($routes) {
    // Publicly accessible routes
    $routes->get('promotions/active', 'PromotionController::getActivePromotions');
    $routes->get('promotions/image/(:segment)', 'PromotionController::serveImage/$1');
    $routes->get('site-settings', 'SiteSettingsController::getSettings');
    $routes->get('public-settings', 'SettingsController::getPublicSettings');
    $routes->get('categories/nested', 'CategoryController::nested');
    $routes->get('categories', 'CategoryController::index');
    $routes->get('categories/(:segment)', 'CategoryController::show/$1');
    $routes->get('stores', 'StoreController::index');
    $routes->get('stores/(:segment)', 'StoreController::show/$1');
    $routes->get('products', 'ProductController::index');
    $routes->get('products/(:segment)', 'ProductController::show/$1');

    // Authentication routes
    $routes->group('auth', function ($routes) {
        $routes->post('login', 'AuthController::login');
        $routes->post('signup', 'AuthController::signup');
        $routes->post('resend-verification', 'AuthController::resendVerification');
        $routes->post('forgot-password', 'AuthController::forgotPassword');
        $routes->post('reset-password/(:segment)', 'AuthController::resetPassword/$1');
        $routes->get('verify-email/(:segment)', 'AuthController::verifyEmail/$1');
    });

    // Protected routes that require authentication
    $routes->group('admin', ['filter' => 'auth'], function($routes) {
        $routes->get('clients', 'AdminController::getClients');
        $routes->post('clients', 'AdminController::createClient', ['filter' => 'auth']);
        $routes->get('clients/(:num)', 'AdminController::getClient/$1', ['filter' => 'auth']);
        $routes->put('clients/(:num)', 'AdminController::updateClient/$1', ['filter' => 'auth']);
        $routes->delete('clients/(:num)', 'AdminController::deleteClient/$1', ['filter' => 'auth']);
        $routes->get('customers', 'AdminController::getCustomers');
        $routes->put('customers/(:num)', 'AdminController::updateCustomer/$1');
        $routes->post('customers/(:num)/blacklist', 'AdminController::toggleBlacklist/$1');

        // Rider Management
        $routes->put('riders/(:num)', 'AdminController::updateRider/$1');
        $routes->post('riders/(:num)/blacklist', 'AdminController::toggleBlacklist/$1');
        $routes->get('riders', 'AdminController::getRiders');

        // Settings Management
        $routes->get('settings', 'AdminController::getSettings');
        $routes->post('settings', 'AdminController::updateSettings');

        // Product Management
        $routes->get('products', 'AdminProductController::getProducts');
        $routes->delete('products/(:num)', 'AdminProductController::deleteProduct/$1');
        $routes->post('products/update/(:num)', 'AdminProductController::updateProduct/$1');
        $routes->get('categories', 'AdminProductController::getCategories');
        $routes->get('profile', 'AdminController::getProfile');
        $routes->put('profile', 'AdminController::updateProfile');
        $routes->get('monthly-sales', 'AdminController::getMonthlySales');
        $routes->get('statistics', 'AdminController::getStatistics');

        // Promotions Management
        $routes->post('promotions', 'PromotionController::createPromotion', ['filter' => 'auth']);
        $routes->delete('promotions/(:num)', 'PromotionController::delete/$1', ['filter' => 'auth']);

        // Site Settings Management
        $routes->post('site-settings', 'SiteSettingsController::updateSettings');
    });

    $routes->group('', ['filter' => 'auth'], function($routes) {
        // User Addresses
        $routes->get('addresses', 'AddressController::getAddresses');
        $routes->post('addresses', 'AddressController::addAddress');
        $routes->put('addresses/(:num)', 'AddressController::updateAddress/$1');
        $routes->delete('addresses/(:num)', 'AddressController::deleteAddress/$1');
        $routes->put('addresses/set-default/(:num)', 'AddressController::setDefaultAddress/$1');

        // Cart routes
        $routes->get('cart', 'CartController::getCart');
        $routes->post('cart', 'CartController::addToCart');
        $routes->put('cart/items/(:num)', 'CartController::updateCartItem/$1');
        $routes->delete('cart/items/(:num)', 'CartController::removeCartItem/$1');
        $routes->delete('cart', 'CartController::clearCart');

        // Notifications
        $routes->get('notifications', 'NotificationController::index');
        $routes->post('notifications/mark-as-read', 'NotificationController::markAllAsRead');
        $routes->post('notifications/mark-as-read/(:num)', 'NotificationController::markAsRead/$1');

        // Orders
        $routes->group('orders', ['filter' => 'auth'], function ($routes) {
            $routes->get('/', 'OrderController::index');
            $routes->get('(:num)', 'OrderController::show/$1');
            $routes->post('/', 'OrderController::create');
            $routes->put('(:num)', 'OrderController::update/$1');
            $routes->post('(:num)/accept', 'OrderController::acceptOrder/$1');
            $routes->post('(:num)/assign-rider', 'OrderController::assignRider/$1');
            $routes->post('(:num)/complete', 'OrderController::completeOrder/$1');
            $routes->post('(:num)/cancel', 'OrderController::cancelOrder/$1');
            $routes->get('track/(:num)', 'OrderTrackingController::get_tracking_details/$1');
        });

        $routes->get('stores/(:num)/riders', 'RiderController::getRidersByStore/$1');
        $routes->get('my-orders/(:num)', 'OrderController::show/$1');
        $routes->get('orders/action/(:any)', 'OrderController::handleOrderAction/$1');
        $routes->post('orders', 'OrderController::create');
        $routes->get('orders/(:num)', 'OrderController::show/$1');
        $routes->put('orders/cancel/(:num)', 'OrderController::cancel/$1');
        $routes->put('my-orders/cancel/(:num)', 'OrderController::cancel/$1');
        $routes->put('orders/status/(:num)', 'OrderController::updateStatus/$1');

        // Order Tracking
        $routes->post('orders/(:num)/start-delivery', 'OrderTrackingController::start_delivery/$1');
        $routes->post('orders/(:num)/update-location', 'OrderTrackingController::update_location/$1');
        $routes->get('orders/(:num)/latest-location', 'OrderTrackingController::get_latest_location/$1');
        $routes->post('orders/(:num)/cancel-delivery', 'OrderTrackingController::cancel_delivery/$1');

        // Chat
        $routes->get('chats', 'ChatController::getChats', ['filter' => 'auth']);
        $routes->post('chats/find-or-create', 'ChatController::findOrCreateChat', ['filter' => 'auth']);
        $routes->get('chats/(:num)/messages', 'ChatController::getMessages/$1');
        $routes->post('chats/(:num)/messages', 'ChatController::sendMessage/$1');
        $routes->resource('achievements', ['controller' => 'AchievementController', 'only' => ['index']]);
        // User Profile Management
        $routes->post('profile/update', 'UserController::updateProfile');
        $routes->post('password/change', 'UserController::changePassword');

        $routes->resource('users', ['controller' => 'UserController']);
        $routes->get('seller/store', 'StoreController::getStoreForSeller', ['filter' => 'auth']);
        $routes->put('seller/store/update/(:num)', 'StoreController::update/$1', ['filter' => 'auth']);
        $routes->post('seller/store/toggle-status', 'StoreController::toggleStatus', ['filter' => 'auth']);

        $routes->group('seller/products', ['filter' => 'auth'], function ($routes) {
            $routes->get('my-products', 'SellerProductController::getProducts');
            $routes->post('my-products', 'SellerProductController::createProduct');
            $routes->put('my-products/(:num)', 'SellerProductController::updateProduct/$1');
            $routes->delete('my-products/(:num)', 'SellerProductController::deleteProduct/$1');
        });

        // Add-ons Management
        $routes->group('addons', ['filter' => 'auth'], function ($routes) {
            $routes->get('my-store', 'AddOnController::getMyStoreAddOns');
            $routes->get('store/(:num)', 'AddOnController::getStoreAddOns/$1');
            $routes->post('categories', 'AddOnController::createCategory');
            $routes->post('', 'AddOnController::createAddOn');
        });
        
        // Test endpoint for Pizza Palace add-ons
        $routes->get('test/pizza-palace-addons', 'AddOnController::testPizzaPalaceAddOns');
    });
});

$routes->setAutoRoute(false);
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
