<?php

namespace App\Controllers;

use App\Models\ProductModel;
use App\Models\CategoryModel;
use App\Models\ProductVariantModel;
use App\Models\StoreModel;
use App\Models\NotificationModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class SellerProductController extends ResourceController
{
    use ResponseTrait;

    protected $productModel;
    protected $categoryModel;
    protected $productVariantModel;
    protected $storeModel;
    protected $notificationModel;

    public function __construct()
    {
        $this->productModel = new ProductModel();
        $this->categoryModel = new CategoryModel();
        $this->productVariantModel = new ProductVariantModel();
        $this->storeModel = new StoreModel();
        $this->notificationModel = new NotificationModel();
    }

    private function getSellerStoreId()
    {
        $userId = $this->request->user->id;
        if (!$userId) {
            return null;
        }
        $store = $this->storeModel->where('client_id', $userId)->first();
        return $store ? $store['id'] : null;
    }

    public function getProducts()
    {
        $storeId = $this->getSellerStoreId();
        if (!$storeId) {
            return $this->failNotFound('No store associated with this seller.');
        }

        // Show all products to sellers with their approval status
        $products = $this->productModel->where('store_id', $storeId)
                                      ->findAll();

        foreach ($products as &$product) {
            if ($product['product_type'] === 'variable') {
                $variants = $this->productVariantModel->where('product_id', $product['id'])->findAll();

                // Decode attributes for each variant
                foreach ($variants as &$variant) {
                    if (isset($variant['attributes'])) {
                        $variant['attributes'] = json_decode($variant['attributes'], true);
                    }
                }
                unset($variant);

                $product['variants'] = $variants; // Attach variants to product

                $totalStock = array_sum(array_column($variants, 'stock'));
                $product['stock'] = $totalStock;

                if (!empty($variants)) {
                    $minPrice = min(array_column($variants, 'price'));
                    $product['price'] = $minPrice;
                }

                $product['variant_count'] = count($variants);
            }
        }
        unset($product);

        return $this->respond($products);
    }

    public function createProduct()
    {
        $storeId = $this->getSellerStoreId();
        if (!$storeId) {
            return $this->failForbidden('You do not have a store to add products to.');
        }

        // Handle both form data (for file uploads) and JSON
        $contentType = $this->request->getHeaderLine('Content-Type');
        
        if (strpos($contentType, 'multipart/form-data') !== false) {
            // Handle FormData (with file uploads)
            $data = $this->request->getPost();
        } else {
            // Handle JSON data
            $data = $this->request->getJSON(true);
            if (empty($data)) {
                $data = $this->request->getPost();
            }
        }
        
        // Handle file upload
        $uploadedFile = $this->request->getFile('image');
        if ($uploadedFile && $uploadedFile->isValid() && !$uploadedFile->hasMoved()) {
            // Create uploads directory if it doesn't exist
            $uploadPath = FCPATH . 'uploads/products/';
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }
            
            // Generate unique filename
            $fileName = $uploadedFile->getRandomName();
            
            // Move the file
            if ($uploadedFile->move($uploadPath, $fileName)) {
                $data['image'] = $fileName;
                log_message('debug', 'Image uploaded successfully: ' . $fileName);
            } else {
                log_message('error', 'Failed to upload image');
                return $this->fail('Failed to upload image');
            }
        }
        
        // Log the incoming data for debugging
        log_message('debug', 'Incoming product data: ' . json_encode($data));
        
        $data['store_id'] = $storeId;
        
        // Ensure product requires approval before going live
        $data['is_approved'] = false;
        $data['is_active'] = true;
        
        // Clean up data - remove fields that shouldn't be inserted directly
        unset($data['variants']); // variants should be handled separately
        unset($data['addons']);   // addons should be handled separately
        
        // Ensure numeric fields are properly formatted
        if (isset($data['price']) && ($data['price'] === '' || $data['price'] === null)) {
            $data['price'] = null;
        }
        if (isset($data['stock']) && ($data['stock'] === '' || $data['stock'] === null)) {
            $data['stock'] = null;
        }
        
        // Convert category_id to proper integer
        if (isset($data['category_id'])) {
            $data['category_id'] = (int)$data['category_id'];
        }
        
        // Remove any empty or invalid fields (but keep image filename if present)
        $data = array_filter($data, function($value, $key) {
            if ($key === 'image' && is_string($value)) {
                return true; // Keep image filename
            }
            return $value !== '' && $value !== [] && $value !== null;
        }, ARRAY_FILTER_USE_BOTH);
        
        // Ensure required fields are present
        $requiredFields = ['name', 'description', 'category_id', 'product_type'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                return $this->fail("Missing required field: {$field}");
            }
        }
        
        // Log the cleaned data
        log_message('debug', 'Cleaned product data: ' . json_encode($data));

        try {
            log_message('debug', 'Attempting to insert product with data: ' . json_encode($data));
            
            if ($this->productModel->insert($data)) {
                $productId = $this->productModel->insertID();
                log_message('debug', 'Product inserted successfully with ID: ' . $productId);
                
                $product = $this->productModel->find($productId);
                log_message('debug', 'Retrieved product: ' . json_encode($product));
                
                // Create notification for admin about new product approval request
                log_message('debug', 'About to create approval notification');
                $this->createApprovalNotification($product, $storeId);
                log_message('debug', 'Notification creation completed');
                
                return $this->respondCreated($product);
            } else {
                log_message('error', 'Product model errors: ' . json_encode($this->productModel->errors()));
                return $this->fail($this->productModel->errors());
            }
        } catch (\Exception $e) {
            log_message('error', 'Product creation exception: ' . $e->getMessage());
            return $this->fail('Failed to create product: ' . $e->getMessage());
        }
    }
    
    private function createApprovalNotification($product, $storeId)
    {
        try {
            // Get store name
            $store = $this->storeModel->find($storeId);
            $storeName = $store ? $store['name'] : 'Unknown Store';
            
            log_message('debug', 'Creating notification for product: ' . $product['name'] . ' from store: ' . $storeName);
            
            // Create notification data - these are admin notifications, so we'll use admin user ID (1)
            // In a real system, you might want to notify all admin users or have a specific admin notification system
            $notificationData = [
                'user_id' => 1, // Admin user ID - adjust this based on your admin user setup
                'type' => 'product_approval_request',
                'title' => 'New Product Approval Request',
                'message' => $storeName . ' is requesting "' . $product['name'] . '" to be approved',
                'data' => json_encode([
                    'product_id' => $product['id'],
                    'product_name' => $product['name'],
                    'store_id' => $storeId,
                    'store_name' => $storeName
                ]),
                'is_read' => 0,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
            
            log_message('debug', 'Notification data: ' . json_encode($notificationData));
            
            // Insert notification using NotificationModel
            $result = $this->notificationModel->insert($notificationData);
            
            if ($result) {
                $notificationId = $this->notificationModel->insertID();
                log_message('debug', 'Approval notification created successfully with ID: ' . $notificationId . ' for product: ' . $product['name']);
            } else {
                log_message('error', 'Failed to insert notification. Model errors: ' . json_encode($this->notificationModel->errors()));
            }
        } catch (\Exception $e) {
            log_message('error', 'Failed to create approval notification: ' . $e->getMessage());
            log_message('error', 'Exception trace: ' . $e->getTraceAsString());
            // Don't fail the product creation if notification fails
        }
    }

    public function updateProduct($id)
    {
        $storeId = $this->getSellerStoreId();
        $product = $this->productModel->find($id);

        if (!$product || $product['store_id'] != $storeId) {
            return $this->failForbidden('You are not authorized to update this product.');
        }

        $data = $this->request->getJSON(true);

        if ($this->productModel->update($id, $data)) {
            return $this->respond($this->productModel->find($id));
        } else {
            return $this->fail($this->productModel->errors());
        }
    }

    public function deleteProduct($id = null)
    {
        $storeId = $this->getSellerStoreId();
        $product = $this->productModel->find($id);

        if (!$product || $product['store_id'] != $storeId) {
            return $this->failForbidden('You are not authorized to delete this product.');
        }

        if ($this->productModel->delete($id)) {
            return $this->respondDeleted(['id' => $id]);
        } else {
            return $this->failServerError('Failed to delete product.');
        }
    }
}
