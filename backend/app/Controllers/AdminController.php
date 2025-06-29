<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\StoreModel;
use App\Models\SettingsModel;
use App\Models\ProductModel;
use App\Models\CategoryModel;
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

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->storeModel = new StoreModel();
        $this->settingsModel = new SettingsModel();
        $this->productModel = new ProductModel();
        $this->categoryModel = new CategoryModel();
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

            foreach ($data as $key => $value) {
                // Basic validation to ensure we are updating existing keys
                if (is_string($key) && (is_string($value) || is_numeric($value) || is_bool($value))) {
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
}
