<?php

namespace App\Controllers;

use App\Models\ProductModel;
use App\Models\CategoryModel;
use App\Models\ProductVariantModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class AdminProductController extends ResourceController
{
    use ResponseTrait;

    protected $productModel;
    protected $categoryModel;
    protected $productVariantModel;

    public function __construct()
    {
        $this->productModel = new ProductModel();
        $this->categoryModel = new CategoryModel();
        $this->productVariantModel = new ProductVariantModel();
    }

    private function getAllSubCategoryIds($parentId)
    {
        $allIds = [];
        $queue = [$parentId];

        while (!empty($queue)) {
            $currentId = array_shift($queue);
            if (!in_array($currentId, $allIds)) {
                $allIds[] = $currentId;
            }

            $children = $this->categoryModel->where('parent_id', $currentId)->findAll();
            foreach ($children as $child) {
                if (!in_array($child['id'], $allIds)) {
                    $queue[] = $child['id'];
                }
            }
        }
        return $allIds;
    }

    public function getProducts()
    {
        $page = $this->request->getVar('page') ?? 1;
        $perPage = $this->request->getVar('perPage') ?? 20;
        $search = $this->request->getVar('search');
        $categoryId = $this->request->getVar('category_id');

        $builder = $this->productModel->select('products.*, stores.name as store_name, categories.name as category_name')
            ->join('stores', 'stores.id = products.store_id', 'left')
            ->join('categories', 'categories.id = products.category_id', 'left');

        if ($search) {
            $builder->like('products.name', $search);
        }

        if ($categoryId) {
            $categoryIds = $this->getAllSubCategoryIds($categoryId);
            if (!empty($categoryIds)) {
                $builder->whereIn('products.category_id', $categoryIds);
            }
        }

        $products = $builder->paginate($perPage, 'default', $page);

        foreach ($products as &$product) {
            if ($product['product_type'] === 'variable') {
                $totalStock = $this->productVariantModel
                    ->where('product_id', $product['id'])
                    ->selectSum('stock', 'total_stock')
                    ->get()
                    ->getRow()
                    ->total_stock;

                $product['stock'] = $totalStock ?? 0;

                $minPrice = $this->productVariantModel
                    ->where('product_id', $product['id'])
                    ->selectMin('price', 'min_price')
                    ->get()
                    ->getRow()
                    ->min_price;

                $product['price'] = $minPrice ?? $product['price'];

                $variantCount = $this->productVariantModel
                    ->where('product_id', $product['id'])
                    ->countAllResults();

                $product['variant_count'] = $variantCount;
            }
        }
        unset($product);

        $pager = $this->productModel->pager;

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

    public function updateProduct($id)
    {
        $product = $this->productModel->find($id);
        if (!$product) {
            return $this->failNotFound('Product not found');
        }

        $data = [
            'name'        => $this->request->getPost('name'),
            'description' => $this->request->getPost('description'),
            'price'       => $this->request->getPost('price'),
            'stock'       => $this->request->getPost('stock'),
            'category_id' => $this->request->getPost('category_id'),
        ];

        $imageFile = $this->request->getFile('image');
        if ($imageFile && $imageFile->isValid() && !$imageFile->hasMoved()) {
            if ($product['image'] && file_exists(WRITEPATH . 'uploads/products/' . $product['image'])) {
                unlink(WRITEPATH . 'uploads/products/' . $product['image']);
            }
            $newName = $imageFile->getRandomName();
            $imageFile->move(WRITEPATH . 'uploads/products', $newName);
            $data['image'] = $newName;
        }

        $this->productModel->update($id, $data);

        $variantsToDeleteRaw = $this->request->getPost('variants_to_delete');
        if ($variantsToDeleteRaw) {
            $variantsToDelete = json_decode($variantsToDeleteRaw);
            if (!empty($variantsToDelete)) {
                $variantsWithImages = $this->productVariantModel->whereIn('id', $variantsToDelete)->findAll();
                foreach($variantsWithImages as $variantWithImage) {
                    if ($variantWithImage['image_url'] && file_exists(WRITEPATH . 'uploads/products/' . $variantWithImage['image_url'])) {
                        unlink(WRITEPATH . 'uploads/products/' . $variantWithImage['image_url']);
                    }
                }
                $this->productVariantModel->whereIn('id', $variantsToDelete)->delete();
            }
        }

        $variantsRaw = $this->request->getPost('variants');
        $uploadedFiles = $this->request->getFiles();

        if ($variantsRaw) {
            $variants = json_decode($variantsRaw, true);
            if (!empty($variants)) {
                foreach ($variants as $variantData) {
                    if (isset($variantData['id'])) {
                        $variantId = $variantData['id'];
                        $updateData = ['price' => $variantData['price']];
                        
                        if (isset($uploadedFiles['variant_images']) && isset($uploadedFiles['variant_images'][$variantId])) {
                            $variantImageFile = $uploadedFiles['variant_images'][$variantId];
                            
                            if ($variantImageFile->isValid() && !$variantImageFile->hasMoved()) {
                                $existingVariant = $this->productVariantModel->find($variantId);
                                if ($existingVariant && $existingVariant['image_url'] && file_exists(WRITEPATH . 'uploads/products/' . $existingVariant['image_url'])) {
                                    unlink(WRITEPATH . 'uploads/products/' . $existingVariant['image_url']);
                                }
                                $newName = $variantImageFile->getRandomName();
                                $variantImageFile->move(WRITEPATH . 'uploads/products', $newName);
                                $updateData['image_url'] = $newName;
                            }
                        }
                        
                        $this->productVariantModel->update($variantId, $updateData);
                    }
                }
            }
        }

        return $this->respondUpdated(['id' => $id], 'Product and variants updated successfully');
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
            if ($product['image'] && file_exists(WRITEPATH . 'uploads/products/' . $product['image'])) {
                unlink(WRITEPATH . 'uploads/products/' . $product['image']);
            }

            $variants = $this->productVariantModel->where('product_id', $id)->findAll();
            foreach($variants as $variant) {
                if ($variant['image_url'] && file_exists(WRITEPATH . 'uploads/products/' . $variant['image_url'])) {
                    unlink(WRITEPATH . 'uploads/products/' . $variant['image_url']);
                }
            }
            $this->productVariantModel->where('product_id', $id)->delete();

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

    // Product Approval Management Methods
    public function getPendingProducts()
    {
        try {
            $page = $this->request->getVar('page') ?? 1;
            $perPage = $this->request->getVar('perPage') ?? 20;
            $offset = ($page - 1) * $perPage;

            // Get products pending approval (is_approved = false AND is_active != false)
        // This excludes rejected products which have is_active = false
        $products = $this->productModel
            ->select('products.*, categories.name as category_name, stores.name as store_name')
            ->join('categories', 'categories.id = products.category_id', 'left')
            ->join('stores', 'stores.id = products.store_id', 'left')
            ->where('products.is_approved', false)
            ->where('(products.is_active IS NULL OR products.is_active != 0)')
            ->orderBy('products.created_at', 'DESC')
            ->findAll($perPage, $offset);

        // Get total count for pagination
        $totalCount = $this->productModel
            ->where('is_approved', false)
            ->where('(is_active IS NULL OR is_active != 0)')
            ->countAllResults();

            return $this->respond([
                'products' => $products,
                'pagination' => [
                    'current_page' => (int)$page,
                    'per_page' => (int)$perPage,
                    'total' => $totalCount,
                    'total_pages' => ceil($totalCount / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('Failed to fetch pending products.');
        }
    }

    public function approveProduct($id)
    {
        try {
            $product = $this->productModel->find($id);
            if (!$product) {
                return $this->failNotFound('Product not found.');
            }

            $updateData = [
                'is_approved' => true,
                'is_active' => true
            ];

            if ($this->productModel->update($id, $updateData)) {
                return $this->respond([
                    'message' => 'Product approved successfully.',
                    'product' => $this->productModel->find($id)
                ]);
            } else {
                return $this->failServerError('Failed to approve product.');
            }
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while approving the product.');
        }
    }

    public function rejectProduct($id)
    {
        try {
            $product = $this->productModel->find($id);
            if (!$product) {
                return $this->failNotFound('Product not found.');
            }

            // For rejection, we can either delete the product or mark it as rejected
            // Let's add a rejection reason from the request
            $data = $this->request->getJSON(true);
            $rejectionReason = $data['reason'] ?? 'No reason provided';

            $updateData = [
                'is_approved' => false,
                'is_active' => false,
                'rejection_reason' => $rejectionReason
            ];

            if ($this->productModel->update($id, $updateData)) {
                return $this->respond([
                    'message' => 'Product rejected successfully.',
                    'product' => $this->productModel->find($id)
                ]);
            } else {
                return $this->failServerError('Failed to reject product.');
            }
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An unexpected error occurred while rejecting the product.');
        }
    }

    public function getRejectedProducts()
    {
        try {
            $page = $this->request->getVar('page') ?? 1;
            $perPage = $this->request->getVar('perPage') ?? 20;
            $offset = ($page - 1) * $perPage;

            // Get rejected products (is_approved = false AND is_active = false)
            $products = $this->productModel
                ->select('products.*, categories.name as category_name, stores.name as store_name')
                ->join('categories', 'categories.id = products.category_id', 'left')
                ->join('stores', 'stores.id = products.store_id', 'left')
                ->where('products.is_approved', false)
                ->where('products.is_active', false)
                ->orderBy('products.updated_at', 'DESC')
                ->findAll($perPage, $offset);

            // Get total count for pagination
            $totalCount = $this->productModel
                ->where('is_approved', false)
                ->where('is_active', false)
                ->countAllResults();

            return $this->respond([
                'products' => $products,
                'pagination' => [
                    'current_page' => (int)$page,
                    'per_page' => (int)$perPage,
                    'total' => $totalCount,
                    'total_pages' => ceil($totalCount / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('Failed to fetch rejected products.');
        }
    }


}
