<?php

namespace App\Controllers;

use App\Models\CategoryModel;
use App\Models\ProductModel;
use App\Models\ProductVariantModel;
use CodeIgniter\API\ResponseTrait;
use App\Controllers\ProductVariantController;
use CodeIgniter\RESTful\ResourceController;

class ProductController extends ResourceController
{
    protected $modelName = 'App\Models\ProductModel';
    protected $format    = 'json';

    public function index()
    {
        log_message('debug', 'ProductController::index START');
        $categoryName = $this->request->getGet('category');
        $searchTerm = $this->request->getGet('search');
        $minPrice = $this->request->getGet('minPrice');
        $maxPrice = $this->request->getGet('maxPrice');
        $onDeal = $this->request->getGet('on_deal');
        $storeId = $this->request->getGet('store_id');

        $this->model->select('products.*, c1.name as category_name, c2.name as parent_category_name, stores.id as store_id, stores.name as store_name, stores.logo as store_logo_url, users.id as owner_id, users.first_name as owner_first_name, users.last_name as owner_last_name, users.avatar as owner_avatar_url')
            ->join('stores', 'stores.id = products.store_id')
            ->join('users', 'users.id = stores.client_id')
            ->join('categories c1', 'c1.id = products.category_id', 'left')
            ->join('categories c2', 'c2.id = c1.parent_id', 'left')
            ->where('products.is_approved', 1);

        if ($categoryName) {
            $categoryNames = array_map('trim', explode(',', $categoryName));
            $allCategoryIds = [];
            $categoryModel = new CategoryModel();

            foreach ($categoryNames as $name) {
                if (empty($name)) continue;
                $category = $categoryModel->where('name', $name)->first();
                if ($category) {
                    if ($category['parent_id'] === null) {
                        $childCategories = $categoryModel->where('parent_id', $category['id'])->findAll();
                        $childIds = array_column($childCategories, 'id');
                        $allCategoryIds = array_merge($allCategoryIds, $childIds);
                    }
                    $allCategoryIds[] = $category['id'];
                }
            }

            if (!empty($allCategoryIds)) {
                $this->model->whereIn('products.category_id', array_unique($allCategoryIds));
            } else {
                return $this->respond([]);
            }
        }

        if ($searchTerm) {
            $this->model->groupStart();
            $this->model->like('products.name', $searchTerm);
            $this->model->orLike('products.description', $searchTerm);
            $this->model->groupEnd();
        }

        if ($minPrice) {
            $this->model->where('products.price >=', $minPrice);
        }

        if ($maxPrice) {
            $this->model->where('products.price <=', $maxPrice);
        }

        if ($onDeal) {
            $this->model->where('products.on_deal', 1);
        }

        if ($storeId) {
            $this->model->where('products.store_id', $storeId);
        }

        $perPage = $this->request->getGet('perPage') ?? 10;
        $products = $this->model->paginate($perPage);

        $variantController = new ProductVariantController();
        foreach ($products as &$product) {
            if ($product['product_type'] === 'variable') {
                $product['variants'] = $variantController->getVariantsForProduct($product['id']);
            } else {
                $product['variants'] = [];
            }
        }
        unset($product);

        $pager = $this->model->pager;

        $response = [
            'products' => $products,
            'pager' => [
                'currentPage' => $pager->getCurrentPage(),
                'perPage' => $pager->getPerPage(),
                'total' => $pager->getTotal(),
                'pageCount' => $pager->getPageCount(),
            ]
        ];

        log_message('debug', 'ProductController::index END');
        return $this->respond($response);
    }

    public function show($id = null)
    {
        $productData = $this->model
            ->select('products.*, c1.name as category_name, c2.name as parent_category_name, stores.id as store_id, stores.name as store_name, stores.logo as store_logo_url, users.id as owner_id, users.first_name as owner_first_name, users.last_name as owner_last_name, users.avatar as owner_avatar_url, (SELECT AVG(rating) FROM reviews WHERE reviews.product_id = products.id) as rating, (SELECT COUNT(id) FROM reviews WHERE reviews.product_id = products.id) as review_count')
            ->join('stores', 'stores.id = products.store_id')
            ->join('users', 'users.id = stores.client_id')
            ->join('categories c1', 'c1.id = products.category_id', 'left')
            ->join('categories c2', 'c2.id = c1.parent_id', 'left')
            ->where('products.id', $id)
            ->first();

        if (!$productData) {
            log_message('warning', "Product with ID {$id} not found in database.");
            return $this->failNotFound('Product not found');
        }

        $productData['variants'] = [];
        if ($productData['product_type'] === 'variable') {
            $variantController = new ProductVariantController();
            $variants = $variantController->getVariantsForProduct($id);

            // Decode attributes for each variant
            foreach ($variants as &$variant) {
                if (isset($variant['attributes'])) {
                    $variant['attributes'] = json_decode($variant['attributes'], true);
                }
            }
            unset($variant);

            $productData['variants'] = $variants;

            if (!empty($variants)) {
                // Set main price to first variant's price and stock to the sum of all variants
                $productData['price'] = $variants[0]['price'];
                $productData['stock'] = array_sum(array_column($variants, 'stock'));
            } else {
                // If a variable product has no variants, it's out of stock
                $productData['stock'] = 0;
            }
        }

        // Restructure the data for the frontend
        $product = [
            'id' => $productData['id'],
            'name' => $productData['name'],
            'description' => $productData['description'],
            'price' => $productData['price'],
            'image' => $productData['image'],
            'stock' => $productData['stock'],
            'product_type' => $productData['product_type'],
            'rating' => $productData['rating'], // Include rating
            'review_count' => $productData['review_count'], // Include review count
            'variants' => $productData['variants'],
            'category_id' => $productData['category_id'], // Add the missing category_id
            'category_name' => $productData['category_name'],
            'parent_category_name' => $productData['parent_category_name'],
            'store' => [
                'id' => $productData['store_id'],
                'name' => $productData['store_name'],
                'logo_url' => $productData['store_logo_url'],
                'owner' => [
                    'id' => $productData['owner_id'],
                    'first_name' => $productData['owner_first_name'],
                    'last_name' => $productData['owner_last_name'],
                    'avatar_url' => $productData['owner_avatar_url'],
                ]
            ]
        ];
        
        // Apply promotions
        $promotionModel = new \App\Models\PromotionModel();
        $activePromotions = $promotionModel->getActivePromotionsWithScopes();

        foreach ($activePromotions as $promo) {
            $applies = false;
            switch ($promo['scope_type']) {
                case 'all_products':
                    $applies = true;
                    break;
                case 'store_id':
                    if ($product['store']['id'] == $promo['scope_value']) {
                        $applies = true;
                    }
                    break;
                case 'category_id':
                    if ($productData['category_id'] == $promo['scope_value']) {
                        $applies = true;
                    }
                    break;
                case 'product_id':
                    if ($product['id'] == $promo['scope_value']) {
                        $applies = true;
                    }
                    break;
            }

            if ($applies) {
                // Apply discount to the main product price for display
                $product['original_price'] = $product['price'];
                $product['price'] = round($product['price'] * (1 - $promo['discount_value'] / 100), 2);
                $product['has_discount'] = true;

                // Also apply discount to each variant's price
                if (!empty($product['variants'])) {
                    foreach ($product['variants'] as &$variant) {
                        $variant['original_price'] = $variant['price'];
                        $variant['price'] = round($variant['price'] * (1 - $promo['discount_value'] / 100), 2);
                    }
                    unset($variant); // Unset reference after loop
                }

                break; // Apply only the first matching promotion
            }
        }

        log_message('debug', 'Final product data for ID ' . $id . ': ' . json_encode($product, JSON_PRETTY_PRINT));
        return $this->respond($product);
    }
}
