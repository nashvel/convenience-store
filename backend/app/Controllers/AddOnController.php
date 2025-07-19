<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class AddOnController extends ResourceController
{
    use ResponseTrait;

    protected $modelName = 'App\Models\AddOnModel';
    protected $format = 'json';

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Get all add-ons for a specific store
     */
    public function getStoreAddOns($store_id = null)
    {
        try {
            if (!$store_id) {
                return $this->failValidationError('Store ID is required');
            }

            // Get addon categories with their addons and variants
            $categories = $this->db->table('addon_categories')
                ->where('store_id', $store_id)
                ->where('is_active', true)
                ->orderBy('display_order', 'ASC')
                ->get()
                ->getResultArray();

            foreach ($categories as &$category) {
                // Get addons for this category
                $addons = $this->db->table('addons')
                    ->where('addon_category_id', $category['id'])
                    ->where('is_active', true)
                    ->orderBy('display_order', 'ASC')
                    ->get()
                    ->getResultArray();

                foreach ($addons as &$addon) {
                    // Get variants for this addon
                    $variants = $this->db->table('addon_variants')
                        ->where('addon_id', $addon['id'])
                        ->where('is_active', true)
                        ->get()
                        ->getResultArray();
                    
                    $addon['variants'] = $variants;
                }

                $category['addons'] = $addons;
            }

            return $this->respond([
                'status' => 'success',
                'data' => $categories
            ]);

        } catch (\Exception $e) {
            return $this->failServerError('Failed to fetch add-ons: ' . $e->getMessage());
        }
    }

    /**
     * Get add-ons for the current seller's store
     */
    public function getMyStoreAddOns()
    {
        try {
            // Get current user's store
            $session = session();
            $user_id = $session->get('user_id');
            
            if (!$user_id) {
                return $this->failUnauthorized('User not authenticated');
            }

            $user = $this->db->table('users')->where('id', $user_id)->get()->getRow();
            if (!$user || !$user->store_id) {
                return $this->failNotFound('Store not found for current user');
            }

            return $this->getStoreAddOns($user->store_id);

        } catch (\Exception $e) {
            return $this->failServerError('Failed to fetch store add-ons: ' . $e->getMessage());
        }
    }

    /**
     * Create a new addon category
     */
    public function createCategory()
    {
        try {
            $session = session();
            $user_id = $session->get('user_id');
            
            if (!$user_id) {
                return $this->failUnauthorized('User not authenticated');
            }

            $user = $this->db->table('users')->where('id', $user_id)->get()->getRow();
            if (!$user || !$user->store_id) {
                return $this->failNotFound('Store not found for current user');
            }

            $data = $this->request->getJSON(true);
            
            $categoryData = [
                'store_id' => $user->store_id,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'display_order' => $data['display_order'] ?? 0,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $this->db->table('addon_categories')->insert($categoryData);
            $category_id = $this->db->insertID();

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Category created successfully',
                'data' => ['id' => $category_id]
            ]);

        } catch (\Exception $e) {
            return $this->failServerError('Failed to create category: ' . $e->getMessage());
        }
    }

    /**
     * Create a new addon
     */
    public function createAddOn()
    {
        try {
            $session = session();
            $user_id = $session->get('user_id');
            
            if (!$user_id) {
                return $this->failUnauthorized('User not authenticated');
            }

            $user = $this->db->table('users')->where('id', $user_id)->get()->getRow();
            if (!$user || !$user->store_id) {
                return $this->failNotFound('Store not found for current user');
            }

            $data = $this->request->getJSON(true);
            
            $addonData = [
                'store_id' => $user->store_id,
                'addon_category_id' => $data['addon_category_id'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'base_price' => $data['base_price'] ?? 0,
                'is_required' => $data['is_required'] ?? false,
                'max_selections' => $data['max_selections'] ?? 1,
                'display_order' => $data['display_order'] ?? 0,
                'is_active' => true,
                'is_approved' => false, // Require approval before going live
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $this->db->table('addons')->insert($addonData);
            $addon_id = $this->db->insertID();

            // Create variants if provided
            if (isset($data['variants']) && is_array($data['variants'])) {
                foreach ($data['variants'] as $variant) {
                    $variantData = [
                        'addon_id' => $addon_id,
                        'variant_name' => $variant['variant_name'],
                        'variant_value' => $variant['variant_value'],
                        'price_modifier' => $variant['price_modifier'] ?? 0,
                        'stock_quantity' => $variant['stock_quantity'] ?? 0,
                        'is_unlimited_stock' => $variant['is_unlimited_stock'] ?? true,
                        'is_active' => true,
                        'is_approved' => false, // Require approval before going live
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ];
                    
                    $this->db->table('addon_variants')->insert($variantData);
                }
            }

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Add-on created successfully',
                'data' => ['id' => $addon_id]
            ]);

        } catch (\Exception $e) {
            return $this->failServerError('Failed to create add-on: ' . $e->getMessage());
        }
    }

    /**
     * Test endpoint to view seeded data
     */
    public function testPizzaPalaceAddOns()
    {
        try {
            // Get Pizza Palace store
            $store = $this->db->table('stores')->where('name', 'Pizza Palace')->get()->getRow();
            if (!$store) {
                return $this->failNotFound('Pizza Palace store not found');
            }

            return $this->getStoreAddOns($store->id);

        } catch (\Exception $e) {
            return $this->failServerError('Failed to fetch Pizza Palace add-ons: ' . $e->getMessage());
        }
    }
}
