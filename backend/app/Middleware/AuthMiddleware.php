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
        log_message('info', 'AuthMiddleware triggered for URI: ' . $request->getUri());
        log_message('info', 'Session data: ' . json_encode($session->get()));
        log_message('info', 'Cookie header: [' . $request->getHeaderLine('Cookie') . ']');

        // Check if user is logged in via session
        if ($session->has('logged_in') && $session->get('logged_in') === true) {
            return;
        }

        // Check for token in Authorization header
        $authHeader = $request->getHeaderLine('Authorization');
        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            
            // Validate token against session
            if ($session->has('token') && $session->get('token') === $token) {
                return;
            }
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
