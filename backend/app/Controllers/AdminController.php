<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\StoreModel;
use App\Models\SettingsModel;
use App\Models\CategoryModel;
use App\Models\OrderModel;
use App\Models\AddressModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class AdminController extends ResourceController
{
    use ResponseTrait;

    protected $userModel;
    protected $storeModel;
    protected $settingsModel;
    protected $categoryModel;
    protected $orderModel;
    protected $addressModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->storeModel = new StoreModel();
        $this->settingsModel = new SettingsModel();
        $this->categoryModel = new CategoryModel();
        $this->orderModel = new OrderModel();
        $this->addressModel = new AddressModel();
    }

    public function getClients()
    {
        try {
            $clients = $this->userModel
                ->select('users.id, users.first_name, users.last_name, users.email, users.created_at, users.is_verified, stores.name as store_name, stores.logo as store_logo')
                ->join('stores', 'stores.client_id = users.id', 'left')
                ->where('users.role_id', 2)
                ->findAll();

            return $this->respond($clients);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while fetching client data.');
        }
    }

    public function createClient()
    {
        try {
            $data = $this->request->getJSON(true);

            // First, check if the email already exists
            $existingUser = $this->userModel->where('email', $data['email'])->first();
            if ($existingUser) {
                return $this->fail('This email address is already registered.', 409);
            }

            // Validation rules
            $rules = [
                'first_name' => 'required',
                'last_name'  => 'required',
                'email'      => 'required|valid_email',
                'password'   => 'required|min_length[8]',
                'store_type' => 'required|in_list[convenience,restaurant]'
            ];

            if (!$this->validate($rules)) {
                return $this->failValidationErrors($this->validator->getErrors());
            }

            $clientData = [
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
                'role_id' => 2, // Client role
                'is_verified' => 1 // Automatically verify admin-created clients
            ];

            $newUserId = $this->userModel->insert($clientData);

            if ($newUserId) {
                // Create a corresponding store for the new client
                $storeData = [
                    'client_id'  => $newUserId,
                    'name'       => $data['first_name'] . " " . $data['last_name'] . "'s Store",
                    'address'    => 'Default Address, please update',
                    'store_type' => $data['store_type']
                ];
                $this->storeModel->insert($storeData);

                // Check if email notification should be sent
                if (!empty($data['notifyByEmail']) && $data['notifyByEmail'] === true) {
                    $settings = $this->settingsModel->first();
                    $appName = $settings['app_name'] ?? 'Quick Mart';

                    $email = \Config\Services::email();
                    $email->setTo($data['email']);
                    $email->setSubject('Your New Client Account on ' . $appName);
                    
                    $message = "<h1>Welcome to {$appName}!</h1>"
                             . "<p>A new client account has been created for you.</p>"
                             . "<p>You can now log in using the following credentials:</p>"
                             . "<ul>"
                             . "<li><strong>Email:</strong> " . $data['email'] . "</li>"
                             . "<li><strong>Password:</strong> " . $data['password'] . "</li>"
                             . "</ul>"
                             . "<p>We recommend changing your password after your first login.</p>";
                    
                    $email->setMessage($message);

                    if (!$email->send(false)) { // pass false to avoid clearing config
                        // Log email error but don't fail the whole request
                        log_message('error', 'Email could not be sent to ' . $data['email'] . ': ' . $email->printDebugger(['headers']));
                    }
                }
                return $this->respondCreated(['message' => 'Client created successfully']);
            } else {
                return $this->fail($this->userModel->errors());
            }

        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while creating the client.');
        }
    }

    public function getClient($id)
    {
        try {
            $client = $this->userModel
                ->select('users.id, users.first_name, users.last_name, users.email, users.phone, stores.name as store_name, stores.address as store_address, stores.logo as store_logo')
                ->join('stores', 'stores.client_id = users.id', 'left')
                ->where('users.id', $id)
                ->where('users.role_id', 2)
                ->first();

            if (!$client) {
                return $this->failNotFound('Client not found.');
            }

            return $this->respond($client);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while fetching client data.');
        }
    }

    public function updateClient($id)
    {
        try {
            $data = $this->request->getJSON(true);

            // Validation
            $validation =  \Config\Services::validation();
            $validation->setRules([
                'first_name' => 'required|string|max_length[50]',
                'last_name'  => 'required|string|max_length[50]',
                'email'      => "required|valid_email|is_unique[users.email,id,{$id}]",
                'phone'      => 'permit_empty|string|max_length[20]'
            ]);

            if (!$validation->run($data)) {
                return $this->fail($validation->getErrors());
            }

            $userData = [
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'email'      => $data['email'],
                'phone'      => $data['phone']
            ];

            if ($this->userModel->update($id, $userData)) {
                return $this->respondUpdated(['message' => 'Client updated successfully.']);
            } else {
                return $this->fail($this->userModel->errors());
            }

        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while updating the client.');
        }
    }

    public function deleteClient($id)
    {
        try {
            $user = $this->userModel->find($id);

            if (!$user) {
                return $this->failNotFound('Client not found.');
            }

            // Ensure the user is a client
            if ($user['role_id'] != 2) {
                return $this->failForbidden('This user is not a client.');
            }

            // First, delete the associated store
            $storeModel = new \App\Models\StoreModel();
            $storeModel->where('client_id', $id)->delete();

            // Then, delete the user
            if ($this->userModel->delete($id)) {
                return $this->respondDeleted(['message' => 'Client and associated store deleted successfully.']);
            } else {
                return $this->fail($this->userModel->errors());
            }
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while deleting the client.');
        }
    }

    public function getCustomers()
    {
        try {
            $customers = $this->userModel
                ->select('id, first_name, last_name, email, phone, avatar, created_at, is_verified')
                ->where('role_id', 1)
                ->findAll();

            return $this->respond($customers);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred.');
        }
    }

    public function getRiders()
    {
        try {
            $riders = $this->userModel
                ->select('id, first_name, last_name, email, phone, avatar, created_at, is_verified, is_blacklisted')
                ->where('role_id', 3)
                ->findAll();

            // Cast is_blacklisted to boolean for correct frontend interpretation
            $riders = array_map(function($rider) {
                $rider['is_blacklisted'] = (bool)$rider['is_blacklisted'];
                return $rider;
            }, $riders);

            return $this->respond($riders);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred.');
        }
    }

    public function updateRider($id)
    {
        try {
            $data = $this->request->getJSON(true);
            $this->userModel->update($id, $data);
            return $this->respondUpdated(['message' => 'Rider updated successfully']);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred.');
        }
    }

    public function updateCustomer($id)
    {
        try {
            $data = $this->request->getJSON(true);
            $this->userModel->update($id, $data);
            return $this->respondUpdated(['message' => 'Customer updated successfully']);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred.');
        }
    }

    public function toggleBlacklist($id)
    {
        try {
            $user = $this->userModel->find($id);
            if (!$user) {
                return $this->failNotFound('User not found');
            }
            $this->userModel->update($id, ['is_blacklisted' => !$user['is_blacklisted']]);
            return $this->respondUpdated(['message' => 'User blacklist status updated successfully']);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred.');
        }
    }

    public function getSettings()
    {
        try {
            $settings = $this->settingsModel->findAll();
            $formattedSettings = [];
            foreach ($settings as $setting) {
                $formattedSettings[$setting['key']] = $setting['value'];
            }
            return $this->respond($formattedSettings);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while fetching settings.');
        }
    }

    public function updateSettings()
    {
        try {
            $data = $this->request->getJSON(true);
            $settings = $data['settings'] ?? null;
            if (!$settings || !is_array($settings)) {
                return $this->fail('Invalid data format. Expected a "settings" object.', 400);
            }
            foreach ($settings as $key => $value) {
                if (is_string($key) && (is_string($value) || is_numeric($value) || is_bool($value) || is_null($value))) {
                    $this->settingsModel->where('key', $key)->set('value', $value)->update();
                }
            }
            return $this->respondUpdated(['message' => 'Settings updated successfully']);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while updating settings.');
        }
    }

    public function getMonthlySales()
    {
        $storeId = $this->request->getGet('store_id');
        $orderModel = new OrderModel();

        $builder = $orderModel->select('SUM(total_price) as total_sales, MONTH(created_at) as month')
                               ->where('status', 'completed')
                               ->groupBy('MONTH(created_at)');

        if ($storeId) {
            $builder->where('store_id', $storeId);
        }

        $salesData = $builder->findAll();

        $monthlySales = array_fill(1, 12, 0);
        foreach ($salesData as $row) {
            $monthlySales[(int)$row['month']] = (float)$row['total_sales'];
        }

        return $this->respond(array_values($monthlySales));
    }

    public function getProfile()
    {
        try {
            $session = session();
            $userId = $session->get('id');

            if (!$userId) {
                return $this->failUnauthorized('User not logged in.');
            }

            $user = $this->userModel
                ->select('users.*, user_addresses.line1, user_addresses.city, user_addresses.zip_code')
                ->join('user_addresses', 'user_addresses.user_id = users.id', 'left')
                ->where('users.id', $userId)
                ->first();

            if (!$user) {
                return $this->failNotFound('User not found.');
            }

            // Restructure the data to have a nested address object
            $address = [
                'line1' => $user['line1'],
                'city' => $user['city'],
                'zip_code' => $user['zip_code'],
            ];

            // Remove the flat address fields from the main user array
            unset($user['line1'], $user['city'], $user['zip_code']);

            // Add the nested address object. If no address exists, the values will be null.
            $user['address'] = !empty(array_filter($address)) ? $address : null;

            return $this->respond($user);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred.');
        }
    }

    public function updateProfile()
    {
        try {
            $session = session();
            $userId = $session->get('id');

            if (!$userId) {
                return $this->failUnauthorized('User not logged in.');
            }

            $data = $this->request->getJSON(true);

            $userData = [
                'first_name' => $data['first_name'] ?? null,
                'last_name'  => $data['last_name'] ?? null,
                'email'      => $data['email'] ?? null,
                'phone'      => $data['phone'] ?? null,
                'bio'        => $data['bio'] ?? null,
            ];

            $addressData = [
                'line1'    => $data['line1'] ?? null,
                'city'     => $data['city'] ?? null,
                'zip_code' => $data['zipCode'] ?? null,
            ];

            $this->userModel->update($userId, array_filter($userData, fn($v) => $v !== null));

            $existingAddress = $this->addressModel->where('user_id', $userId)->first();
            if ($existingAddress) {
                $this->addressModel->update($existingAddress['id'], array_filter($addressData, fn($v) => $v !== null));
            } else {
                $this->addressModel->insert(array_merge(['user_id' => $userId], $addressData));
            }

            $updatedUser = $this->userModel
                ->select('users.*, user_addresses.line1, user_addresses.city, user_addresses.zip_code')
                ->join('user_addresses', 'user_addresses.user_id = users.id', 'left')
                ->where('users.id', $userId)
                ->first();

            if ($updatedUser) {
                $address = [
                    'line1' => $updatedUser['line1'],
                    'city' => $updatedUser['city'],
                    'zip_code' => $updatedUser['zip_code'],
                ];
                unset($updatedUser['line1'], $updatedUser['city'], $updatedUser['zip_code']);
                $updatedUser['address'] = !empty(array_filter($address)) ? $address : null;
            }

            return $this->respondUpdated($updatedUser, 'Profile updated successfully.');
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while updating the profile.');
        }
    }

    public function getStatistics()
    {
        $storeId = $this->request->getGet('store_id');
        $orderModel = new OrderModel();

        $builder = $orderModel->select('SUM(total_price) as total_sales, SUM(total_price - delivery_fee) as total_revenue, MONTH(created_at) as month')
                               ->where('status', 'completed')
                               ->groupBy('MONTH(created_at)');

        if ($storeId) {
            $builder->where('store_id', $storeId);
        }

        $statsData = $builder->findAll();

        $monthlySales = array_fill(1, 12, 0);
        $monthlyRevenue = array_fill(1, 12, 0);

        foreach ($statsData as $row) {
            $month = (int)$row['month'];
            $monthlySales[$month] = (float)$row['total_sales'];
            $monthlyRevenue[$month] = (float)$row['total_revenue'];
        }

        return $this->respond([
            'sales' => array_values($monthlySales),
            'revenue' => array_values($monthlyRevenue)
        ]);
    }
}
