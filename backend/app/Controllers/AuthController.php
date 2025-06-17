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
    protected $session;

    protected function sendVerificationEmail($email, $token)
    {
        $verificationUrl = site_url('api/auth/verify-email/' . $token);
        
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

        $emailService = service('email');
        $emailService->setTo($email);
        $emailService->setSubject('Email Verification');
        $emailService->setMessage($message);

        if (!$emailService->send()) {
            log_message('error', 'Failed to send verification email to ' . $email . ': ' . $emailService->printDebugger(['headers']));
        }
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
        try {
            $data = $this->request->getJSON(true);

            if (empty($data['email']) || empty($data['password'])) {
                return $this->failValidation('Email and password are required');
            }

            $user = $this->userModel->where('email', $data['email'])->first();

            if ($user && password_verify($data['password'], $user['password_hash'])) {
                
                if (!$user['is_verified']) {
                    return $this->respond([
                        'error'   => 'not_verified',
                        'message' => 'Email is not verified.'
                    ], 403);
                }

                $role = $this->rolesModel->find($user['role_id']);

                if (!$role) {
                    return $this->fail('Invalid user role', 500);
                }

                $token = bin2hex(random_bytes(32));
                
                $response = [
                    'status' => 'success',
                    'token'  => $token,
                    'user'   => [
                        'id'         => $user['id'],
                        'email'      => $user['email'],
                        'first_name' => $user['first_name'],
                        'last_name'  => $user['last_name'],
                        'role'       => $role['name'],
                    ]
                ];

                return $this->respond($response);
            }

            return $this->failUnauthorized('Invalid credentials');

        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred.');
        }
    }

    public function signup()
    {
        $rules = [
            'email' => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[8]',
            'firstName' => 'required',
            'lastName' => 'required',
            'phone' => 'required|is_unique[users.phone]'
        ];

        if (!$this->validate($rules)) {
            $errors = $this->validator->getErrors();
            $errorMessage = implode(' ', array_values($errors));
            return $this->respond(['message' => $errorMessage], 400);
        }

        $data = $this->request->getJSON(true);

        $customerRole = $this->rolesModel->where('name', 'customer')->first();
        if (!$customerRole) {
            return $this->fail('Customer role not found', 500);
        }

        $userData = [
            'role_id' => $customerRole['id'],
            'email' => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'phone' => $data['phone'],
            'is_verified' => false,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        $userId = $this->userModel->insert($userData);
        if (!$userId) {
            return $this->fail('Failed to create user', 500);
        }

        $verificationToken = $this->verificationModel->generateToken($userId);
        $this->sendVerificationEmail($data['email'], $verificationToken);

        return $this->respondCreated([
            'status' => 'success',
            'message' => 'User registered successfully. Please check your email for verification.',
        ]);
    }

    public function resendVerification()
    {
        try {
            $data = $this->request->getJSON(true);
            $email = $data['email'] ?? null;

            if (!$email) {
                return $this->failValidation('Email is required.');
            }

            $user = $this->userModel->where('email', $email)->first();

            if (!$user) {
                // Don't reveal if an email exists or not for security
                return $this->respond(['status' => 'success', 'message' => 'If an account with that email exists, a new verification link has been sent.']);
            }

            if ($user['is_verified']) {
                return $this->fail('This email is already verified.', 400);
            }

            // Generate a new token and send the email
            $verificationToken = $this->verificationModel->generateToken($user['id']);
            $this->sendVerificationEmail($user['email'], $verificationToken);

            return $this->respond([
                'status'  => 'success',
                'message' => 'A new verification link has been sent to your email.'
            ]);

        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while resending the verification email.');
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
