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
        
        $this->model->select('products.*, c1.name as category_name, c2.name as parent_category_name, stores.name as store_name')
                    ->join('categories c1', 'c1.id = products.category_id')
                    ->join('stores', 'stores.id = products.store_id')
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

        log_message('debug', 'Final product count: ' . count($products));
        log_message('debug', 'ProductController::index END');

        return $this->respond($products);
    }

    public function show($id = null)
    {
        $product = $this->model->select('products.*, c1.name as category_name, c2.name as parent_category_name, stores.name as store_name')
                               ->join('categories c1', 'c1.id = products.category_id')
                               ->join('stores', 'stores.id = products.store_id')
                               ->join('categories c2', 'c2.id = c1.parent_id', 'left')
                               ->find($id);

        if (!$product) {
            return $this->failNotFound('Product not found');
        }
        
        return $this->respond($product);
    }
}
