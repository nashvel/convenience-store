<?php

namespace App\Controllers;

use App\Models\AddressModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class AddressController extends ResourceController
{
    use ResponseTrait;

    protected $addressModel;

    public function __construct()
    {
        $this->addressModel = new AddressModel();
    }

    public function getAddresses()
    {
        $userId = session()->get('id');

        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to view addresses.');
        }

        try {
            $addresses = $this->addressModel->where('user_id', $userId)->findAll();

            return $this->respond([
                'status' => 'success',
                'addresses' => $addresses
            ]);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while fetching addresses.');
        }
    }

    public function addAddress()
    {

        $userId = session()->get('id');

        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to add an address.');
        }

        $data = $this->request->getJSON(true);
        $data['user_id'] = $userId;

        // If this is the user's first address, set it as default
        $existingAddresses = $this->addressModel->where('user_id', $userId)->countAllResults();
        if ($existingAddresses === 0) {
            $data['is_default'] = true;
        }

        try {
            $this->addressModel->insert($data);
            $newAddressId = $this->addressModel->getInsertID();
            $newAddress = $this->addressModel->find($newAddressId);

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Address added successfully.',
                'address' => $newAddress
            ]);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while adding the address.');
        }
    }

    public function updateAddress($id = null)
    {
        $userId = session()->get('id');

        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to update an address.');
        }

        $data = $this->request->getJSON(true);

        // Verify the address belongs to the user
        $address = $this->addressModel->find($id);
        if (!$address || $address['user_id'] != $userId) {
            return $this->failNotFound('The specified address does not exist or you do not have permission to edit it.');
        }

        try {
            $this->addressModel->update($id, $data);
            $updatedAddress = $this->addressModel->find($id);

            return $this->respond([
                'status' => 'success',
                'message' => 'Address updated successfully.',
                'address' => $updatedAddress
            ]);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while updating the address.');
        }
    }

    public function deleteAddress($id = null)
    {
        $userId = session()->get('id');

        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to delete an address.');
        }

        // Verify the address belongs to the user
        $address = $this->addressModel->find($id);
        if (!$address || $address['user_id'] != $userId) {
            return $this->failNotFound('The specified address does not exist or you do not have permission to delete it.');
        }

        try {
            $this->addressModel->delete($id);
            return $this->respondDeleted(['status' => 'success', 'message' => 'Address deleted successfully.']);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while deleting the address.');
        }
    }

    public function setDefaultAddress($id = null)
    {
        $userId = session()->get('id');

        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to set a default address.');
        }

        // Verify the address belongs to the user
        $address = $this->addressModel->find($id);
        if (!$address || $address['user_id'] != $userId) {
            return $this->failNotFound('The specified address does not exist or you do not have permission to modify it.');
        }

        try {
            // Set all other addresses for this user to not be default
            $this->addressModel->where('user_id', $userId)->set(['is_default' => false])->update();

            // Set the selected address as default
            $this->addressModel->update($id, ['is_default' => true]);

            return $this->respond(['status' => 'success', 'message' => 'Default address updated successfully.']);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while setting the default address.');
        }
    }
}
