<?php

namespace App\Controllers;

use App\Models\CategoryModel;
use App\Models\ProductModel;
use App\Models\ProductVariantModel;
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

        log_message('debug', 'Request Params: ' . json_encode($this->request->getGet()));
        
        $this->model->select('products.*, c1.name as category_name, c2.name as parent_category_name, stores.id as store_id, stores.name as store_name, stores.logo as store_logo_url, users.id as owner_id, users.first_name as owner_first_name, users.last_name as owner_last_name, users.avatar as owner_avatar_url')
                    ->join('stores', 'stores.id = products.store_id')
                    ->join('users', 'users.id = stores.client_id')
                    ->join('categories c1', 'c1.id = products.category_id', 'left') // Changed to left join to ensure products without categories are not excluded
                    ->join('categories c2', 'c2.id = c1.parent_id', 'left')
                    ->where('products.is_approved', 1);

        if ($categoryName) {
            log_message('debug', 'Received category filter: ' . $categoryName);
            log_message('debug', 'Received category filter string: ' . $categoryName);
            $categoryNames = array_map('trim', explode(',', $categoryName));
            log_message('debug', 'Parsed category names: ' . json_encode($categoryNames));
            $allCategoryIds = [];
            $categoryModel = new CategoryModel();

            foreach ($categoryNames as $name) {
                log_message('debug', 'Processing category name: ' . $name);
                if (empty($name)) continue;
                $trimmedName = trim($name);
                if (empty($trimmedName)) continue;

                $category = $categoryModel->where('name', $trimmedName)->first();

                log_message('debug', 'Found category in DB: ' . json_encode($category));
                if ($category) {
                    log_message('debug', 'Processing category: ' . $trimmedName);
                    // If it's a parent category, get its children's IDs
                    if ($category['parent_id'] === null) {
                        $childCategories = $categoryModel->where('parent_id', $category['id'])->findAll();
                        $childIds = array_column($childCategories, 'id');
                        $allCategoryIds = array_merge($allCategoryIds, $childIds);
                    }
                    // Always add the category's own ID
                    $allCategoryIds[] = $category['id'];
                } else {
                    log_message('warning', 'Category not found in DB: ' . $trimmedName);
                }
            }

            log_message('debug', 'All collected category IDs (before unique): ' . json_encode($allCategoryIds));
            if (!empty($allCategoryIds)) {
                $uniqueCategoryIds = array_unique($allCategoryIds);
                log_message('debug', 'Final unique category IDs for query: ' . json_encode($uniqueCategoryIds));
                log_message('debug', 'Final unique category IDs for query: ' . json_encode($uniqueCategoryIds));
                $this->model->whereIn('products.category_id', $uniqueCategoryIds);
            } else {
                log_message('debug', 'No valid categories found after parsing. Returning no products.');
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

        if ($storeId) {
            $this->model->where('products.store_id', $storeId);
        }



        $products = $this->model->findAll();
        log_message('debug', 'Raw products from DB in index: ' . json_encode($products));

        $variantModel = new ProductVariantModel();

        foreach ($products as &$product) {
            if ($product['product_type'] === 'variable') {
                log_message('debug', 'Processing variable product ID: ' . $product['id']);
                $variants = $variantModel->where('product_id', $product['id'])->findAll();
                log_message('debug', 'Found ' . count($variants) . ' variants for product ID: ' . $product['id']);
                if (!empty($variants)) {
                    log_message('debug', 'Variants found for product ID ' . $product['id'] . ': ' . json_encode($variants));
                    $totalStock = array_sum(array_column($variants, 'stock'));
                    $prices = array_column($variants, 'price');
                    $product['stock'] = $totalStock;
                    $product['min_price'] = min($prices);
                    $product['max_price'] = max($prices);
                    $product['price'] = $product['min_price']; // Set base price to min price for filtering
                    log_message('debug', 'Calculated price range for product ID ' . $product['id'] . ': ' . $product['min_price'] . '-' . $product['max_price']);
                } else {
                    log_message('debug', 'No variants found for product ID ' . $product['id'] . '. Setting stock and price to 0.');
                    $product['stock'] = 0;
                    $product['price'] = 0;
                    $product['min_price'] = 0;
                    $product['max_price'] = 0;
                }
            }
        }

        // Fetch active promotions
        $promotionModel = new \App\Models\PromotionModel();
        $activePromotions = $promotionModel->getActivePromotionsWithScopes();

        $structuredProducts = array_map(function ($product) use ($activePromotions) {
            $finalProduct = [
                'id' => $product['id'],
                'name' => $product['name'],
                'description' => $product['description'],
                'price' => (float)$product['price'],
                'min_price' => isset($product['min_price']) ? (float)$product['min_price'] : null,
                'max_price' => isset($product['max_price']) ? (float)$product['max_price'] : null,
                'image' => $product['image'],
                'stock' => (int)$product['stock'],
                'product_type' => $product['product_type'],
                'rating' => null, // Not available in list view
                'review_count' => 0, // Not available in list view
                'variants' => [], // Not sending full variants in list view
                'store' => [
                    'id' => $product['store_id'],
                    'name' => $product['store_name'],
                    'logo_url' => $product['store_logo_url'],
                    'owner' => [
                        'id' => $product['owner_id'],
                        'first_name' => $product['owner_first_name'],
                        'last_name' => $product['owner_last_name'],
                        'avatar_url' => $product['owner_avatar_url'],
                    ]
                ],
                'original_price' => null,
                'has_discount' => false,
            ];

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
                    $finalProduct['original_price'] = $finalProduct['price'];
                    $finalProduct['price'] = round($finalProduct['price'] * (1 - $promo['discount_value'] / 100), 2);
                    $finalProduct['has_discount'] = true;
                    break; // Apply only the first matching promotion
                }
            }

            return $finalProduct;
        }, $products);

        log_message('debug', 'Final product count: ' . count($structuredProducts));
        log_message('debug', 'Final structured products in index: ' . json_encode($structuredProducts));

        return $this->respond($structuredProducts);
    }

    public function show($id = null)
    {
        log_message('debug', "ProductController::show START for product ID: {$id}");

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
        log_message('debug', "Product base data from DB for ID {$id}: " . json_encode($productData));

        $productData['variants'] = [];
        if ($productData['product_type'] === 'variable') {
            log_message('debug', "Product ID {$id} is a variable product. Fetching variants and attributes.");
            $db = \Config\Database::connect();
            
            // 1. Fetch all variants for the product
            $variants = $db->table('product_variants as pv')
                           ->select('pv.id, pv.price, pv.stock, pv.sku, pv.image_url')
                           ->where('pv.product_id', $id)
                           ->get()->getResultArray();

            if (!empty($variants)) {
                log_message('debug', "Found " . count($variants) . " variants for product {$id}.");
                $variantIds = array_column($variants, 'id');

                // 2. Fetch all attributes for all variants in a single query
                $attributesData = $db->table('product_variant_attributes as pva')
                                     ->select('pva.variant_id, a.name as attribute_name, av.value as attribute_value')
                                     ->join('attribute_values as av', 'pva.attribute_value_id = av.id')
                                     ->join('attributes as a', 'av.attribute_id = a.id')
                                     ->whereIn('pva.variant_id', $variantIds)
                                     ->get()->getResultArray();

                // 3. Group attributes by variant_id for efficient mapping
                $attributesByVariant = [];
                foreach ($attributesData as $attr) {
                    $attributesByVariant[$attr['variant_id']][] = [
                        'attribute_name' => $attr['attribute_name'],
                        'attribute_value' => $attr['attribute_value']
                    ];
                }
                log_message('debug', "Grouped attributes by variant: " . json_encode($attributesByVariant));

                // 4. Map attributes to their respective variants
                $totalStock = 0;
                foreach ($variants as &$variant) {
                    $variant['attributes'] = $attributesByVariant[$variant['id']] ?? [];
                    $totalStock += $variant['stock'];
                }
                
                $productData['variants'] = $variants;
                $productData['price'] = $variants[0]['price']; // Set main price to first variant's price
                $productData['stock'] = $totalStock; // Stock is the sum of all variants
            } else {
                log_message('debug', "No variants found for product {$id}, setting stock to 0.");
                $productData['stock'] = 0; // No variants means out of stock
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

        log_message('debug', "Final product structure for response for ID {$id}: " . json_encode($product));

        return $this->respond($product);
    }
}
