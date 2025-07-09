<?php

namespace App\Middleware;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use App\Models\UserModel;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');
        $token = null;

        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }

        if ($token === null) {
            log_message('error', 'AuthMiddleware: No token provided.');
            return Services::response()
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['error' => 'Unauthorized: No token provided']);
        }

        try {
            $key = getenv('jwt.secret');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            $userModel = new UserModel();
            $user = $userModel->select('users.*, roles.name as role')
                              ->join('roles', 'roles.id = users.role_id')
                              ->where('users.id', $decoded->uid)
                              ->first();

            if ($user) {
                log_message('info', 'AuthMiddleware: User authenticated successfully. User ID: ' . $user['id']);
                                $request->user = (object)$user;
                return;
            }
            
            log_message('error', 'AuthMiddleware: User not found for UID: ' . $decoded->uid);
            return Services::response()
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['error' => 'Unauthorized: User not found']);

        } catch (Exception $e) {
            log_message('error', 'AuthMiddleware: JWT decoding failed. Reason: ' . $e->getMessage());
            return Services::response()
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['error' => 'Unauthorized: ' . $e->getMessage()]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed
    }
}
