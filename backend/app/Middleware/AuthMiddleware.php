<?php

namespace App\Middleware;

use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\HTTP\Response;
use Psr\Log\LoggerInterface;

class AuthMiddleware
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $session = session();
        
        // Check if user is logged in via session
        if ($session->has('logged_in') && $session->get('logged_in') === true) {
            return null;
        }

        // Check for token in Authorization header
        $authHeader = $request->getHeader('Authorization');
        if ($authHeader) {
            $token = str_replace('Bearer ', '', $authHeader->getValue());
            
            // Validate token against session
            if ($session->has('token') && $session->get('token') === $token) {
                return null;
            }
        }

        // If neither session nor valid token, redirect to login
        return redirect()->to('/signin');
    }

    public function after(ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}
