<?php

namespace Config;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\HTTP\RedirectResponse;
use CodeIgniter\HTTP\Response;

use App\Models\UserModel;

class AdminMiddleware
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $userModel = new UserModel();
        
        // Get current user
        $user = session('user');
        
        if (!$user) {
            return redirect()->to('/login');
        }

        // Check if user is admin
        if ($user['role_id'] !== 4) { // 4 is admin role_id
            return new Response('', 403, ['Content-Type' => 'application/json'])
                ->setJSON(['error' => 'Admin access required']);
        }

        return $request;
    }

    public function after(ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}
