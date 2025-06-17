<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
// API Routes
$routes->group('api', ['filter' => 'cors'], function ($routes) {
    $routes->resource('categories', ['controller' => 'CategoryController']);
    $routes->resource('stores', ['controller' => 'StoreController']);
    $routes->resource('products', ['controller' => 'ProductController']);

    // Authentication API routes
    $routes->group('auth', function ($routes) {
        $routes->post('login', 'AuthController::login');
        $routes->post('signup', 'AuthController::signup');
        $routes->post('resend-verification', 'AuthController::resendVerification');
        $routes->post('forgot-password', 'AuthController::forgotPassword');
        $routes->post('reset-password/(:segment)', 'AuthController::resetPassword/$1');
        $routes->get('verify-email/(:segment)', 'AuthController::verifyEmail/$1');
    });
});

// Basic route configuration
// Disabling auto-routing is a security best practice.
// All routes should be defined explicitly.
$routes->setAutoRoute(false);
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
