<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/uploads/logos/(:segment)', 'FileController::serveLogo/$1', ['filter' => 'cors']);

$routes->group('api', ['filter' => 'cors'], function ($routes) {
    // Publicly accessible routes
    $routes->resource('categories', ['controller' => 'CategoryController']);
    $routes->resource('stores', ['controller' => 'StoreController']);
    $routes->resource('products', ['controller' => 'ProductController']);

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
        $routes->get('products', 'AdminController::getProducts');
    $routes->delete('products/(:num)', 'AdminController::deleteProduct/$1');
    $routes->post('products/update/(:num)', 'AdminController::updateProduct/$1');
    $routes->get('categories', 'AdminController::getCategories');
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
        $routes->get('orders', 'OrderController::index');
        $routes->get('orders/action/(:any)', 'OrderController::handleOrderAction/$1');
        $routes->post('orders', 'OrderController::create');
        $routes->get('orders/(:num)', 'OrderController::show/$1');
        $routes->put('orders/cancel/(:num)', 'OrderController::cancel/$1');
        $routes->put('orders/status/(:num)', 'OrderController::updateStatus/$1');
    });
});

$routes->setAutoRoute(false);
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
