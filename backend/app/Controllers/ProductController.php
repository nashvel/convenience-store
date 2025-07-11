<?php

namespace App\Controllers;

use App\Models\CategoryModel;
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

        log_message('debug', 'Request Params: ' . json_encode($this->request->getGet()));
        
        $this->model->select('products.*, c1.name as category_name, c2.name as parent_category_name, stores.id as store_id, stores.name as store_name, stores.logo as store_logo_url, users.id as owner_id, users.first_name as owner_first_name, users.last_name as owner_last_name, users.avatar as owner_avatar_url')
                    ->join('stores', 'stores.id = products.store_id')
                    ->join('users', 'users.id = stores.client_id')
                    ->join('categories c1', 'c1.id = products.category_id', 'left') // Changed to left join to ensure products without categories are not excluded
                    ->join('categories c2', 'c2.id = c1.parent_id', 'left')
                    ->where('products.is_approved', 1);

        if ($categoryName) {
            $categoryModel = new CategoryModel();
            $category = $categoryModel->where('name', $categoryName)->first();

            if ($category) {
                log_message('debug', 'Category found: ' . json_encode($category));
                // Check if it's a parent category (no parent_id)
                if ($category['parent_id'] === null) {
                    log_message('debug', 'Processing as parent category.');
                    $childCategories = $categoryModel->where('parent_id', $category['id'])->findAll();
                    if (!empty($childCategories)) {
                        $categoryIds = array_column($childCategories, 'id');
                        log_message('debug', 'Child category IDs for query: ' . json_encode($categoryIds));
                        $this->model->whereIn('products.category_id', $categoryIds);
                    } else {
                        // If a parent category has no children, it can't have products based on current logic.
                        return $this->respond([]);
                    }
                } else {
                    log_message('debug', 'Processing as sub-category.');
                    // It's a sub-category
                    $this->model->where('products.category_id', $category['id']);
                }
            } else {
                log_message('debug', 'Category not found in DB: ' . $categoryName);
                // If category is specified but not found, return no results.
                return $this->respond([]);
            }
        }

        if ($searchTerm) {
            $this->model->groupStart()
                        ->like('products.name', $searchTerm)
                        ->orLike('products.description', $searchTerm)
                        ->groupEnd();
        }

        if ($minPrice !== null) {
            $this->model->where('products.price >=', (float)$minPrice);
        }

        if ($maxPrice !== null) {
            $this->model->where('products.price <=', (float)$maxPrice);
        }

        if ($onDeal === 'true') {
            $this->model->where('products.featured', 1);
        }

        $products = $this->model->findAll();
        log_message('debug', 'Raw products from DB in index: ' . json_encode($products));

        // Fetch active promotions
        $promotionModel = new \App\Models\PromotionModel();
        $activePromotions = $promotionModel->getActivePromotionsWithScopes();

        $productsWithDiscounts = array_map(function ($product) use ($activePromotions) {
            $originalPrice = (float)$product['price'];
            $bestDiscountedPrice = $originalPrice;
            $applicablePromotion = null;

            foreach ($activePromotions as $promo) {
                $applies = false;
                switch ($promo['scope_type']) {
                    case 'all_products':
                        $applies = true;
                        break;
                    case 'store_id':
                        if ($product['store_id'] == $promo['scope_value']) {
                            $applies = true;
                        }
                        break;
                    case 'category_id':
                        if ($product['category_id'] == $promo['scope_value']) {
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
                    $discountedPrice = 0;
                    if ($promo['discount_type'] === 'percentage') {
                        $discountedPrice = $originalPrice - ($originalPrice * $promo['discount_value'] / 100);
                    } else { // fixed
                        $discountedPrice = $originalPrice - $promo['discount_value'];
                    }

                    if ($discountedPrice < $bestDiscountedPrice) {
                        $bestDiscountedPrice = $discountedPrice;
                        $applicablePromotion = $promo;
                    }
                }
            }

            if ($applicablePromotion) {
                $product['price'] = max(0, $bestDiscountedPrice);
                $product['original_price'] = $originalPrice;
                $product['has_discount'] = true;
            } else {
                $product['original_price'] = null;
                $product['has_discount'] = false;
            }

            return $product;
        }, $products);

        // Restructure the data for the frontend *after* applying discounts
        $structuredProducts = array_map(function ($p) {
            return [
                'id' => $p['id'],
                'name' => $p['name'],
                'description' => $p['description'],
                'price' => $p['price'],
                'image' => $p['image'],
                'stock' => $p['stock'],
                'original_price' => $p['original_price'],
                'has_discount' => $p['has_discount'],
                'store' => [
                    'id' => $p['store_id'],
                    'name' => $p['store_name'],
                    'logo_url' => $p['store_logo_url'],
                    'owner' => [
                        'id' => $p['owner_id'],
                        'first_name' => $p['owner_first_name'],
                        'last_name' => $p['owner_last_name'],
                        'avatar_url' => $p['owner_avatar_url'],
                    ]
                ]
            ];
        }, $productsWithDiscounts);

        log_message('debug', 'Final product count: ' . count($productsWithDiscounts));
        log_message('debug', 'ProductController::index END');

        log_message('debug', 'Final structured products in index: ' . json_encode($structuredProducts));
        return $this->respond($structuredProducts);
    }

    public function show($id = null)
    {
        $productData = $this->model
            ->select('products.*, stores.id as store_id, stores.name as store_name, stores.logo as store_logo_url, users.id as owner_id, users.first_name as owner_first_name, users.last_name as owner_last_name, users.avatar as owner_avatar_url')
            ->join('stores', 'stores.id = products.store_id')
            ->join('users', 'users.id = stores.client_id')
            ->where('products.id', $id)
            ->first();

        log_message('debug', 'Product data from DB for ID ' . $id . ': ' . json_encode($productData));

        if (!$productData) {
            return $this->failNotFound('Product not found');
        }

        // Restructure the data for the frontend
        $product = [
            'id' => $productData['id'],
            'name' => $productData['name'],
            'description' => $productData['description'],
            'price' => $productData['price'],
            'image' => $productData['image'],
            'stock' => $productData['stock'],
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
        
        log_message('debug', 'Final product structure for response: ' . json_encode($product));

        return $this->respond($product);
    }
}
