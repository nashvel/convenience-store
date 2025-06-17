<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', ['filter' => 'cors'], function ($routes) {
    $routes->resource('categories', ['controller' => 'CategoryController']);
    $routes->resource('stores', ['controller' => 'StoreController']);
    $routes->resource('products', ['controller' => 'ProductController']);
        $routes->get('notifications', 'NotificationController::index');
    $routes->get('orders', 'OrderController::index');
    $routes->post('orders', 'OrderController::create');
    $routes->get('orders/(:num)', 'OrderController::show/$1');
    $routes->put('orders/cancel/(:num)', 'OrderController::cancel/$1');

    $routes->group('auth', function ($routes) {
        $routes->post('login', 'AuthController::login');
        $routes->post('signup', 'AuthController::signup');
        $routes->post('resend-verification', 'AuthController::resendVerification');
        $routes->post('forgot-password', 'AuthController::forgotPassword');
        $routes->post('reset-password/(:segment)', 'AuthController::resetPassword/$1');
        $routes->get('verify-email/(:segment)', 'AuthController::verifyEmail/$1');
    });
});

$routes->setAutoRoute(false);
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
