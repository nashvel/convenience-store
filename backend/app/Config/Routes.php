<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// API Routes
$routes->group('api', function ($routes) {
    $routes->resource('stores', ['controller' => 'StoreController']);
    $routes->resource('products', ['controller' => 'ProductController']);
});

// Authentication API routes
$routes->post('/api/auth/login', 'AuthController::login');
$routes->post('/api/auth/signup', 'AuthController::signup');
$routes->post('/api/auth/forgot-password', 'AuthController::forgotPassword');
$routes->post('/api/auth/reset-password/(:segment)', 'AuthController::resetPassword/$1');
$routes->get('/api/auth/verify-email/(:segment)', 'AuthController::verifyEmail/$1');

// Basic route configuration
$routes->setAutoRoute(true);
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
