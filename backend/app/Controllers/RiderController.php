<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;

class RiderController extends BaseController
{
    use ResponseTrait;

    public function getRidersByStore($storeId)
    {
        $userModel = new UserModel();

        // Assuming 'rider' role has ID 3
        $riders = $userModel->where('store_id', $storeId)
                            ->where('role_id', 3)
                            ->findAll();

        if (empty($riders)) {
            return $this->respond(['success' => false, 'message' => 'No riders found for this store.'], 404);
        }

        return $this->respond(['success' => true, 'riders' => $riders]);
    }
}
