<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

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
