<?php

namespace App\Controllers;

use App\Models\ChatModel;
use App\Models\ChatMessageModel;
use App\Models\ChatMessageMediaModel;
use CodeIgniter\API\ResponseTrait;

class ChatController extends BaseController
{
    private function getCurrentUser()
    {
        $session = session();
        return (object) [
            'id'         => $session->get('id'),
            'email'      => $session->get('email'),
            'first_name' => $session->get('first_name'),
            'last_name'  => $session->get('last_name'),
            'role'       => $session->get('role'),
        ];
    }
    public function findOrCreateChat()
    {
        $user = $this->getCurrentUser();
        $recipientId = $this->request->getJsonVar('recipientId');

        if (!$recipientId) {
            return $this->failValidationErrors('Recipient ID is required.');
        }

        // Assuming the current user is the customer and the recipient is the store owner (client)
        $customerId = $user->id;
        $clientId = $recipientId;

        $storeModel = new \App\Models\StoreModel();
        $store = $storeModel->where('client_id', $clientId)->first();

        if (!$store) {
            return $this->failNotFound('Store not found for the specified recipient.');
        }
        $storeId = $store['id'];

        $chatModel = new \App\Models\ChatModel();

        // Find existing chat between the customer and the store
        $chat = $chatModel->where('customer_id', $customerId)
                          ->where('store_id', $storeId)
                          ->first();

        if ($chat) {
            return $this->respond($chat);
        }

        // Or create a new one
        $newChatId = $chatModel->insert([
            'customer_id' => $customerId,
            'store_id'    => $storeId,
        ]);

        if ($newChatId === false) {
            log_message('error', 'ChatModel Insert Error: ' . json_encode($chatModel->errors()));
            return $this->failServerError('Failed to create chat.');
        }

        $newChat = $chatModel->find($newChatId);

        return $this->respondCreated($newChat);
    }

    public function getChats()
    {
        $user = $this->getCurrentUser();
        $chatModel = new ChatModel();
        $userModel = new \App\Models\UserModel();
        $storeModel = new \App\Models\StoreModel();
        $messageModel = new ChatMessageModel();
        $mediaModel = new ChatMessageMediaModel();

        $chats = [];

        if ($user->role === 'customer') {
            $chats = $chatModel->where('customer_id', $user->id)->findAll();
            foreach ($chats as &$chat) {
                $store = $storeModel->find($chat['store_id']);
                if ($store) {
                    $client = $userModel->select('id, first_name, last_name, avatar')->find($store['client_id']);
                    if ($client) {
                        $chat['other_user'] = $client;
                        $chat['other_user']['name'] = $store['name'];
                        // Prioritize store logo for avatar if it exists
                        if (!empty($store['logo'])) {
                            $chat['other_user']['avatar'] = $store['logo'];
                        }
                    }
                }
            }
        } elseif ($user->role === 'client') {
            $stores = $storeModel->where('client_id', $user->id)->findAll();
            $storeIds = array_column($stores, 'id');
            if (!empty($storeIds)) {
                $chats = $chatModel->whereIn('store_id', $storeIds)->findAll();
                foreach ($chats as &$chat) {
                    $customer = $userModel->select('id, first_name, last_name, avatar')->find($chat['customer_id']);
                    $chat['other_user'] = $customer;
                    if ($customer) {
                        $chat['other_user']['name'] = $customer['first_name'] . ' ' . $customer['last_name'];
                    }
                }
            }
        }

        unset($chat); // break the reference

        foreach ($chats as &$chat) {
            $lastMessage = $messageModel->where('chat_id', $chat['id'])->orderBy('created_at', 'DESC')->first();
            if ($lastMessage && !empty($lastMessage['created_at'])) {
                try {
                    $date = new \DateTime($lastMessage['created_at'], new \DateTimeZone('UTC'));
                    $lastMessage['created_at'] = $date->format(DATE_ATOM);
                } catch (\Exception $e) {
                    // Log error or handle invalid date format
                }
            }
            $chat['last_message'] = $lastMessage;

            // Add unread message count
            $chat['unread_count'] = $messageModel
                ->where('chat_id', $chat['id'])
                ->where('sender_id !=', $user->id)
                ->where('is_read', false)
                ->countAllResults();
        }

        return $this->respond($chats);
    }

    use ResponseTrait;

    public function getMessages($chatId)
    {
        $user = $this->getCurrentUser();
        $messageModel = new ChatMessageModel();
        $chatModel = new ChatModel();

        // Validate that the user is part of this chat
        $chat = $chatModel->find($chatId);
        if (!$chat) {
            return $this->failNotFound('Chat not found.');
        }

        $isParticipant = false;
        if ($user->role === 'customer' && $chat['customer_id'] == $user->id) {
            $isParticipant = true;
        } elseif ($user->role === 'client') {
            $storeModel = new \App\Models\StoreModel();
            $store = $storeModel->find($chat['store_id']);
            if ($store && $store['client_id'] == $user->id) {
                $isParticipant = true;
            }
        }

        if (!$isParticipant) {
            return $this->failForbidden('You are not authorized to view these messages.');
        }

        // Mark incoming messages as read
        $messageModel
            ->where('chat_id', $chatId)
            ->where('sender_id !=', $user->id)
            ->set(['is_read' => true])
            ->update();

        $messages = $messageModel->select('chat_messages.*, u.first_name, u.last_name, u.avatar')
            ->join('users u', 'u.id = chat_messages.sender_id')
            ->where('chat_id', $chatId)
            ->orderBy('chat_messages.created_at', 'asc')
            ->findAll();

        foreach ($messages as &$message) {
            if (!empty($message['created_at'])) {
                try {
                    $date = new \DateTime($message['created_at'], new \DateTimeZone('UTC'));
                    $message['created_at'] = $date->format(DATE_ATOM);
                } catch (\Exception $e) {
                    // Log error or handle invalid date format
                }
            }
        }

        $mediaModel = new ChatMessageMediaModel();
        foreach ($messages as &$message) {
            $message['media'] = $mediaModel->where('chat_message_id', $message['id'])->findAll();
        }

        return $this->respond($messages);
    }

    public function sendMessage($chatId)
    {
        $user = $this->getCurrentUser();
        $messageModel = new ChatMessageModel();

        // TODO: Add validation to ensure the user is part of the chat

        $text = $this->request->getPost('text');
        $files = $this->request->getFiles();

        if (empty($text) && empty($files['media'])) {
            return $this->fail('A message or a file is required.', 400);
        }

        $db = db_connect();
        $db->transStart();

        try {
            $messageData = [
                'chat_id'   => $chatId,
                'sender_id' => $user->id,
                'message'   => $text ?? '', // Ensure message is not null
                'created_at' => gmdate('Y-m-d H:i:s'), // Use UTC
            ];

            $messageId = $messageModel->insert($messageData);

            if ($messageId === false) {
                throw new \Exception($messageModel->errors() ? implode(', ', $messageModel->errors()) : 'Failed to save message.');
            }

            // Handle file uploads
            if (!empty($files['media'])) {
                $mediaModel = new ChatMessageMediaModel();
                foreach ($files['media'] as $file) {
                    if ($file->isValid() && !$file->hasMoved()) {
                        $newName = $file->getRandomName();
                        $uploadPath = FCPATH . 'uploads/chat_media';

                        if (!is_dir($uploadPath)) {
                            mkdir($uploadPath, 0777, true);
                        }

                        $file->move($uploadPath, $newName);

                        $mediaType = strpos($file->getMimeType(), 'image') !== false ? 'image' : 'video';

                        $mediaSaved = $mediaModel->save([
                            'chat_message_id' => $messageId,
                            'media_type'      => $mediaType,
                            'media_url'       => 'uploads/chat_media/' . $newName,
                        ]);

                        if ($mediaSaved === false) {
                            throw new \Exception('Failed to save media file.');
                        }
                    }
                }
            }

            $db->transCommit();

        } catch (\Exception $e) {
            $db->transRollback();
            log_message('error', '[CHAT_SEND_ERROR] ' . $e->getMessage());
            return $this->failServerError('An error occurred while sending the message.');
        }

        // Refetch the message with media
        $newMessage = $messageModel->find($messageId);
        if ($newMessage && !empty($newMessage['created_at'])) {
            try {
                $date = new \DateTime($newMessage['created_at'], new \DateTimeZone('UTC'));
                $newMessage['created_at'] = $date->format(DATE_ATOM);
            } catch (\Exception $e) {
                // Log error or handle invalid date format
            }
        }
        $mediaModel = new ChatMessageMediaModel();
        $newMessage['media'] = $mediaModel->where('chat_message_id', $messageId)->findAll();

        return $this->respondCreated($newMessage);
    }
}
