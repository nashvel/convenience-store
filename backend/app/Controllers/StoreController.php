<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class StoreController extends ResourceController
{
    protected $modelName = 'App\Models\StoreModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->response->setJSON($this->model->findAll());
    }
}
