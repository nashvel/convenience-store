<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class ProductController extends ResourceController
{
    protected $modelName = 'App\Models\ProductModel';
    protected $format    = 'json';

    public function index()
    {
        $products = $this->model->select('products.*, categories.name as category_name')
                                 ->join('categories', 'categories.id = products.category_id')
                                 ->findAll();
        log_message('error', 'Products data: ' . json_encode($products)); // Using 'error' level to ensure it's logged
        return $this->respond($products);
    }

    public function show($id = null)
    {
        return $this->respond($this->model->find($id));
    }
}
