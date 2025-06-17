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
        // Handle OPTIONS (preflight) request
        if ($request->getMethod(true) === 'OPTIONS') {
            $response = service('response');
            $response->setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            $response->setHeader('Access-Control-Allow-Credentials', 'true');
            $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
            $response->setHeader('Access-Control-Max-Age', '86400');
            $response->setStatusCode(204);
            $response->setBody('');
            
            return $response;
        }

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $response->setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->setHeader('Access-Control-Allow-Credentials', 'true');
        
        return $response;
    }
}
