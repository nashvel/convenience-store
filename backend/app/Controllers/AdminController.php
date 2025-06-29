<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\StoreModel;
use App\Models\SettingsModel;
use App\Models\ProductModel;
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
    protected $productModel;
    protected $categoryModel;
    protected $orderModel;
    protected $addressModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->storeModel = new StoreModel();
        $this->settingsModel = new SettingsModel();
        $this->productModel = new ProductModel();
        $this->categoryModel = new CategoryModel();
        $this->orderModel = new OrderModel();
        $this->addressModel = new AddressModel();
    }

    public function getClients()
    {
        // For now, we will assume an admin check has been performed by a filter.
        // A real implementation should have a robust JWT or session-based auth check.

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

            // Add validation logic here if needed

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

            // Add validation logic here if needed

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

            // The frontend sends data nested under a 'settings' key.
            $settings = $data['settings'] ?? null;

            if (!$settings || !is_array($settings)) {
                return $this->fail('Invalid data format. Expected a "settings" object.', 400);
            }

            foreach ($settings as $key => $value) {
                // Allow strings, numbers, booleans, and null values.
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

    public function getProducts()
    {
        $productModel = new \App\Models\ProductModel();

        $page = $this->request->getVar('page') ?? 1;
        $perPage = $this->request->getVar('perPage') ?? 20;

        $products = $productModel->select('products.*, stores.name as store_name, categories.name as category_name')
                                 ->join('stores', 'stores.id = products.store_id', 'left')
                                 ->join('categories', 'categories.id = products.category_id', 'left')
                                 ->paginate($perPage, 'default', $page);

        $pager = $productModel->pager;

        $response = [
            'products' => $products,
            'pager' => [
                'currentPage' => $pager->getCurrentPage(),
                'perPage'     => $pager->getPerPage(),
                'total'       => $pager->getTotal(),
                'pageCount'   => $pager->getPageCount(),
            ]
        ];

        return $this->respond($response);
    }

    public function deleteProduct($id = null)
    {
        if ($id === null) {
            return $this->fail('Product ID is required.');
        }

        $product = $this->productModel->find($id);

        if (!$product) {
            return $this->failNotFound('Product not found with ID: ' . $id);
        }

        try {
            if ($this->productModel->delete($id)) {
                return $this->respondDeleted(['id' => $id], 'Product successfully deleted.');
            } else {
                return $this->failServerError('Failed to delete product.');
            }
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while deleting the product.');
        }
    }

    public function updateProduct($id = null)
    {
        if ($id === null) {
            return $this->fail('Product ID is required.');
        }

        $product = $this->productModel->find($id);

        if (!$product) {
            return $this->failNotFound('Product not found with ID: ' . $id);
        }

        $data = $this->request->getJSON(true);

        $updateData = [];

        if (array_key_exists('name', $data)) {
            $updateData['name'] = $data['name'];
        }
        if (array_key_exists('price', $data)) {
            $updateData['price'] = $data['price'];
        }
        if (array_key_exists('category_id', $data)) {
            if (empty($data['category_id'])) {
                return $this->failValidationErrors(['category_id' => 'A category must be selected.']);
            }
            
            $category = $this->categoryModel->find($data['category_id']);
            if (!$category) {
                return $this->failValidationErrors(['category_id' => 'The selected category is invalid.']);
            }
            $updateData['category_id'] = $data['category_id'];
        }

        if (empty($updateData)) {
            return $this->fail('No data provided for update.', 400);
        }

        try {
            if ($this->productModel->update($id, $updateData)) {
                $updatedProduct = $this->productModel
                    ->select('products.*, categories.name as category_name')
                    ->join('categories', 'categories.id = products.category_id', 'left')
                    ->find($id);
                return $this->respond($updatedProduct);
            } else {
                return $this->failServerError('Failed to update product.');
            }
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while updating the product.');
        }
    }

    public function getCategories()
    {
        try {
            $categories = $this->categoryModel->findAll();
            return $this->respond($categories);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while fetching categories.');
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
