<?php

namespace App\Controllers;

use App\Models\ProductModel;
use App\Models\CategoryModel;
use App\Models\ProductVariantModel;
use App\Models\StoreModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class SellerProductController extends ResourceController
{
    use ResponseTrait;

    protected $productModel;
    protected $categoryModel;
    protected $productVariantModel;
    protected $storeModel;

    public function __construct()
    {
        $this->productModel = new ProductModel();
        $this->categoryModel = new CategoryModel();
        $this->productVariantModel = new ProductVariantModel();
        $this->storeModel = new StoreModel();
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

        $products = $this->productModel->where('store_id', $storeId)->findAll();

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

        $data = $this->request->getJSON(true);
        $data['store_id'] = $storeId;

        if ($this->productModel->insert($data)) {
            return $this->respondCreated($this->productModel->find($this->productModel->insertID()));
        } else {
            return $this->fail($this->productModel->errors());
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
