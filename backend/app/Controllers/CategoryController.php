<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class CategoryController extends ResourceController
{
    protected $modelName = 'App\Models\CategoryModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function nested()
    {
        $categories = $this->model->findAll();
        $nestedCategories = $this->buildTree($categories);
        return $this->respond($nestedCategories);
    }

    private function buildTree(array $elements)
    {
        $categoryMap = [];
        foreach ($elements as $element) {
            $categoryMap[$element['id']] = $element;
            $categoryMap[$element['id']]['children'] = [];
        }

        $tree = [];
        foreach ($categoryMap as $id => &$node) {
            if ($node['parent_id'] && isset($categoryMap[$node['parent_id']])) {
                $categoryMap[$node['parent_id']]['children'][] = &$node;
            } else {
                $tree[] = &$node;
            }
        }
        return $tree;
    }
}
