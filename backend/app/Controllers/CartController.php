<?php

namespace App\Controllers;

use App\Models\CartItemModel;
use App\Models\ProductModel;
use CodeIgniter\API\ResponseTrait;

class CartController extends BaseController
{
    use ResponseTrait;

    public function getCart()
    {
        $userId = session()->get('id');
        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to view the cart.');
        }

        $cartItemModel = new CartItemModel();
        
        // Join with products table to get product details
        $cartItems = $cartItemModel
            ->select('cart_items.id as cartItemId, cart_items.quantity, products.id as productId, products.name, products.price, products.image, products.store_id')
            ->join('products', 'products.id = cart_items.product_id')
            ->where('cart_items.user_id', $userId)
            ->findAll();

        return $this->respond(['cart_items' => $cartItems]);
    }

    public function addToCart()
    {
        $userId = session()->get('id');
        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to add items to the cart.');
        }

        $productId = $this->request->getJsonVar('product_id');
        $quantity = $this->request->getJsonVar('quantity') ?? 1;

        if (!$productId) {
            return $this->failValidationErrors('Product ID is required.');
        }

        $cartItemModel = new CartItemModel();
        $existingItem = $cartItemModel->where(['user_id' => $userId, 'product_id' => $productId])->first();

        if ($existingItem) {
            $newQuantity = $existingItem['quantity'] + $quantity;
            $cartItemModel->update($existingItem['id'], ['quantity' => $newQuantity]);
        } else {
            $cartItemModel->save([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity
            ]);
        }

        return $this->respondCreated(['message' => 'Item added to cart successfully.']);
    }

    public function updateCartItem($id)
    {
        $userId = session()->get('id');
        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to update the cart.');
        }

        $quantity = $this->request->getJsonVar('quantity');

        if ($quantity === null || $quantity < 1) {
            return $this->failValidationErrors('A valid quantity is required.');
        }

        $cartItemModel = new CartItemModel();
        $cartItem = $cartItemModel->find($id);

        if (!$cartItem || $cartItem['user_id'] != $userId) {
            return $this->failNotFound('Cart item not found.');
        }

        $cartItemModel->update($id, ['quantity' => $quantity]);

        return $this->respond(['message' => 'Cart item updated successfully.']);
    }

    public function removeCartItem($id)
    {
        $userId = session()->get('id');
        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to remove items from the cart.');
        }

        $cartItemModel = new CartItemModel();
        $cartItem = $cartItemModel->find($id);

        if (!$cartItem || $cartItem['user_id'] != $userId) {
            return $this->failNotFound('Cart item not found.');
        }

        $cartItemModel->delete($id);

        return $this->respondDeleted(['message' => 'Cart item removed successfully.']);
    }
    
    public function clearCart()
    {
        $userId = session()->get('id');
        if (!$userId) {
            return $this->failUnauthorized('You must be logged in to clear the cart.');
        }

        $cartItemModel = new CartItemModel();
        $cartItemModel->where('user_id', $userId)->delete();

        return $this->respondDeleted(['message' => 'Cart cleared successfully.']);
    }
}
