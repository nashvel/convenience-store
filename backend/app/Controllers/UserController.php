<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class UserController extends ResourceController
{
    use ResponseTrait;

    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    // Note: This needs a filter to protect it!
    public function updateProfile()
    {
        // For now, we'll assume a user ID is in the session.
        // We need to implement a proper auth check (e.g., JWT or session filter).
        $userId = session()->get('user_id');

        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to update your profile.');
        }

        $data = $this->request->getJSON(true);

        $updateData = [];
        if (isset($data['firstName'])) {
            $updateData['first_name'] = $data['firstName'];
        }
        if (isset($data['lastName'])) {
            $updateData['last_name'] = $data['lastName'];
        }

        if (empty($updateData)) {
            return $this->failValidation('No data provided to update.');
        }

        try {
            $this->userModel->update($userId, $updateData);
            $updatedUser = $this->userModel->find($userId);

            return $this->respond([
                'status' => 'success',
                'message' => 'Profile updated successfully.',
                'user' => $updatedUser
            ]);
        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while updating the profile.');
        }
    }

    // Note: This also needs a filter to protect it!
    public function changePassword()
    {
        $userId = session()->get('user_id');

        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to change your password.');
        }

        $data = $this->request->getJSON(true);

        $rules = [
            'currentPassword' => 'required',
            'newPassword'     => 'required|min_length[8]',
            'confirmPassword' => 'required|matches[newPassword]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidation($this->validator->getErrors());
        }

        $user = $this->userModel->find($userId);

        if (!$user || !password_verify($data['currentPassword'], $user['password_hash'])) {
            return $this->failUnauthorized('The current password you entered is incorrect.');
        }

        try {
            $this->userModel->update($userId, [
                'password_hash' => password_hash($data['newPassword'], PASSWORD_DEFAULT)
            ]);

            return $this->respond(['status' => 'success', 'message' => 'Password changed successfully.']);

        } catch (\Exception $e) {
            log_message('error', '[ERROR] {exception}', ['exception' => $e]);
            return $this->failServerError('An error occurred while changing the password.');
        }
    }
}
