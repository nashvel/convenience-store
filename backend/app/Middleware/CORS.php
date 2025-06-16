<?php

namespace App\Middleware;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\HTTP\URI;
use CodeIgniter\Filters\FilterInterface;
use Psr\Log\LoggerInterface;

/**
 * CORS Middleware
 * Handles Cross-Origin Resource Sharing (CORS) requests
 */
class CORS implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $response = service('response');
        
        // Set CORS headers
        $response->setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->setHeader('Access-Control-Allow-Credentials', 'true');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->setHeader('Access-Control-Allow-Headers', '*');
        $response->setHeader('Access-Control-Max-Age', '86400');
        $response->setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Foo, X-Bar');
        
        // Handle OPTIONS (preflight) request
        if ($request->getMethod() === 'OPTIONS') {
            return $response
                ->setStatusCode(204)
                ->setHeader('Content-Length', '0')
                ->setHeader('Content-Type', 'text/plain')
                ->setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
                ->setHeader('Access-Control-Allow-Credentials', 'true')
                ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->setHeader('Access-Control-Allow-Headers', '*')
                ->setBody('');
        }
        
        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Add CORS headers to the response
        $response->setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->setHeader('Access-Control-Allow-Credentials', 'true');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->setHeader('Access-Control-Allow-Headers', '*');
        $response->setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Foo, X-Bar');
        
        return $response;
    }
}
