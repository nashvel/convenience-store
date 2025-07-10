<?php

namespace App\Controllers;

use App\Models\PromotionModel;
use App\Models\PromotionScopeModel;
use App\Models\StorePromotionModel;
use CodeIgniter\RESTful\ResourceController;

class PromotionController extends ResourceController
{
    public function createPromotion()
    {
        $endDateStr = $this->request->getVar('end_date');
        if (new \DateTime($endDateStr) < new \DateTime('today')) {
            return $this->fail('End date cannot be in the past.', 400);
        }

        $model = new PromotionModel();
        $data = [
            'title' => $this->request->getVar('title'),
            'description' => $this->request->getVar('description'),
            'discount_type' => $this->request->getVar('discount_type'),
            'discount_value' => $this->request->getVar('discount_value'),
            'start_date' => $this->request->getVar('start_date') . ' 00:00:00',
            'end_date' => $this->request->getVar('end_date') . ' 23:59:59',

        ];

        $file = $this->request->getFile('promo_image_banner');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $uploadPath = WRITEPATH . 'uploads';
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }
            $file->move($uploadPath, $newName);
            $data['promo_image_banner'] = $newName;
        }

        $promoId = $model->insert($data);

        if ($model->errors()) {
            return $this->fail($model->errors());
        }

        if ($promoId) {
            $scopeModel = new PromotionScopeModel();
            $scopeData = [
                'promotion_id' => $promoId,
                'scope_type'  => $this->request->getVar('scope_type'),
                'scope_value' => $this->request->getVar('scope_value') ?: null,
            ];

            $scopeModel->insert($scopeData);

            if ($scopeModel->errors()) {
                // If scope insertion fails, it's good practice to delete the promotion
                // to avoid orphaned data. For simplicity, we'll just return the error.
                return $this->fail($scopeModel->errors());
            }

            return $this->respondCreated(['message' => 'Promotion created successfully', 'id' => $promoId]);
        } else {
            return $this->fail('Failed to create promotion');
        }
    }

    public function getActivePromotions()
    {
        $model = new PromotionModel();
        // Use the new getActivePromotionsWithScopes method to ensure consistency
        $promotions = $model->getActivePromotionsWithScopes();

        foreach ($promotions as &$promotion) {
            if (!empty($promotion['promo_image_banner'])) {
                $promotion['image_url'] = base_url('api/promotions/image/' . $promotion['promo_image_banner']);
            } else {
                $promotion['image_url'] = null;
            }
        }

        return $this->respond($promotions);
    }

    public function delete($id = null)
    {
        $promoModel = new PromotionModel();
        $scopeModel = new PromotionScopeModel();

        // Check if the promotion exists
        $promotion = $promoModel->find($id);
        if (!$promotion) {
            return $this->failNotFound('Promotion not found');
        }

        // Start transaction
        $this->db = \Config\Database::connect();
        $this->db->transStart();

        // Delete scope first
        $scopeModel->where('promotion_id', $id)->delete();

        // Delete promotion
        $promoModel->delete($id);

        // Complete transaction
        $this->db->transComplete();

        if ($this->db->transStatus() === false) {
            return $this->fail('Failed to delete promotion due to a transaction error.');
        }

        return $this->respondDeleted(['message' => 'Promotion deleted successfully']);
    }

    public function serveImage($filename)
    {
        // Sanitize the filename to prevent directory traversal attacks
        $filename = basename($filename);

        // Path to the uploads directory
        $path = WRITEPATH . 'uploads/' . $filename;

        // Check if file exists and is a file
        if (!is_file($path)) {
            return $this->response->setStatusCode(404, 'File not found');
        }

        // Get the file's mime type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $path);
        finfo_close($finfo);

        // Set the headers for the response
        $this->response
            ->setHeader('Content-Type', $mimeType)
            ->setHeader('Content-Length', filesize($path))
            ->setHeader('Content-Disposition', 'inline; filename="' . $filename . '"');

        // Send the file contents as the response body
        return $this->response->setBody(file_get_contents($path));
    }
}
