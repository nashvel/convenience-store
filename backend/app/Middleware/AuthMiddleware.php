<?php

namespace App\Middleware;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class AuthMiddleware implements FilterInterface
{
    /**
     * @param RequestInterface $request
     * @param array|null       $arguments
     *
     * @return mixed
     */
        public function before(RequestInterface $request, $arguments = null)
    {
        $session = session();

        $isAuthenticated = false;

        // Check if user is logged in via session
        if ($session->has('logged_in') && $session->get('logged_in') === true) {
            $isAuthenticated = true;
        }

        // Check for token in Authorization header
        if (!$isAuthenticated) {
            $authHeader = $request->getHeaderLine('Authorization');
            if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                $token = $matches[1];
                
                // Validate token against session
                if ($session->has('token') && $session->get('token') === $token) {
                    $isAuthenticated = true;
                }
            }
        }

        if ($isAuthenticated) {
            // User is authenticated, continue to the controller.
            return;
        }

        // If not authenticated, return a 401 Unauthorized response
        return Services::response()
            ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
            ->setJSON(['error' => 'Unauthorized']);
    }

    /**
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     *
     * @return mixed
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed
    }
}
