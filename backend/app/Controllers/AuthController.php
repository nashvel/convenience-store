<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\API\HTTPException;
use App\Models\UserModel;
use App\Models\RolesModel;
use App\Models\VerificationModel;
use CodeIgniter\HTTP\RedirectResponse;

class AuthController extends ResourceController
{
    use ResponseTrait;

    protected $userModel;
    protected $rolesModel;
    protected $verificationModel;
    protected $request;
    protected $response;

    protected function sendVerificationEmail($email, $token)
    {
        $verificationUrl = base_url() . '/verify-email/' . $token;
        
        $message = "<html>
        <head>
            <style>
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: bold;
                }
                .button:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <h2>Email Verification</h2>
            <p>Thank you for signing up! Please verify your email by clicking the button below:</p>
            <p><a href='" . $verificationUrl . "' class='button'>Verify Email</a></p>
            <p>If you didn't sign up for an account, please ignore this email.</p>
            <p>This link will expire in 24 hours.</p>
        </body>
        </html>";

        log_message('info', "Verification URL for $email: $verificationUrl");


        log_message('info', "Email content for $email: " . $message);
    }

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->rolesModel = new RolesModel();
        $this->verificationModel = new VerificationModel();
        $this->request = service('request');
        $this->response = service('response');
        helper('session');
        $this->session = session();
    }

    protected function sanitizeInput($data)
    {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                $data[$key] = trim($value);
                $data[$key] = stripslashes($value);
                $data[$key] = $this->db->escape($value);
            }
        }
        return $data;
    }

    protected function validateRequest()
    {
        if ($this->request->getHeader('Content-Type') === null) {
            throw HTTPException::forInvalidRequest('Content-Type header is required');
        }

        if (strpos($this->request->getHeader('Content-Type'), 'application/json') === false) {
            throw HTTPException::forInvalidRequest('Content-Type must be application/json');
        }

        $ip = $this->request->getIPAddress();
        $cache = \Config\Cache::instance();
        $attempts = $cache->get('login_attempts_' . $ip);
        
        if ($attempts >= 5) {
            throw HTTPException::forTooManyRequests('Too many failed attempts. Please try again later.');
        }
    }

    protected function logAttempt($success = false)
    {
        $ip = $this->request->getIPAddress();
        $cache = \Config\Cache::instance();
        
        if (!$success) {
            $attempts = $cache->increment('login_attempts_' . $ip);
            $cache->protect('login_attempts_' . $ip, 3600);
        } else {
            $cache->delete('login_attempts_' . $ip);
        }
    }

    protected function handleCors()
    {
        $origin = $this->request->getHeader('Origin');
        $origin = $origin ? $origin->getValue() : '';

        if (in_array($origin, ['http://localhost:3000'])) {
            $this->response->setHeader('Access-Control-Allow-Origin', $origin);
            $this->response->setHeader('Access-Control-Allow-Credentials', 'true');
        }

        $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');
        $this->response->setHeader('Access-Control-Max-Age', '86400');
        $this->response->setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Foo, X-Bar');

        if ($this->request->getMethod() === 'OPTIONS') {
            return $this->response->setStatusCode(204)->setBody('');
        }

        return null;
    }

    public function verifyEmail($token = null)
    {
        if (!$token) {
            return $this->fail('No verification token provided');
        }

        try {
            $userId = $this->verificationModel->verifyToken($token);
            
            if (!$userId) {
                return $this->fail('Invalid or expired verification token');
            }

            // Update user's verification status
            $this->userModel->update($userId, [
                'is_verified' => true
            ]);

            return $this->respond([
                'status' => 'success',
                'message' => 'Email verified successfully'
            ]);

        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function login()
    {
        // Set CORS headers
        $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        $this->response->setHeader('Access-Control-Allow-Credentials', 'true');
        $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');
        $this->response->setHeader('Access-Control-Max-Age', '86400');

        // Handle OPTIONS (preflight)
        if ($this->request->getMethod() === 'OPTIONS') {
            return $this->response->setStatusCode(204)->setBody('');
        }

        try {
            $this->validateRequest();
            $data = $this->sanitizeInput($this->request->getJSON(true));

            if (empty($data['email']) || empty($data['password'])) {
                return $this->failValidation('Email and password are required');
            }

            $this->logAttempt(false);
            $builder = $this->db->table('users');
            $builder->where('email', $data['email']);
            $user = $builder->get()->getRow();

            if ($user && password_verify($data['password'], $user->password_hash)) {
                $this->logAttempt(true);
                $role = $this->db->table('roles')
                    ->where('id', $user->role_id)
                    ->get()
                    ->getRow();

                if (!$role) {
                    throw HTTPException::forInvalidRequest('Invalid user role');
                }

                $token = bin2hex(random_bytes(32));
                $session = session();
                $session->set([
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'role_name' => $role->name,
                    'logged_in' => true,
                    'token' => $token
                ]);

                $response = [
                    'token' => $token,
                    'user' => [
                        'id' => (int)$user->id,
                        'email' => htmlspecialchars($user->email, ENT_QUOTES, 'UTF-8'),
                        'role' => htmlspecialchars($role->name, ENT_QUOTES, 'UTF-8'),
                        'role_id' => (int)$user->role_id,
                    ]
                ];

                $this->response->setHeader('X-Content-Type-Options', 'nosniff');
                $this->response->setHeader('X-Frame-Options', 'DENY');
                $this->response->setHeader('X-XSS-Protection', '1; mode=block');

                return $this->respond($response);
            }

            $this->logAttempt(false);
            return $this->fail('Invalid credentials');
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function signup()
    {
        try {
            // Handle OPTIONS (preflight)
            if ($this->request->getMethod() === 'OPTIONS') {
                return $this->response
                    ->setHeader('Access-Control-Allow-Origin', '*')
                    ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    ->setHeader('Access-Control-Allow-Headers', '*')
                    ->setStatusCode(204)
                    ->setBody('');
            }

            // Get request data
            $data = json_decode($this->request->getBody(), true);
            
            if (empty($data)) {
                return $this->fail('Invalid request data');
            }

            // Validate required fields
            $required = ['email', 'password', 'firstName', 'lastName', 'phone'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    return $this->fail("Missing required field: $field");
                }
            }

            // Use the model initialized in constructor
            $userModel = $this->userModel;

            // Check if email already exists
            if ($userModel->where('email', $data['email'])->countAllResults() > 0) {
                return $this->fail('Email already exists');
            }

            // Prepare user data
            $userData = [
                'role_id' => 1, // Customer role
                'email' => $data['email'],
                'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
                'first_name' => $data['firstName'],
                'last_name' => $data['lastName'],
                'phone' => $data['phone'],
                'is_verified' => false,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];

            // Insert user
            // Insert user
            if (!$userModel->insert($userData)) {
                return $this->fail('Failed to create user: ' . json_encode($userModel->errors()));
            }

            // Generate verification token
            $verificationToken = $this->verificationModel->generateToken($userModel->getInsertID());

            // Generate session token
            $token = bin2hex(random_bytes(32));

            // Store token in session
            $this->session->set([
                'user_id' => $userModel->getInsertID(),
                'token' => $token,
                'email' => $data['email'],
                'first_name' => $data['firstName'],
                'last_name' => $data['lastName']
            ]);

            // Log session data for debugging
            log_message('info', "Session data set: " . json_encode($this->session->get()));

            // Send verification email first
            $this->sendVerificationEmail($data['email'], $verificationToken);

            // Return success response
            return $this->respond([
                'status' => 'success',
                'message' => 'User registered successfully. Please check your email for verification.',
                'user' => [
                    'id' => $userModel->getInsertID(),
                    'email' => $data['email'],
                    'first_name' => $data['firstName'],
                    'last_name' => $data['lastName']
                ],
                'token' => $token,
                'verification_token' => $verificationToken
            ]);

            // Log the verification token (for debugging)
            log_message('info', "Verification token for user {$data['email']}: $verificationToken");

        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }

        try {
            $this->validateRequest();
            $data = $this->sanitizeInput($this->request->getJSON(true));

            if (empty($data['email']) || empty($data['password']) || empty($data['firstName']) || empty($data['lastName']) || empty($data['phone'])) {
                return $this->failValidation('All fields are required');
            }

            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->failValidation('Invalid email format');
            }

            if (!preg_match('/^[0-9]{10,15}$/', $data['phone'])) {
                return $this->failValidation('Invalid phone number format');
            }

            if (strlen($data['password']) < 8) {
                return $this->failValidation('Password must be at least 8 characters long');
            }

            $user = $this->usersModel->where('email', $data['email'])->first();
            if ($user) {
                return $this->fail('Email already registered');
            }

            $user = $this->usersModel->where('phone', $data['phone'])->first();
            if ($user) {
                return $this->fail('Phone number already registered');
            }

            $customerRole = $this->rolesModel->where('name', 'customer')->first();
            if (!$customerRole) {
                throw HTTPException::forInvalidRequest('Customer role not found');
            }

            try {
                $user = new User();
                $user->email = $data['email'];
                $user->password = password_hash($data['password'], PASSWORD_DEFAULT);
                $user->first_name = $data['firstName'];
                $user->last_name = $data['lastName'];
                $user->phone = $data['phone'];
                $user->created_at = date('Y-m-d H:i:s');
                $user->updated_at = date('Y-m-d H:i:s');
                $token = bin2hex(random_bytes(32));

                $response = [
                    'token' => $token,
                    'user' => [
                        'id' => $userId,
                        'email' => htmlspecialchars($userData['email'], ENT_QUOTES, 'UTF-8'),
                        'role' => 'customer',
                        'role_id' => (int)$customerRole->id,
                    ]
                ];

                $this->response->setHeader('X-Content-Type-Options', 'nosniff');
                $this->response->setHeader('X-Frame-Options', 'DENY');
                $this->response->setHeader('X-XSS-Protection', '1; mode=block');

                $this->db->transComplete();

                return $this->respond($response);
            } catch (\Exception $e) {
                $this->db->transRollback();
                throw $e;
            }
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function forgotPassword()
    {
        if ($this->request->getMethod() === 'post') {
            $email = $this->request->getPost('email');
            $user = $this->usersModel->where('email', $email)->first();

            if ($user) {
                $resetToken = bin2hex(random_bytes(32));
                $resetExpires = date('Y-m-d H:i:s', strtotime('+1 hour'));

                $this->usersModel->update($user->id, [
                    'password_reset_token' => $resetToken,
                    'password_reset_expires' => $resetExpires,
                ]);

                $this->sendPasswordResetEmail($user, $resetToken);

                return redirect()->to('/auth/login')->with('success', 'Password reset instructions sent to your email');
            }

            return redirect()->back()->with('error', 'Email not found');
        }

        return view('auth/forgot_password');
    }

    public function resetPassword($token = null)
    {
        if (!$token) {
            return redirect()->to('/auth/login')->with('error', 'Invalid reset token');
        }

        if ($this->request->getMethod() === 'post') {
            $rules = [
                'password' => 'required|min_length[8]',
                'confirm_password' => 'required|matches[password]',
            ];

            if (!$this->validate($rules)) {
                return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
            }

            $user = $this->usersModel->where('password_reset_token', $token)
                ->where('password_reset_expires >', date('Y-m-d H:i:s'))
                ->first();

            if ($user) {
                $hashedPassword = password_hash($this->request->getPost('password'), PASSWORD_DEFAULT);
                $this->usersModel->update($user->id, [
                    'password_hash' => $hashedPassword,
                    'password_reset_token' => null,
                    'password_reset_expires' => null,
                ]);

                return redirect()->to('/auth/login')->with('success', 'Password reset successfully! Please login.');
            }

            return redirect()->to('/auth/login')->with('error', 'Invalid or expired reset token');
        }

        return view('auth/reset_password', ['token' => $token]);
    }

    public function logout()
    {
        session()->destroy();
        return redirect()->to('/auth/login')->with('success', 'Successfully logged out');
    }

    private function setRememberMeToken($user)
    {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));

        $this->db->table('remember_me_tokens')->insert([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);

        set_cookie('remember_token', $token, 30 * 24 * 60 * 60);
    }

    private function sendPasswordResetEmail($user, $token)
    {
        $resetUrl = base_url('/auth/reset-password/' . $token);
        $message = "Dear {$user->first_name},\n\n";
        $message .= "You requested a password reset for your account.\n\n";
        $message .= "Please click the following link to reset your password:\n";
        $message .= $resetUrl . "\n\n";
        $message .= "If you did not request this password reset, please ignore this email.\n";
    }
}
