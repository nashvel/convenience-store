<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class ProductVariantController extends ResourceController
{
    use ResponseTrait;

    public function getVariantsForProduct($productId)
    {
        $db = \Config\Database::connect();

        // Fetch all variants for the product, including the new 'attributes' JSON column
        $variants = $db->table('product_variants as pv')
                       ->select('pv.id, pv.price, pv.stock, pv.sku, pv.image_url as image, pv.attributes')
                       ->where('pv.product_id', $productId)
                       ->get()->getResultArray();

        if (empty($variants)) {
            log_message('debug', "No variants found for product {$productId}.");
            return [];
        }

        return $variants;
    }
}
