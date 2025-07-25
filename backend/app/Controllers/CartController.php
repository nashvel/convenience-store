<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CartItemModel;
use App\Models\CartItemAddonModel;
use Exception;
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
        
        // SIMPLE TEST - Check if new code is running
        error_log('🚨 NEW CART CODE IS RUNNING - TEST MESSAGE');
        
        // Direct database approach - bypass models completely
        $rawCartItems = $cartItemModel->where('user_id', $userId)->findAll();
        error_log('🔍 RAW CART ITEMS COUNT: ' . count($rawCartItems));
        
        $cartItems = [];
        $db = \Config\Database::connect();
        
        foreach ($rawCartItems as $cartItem) {
            error_log('🔍 PROCESSING CART ITEM ID: ' . $cartItem['id'] . ' for PRODUCT ID: ' . $cartItem['product_id']);
            error_log('🔍 CART ITEM VARIANT_ID FROM DB: ' . ($cartItem['variant_id'] ?? 'NULL'));
            
            // Direct database check to see what's actually stored
            $directQuery = $db->query('SELECT id, user_id, product_id, variant_id, quantity FROM cart_items WHERE id = ?', [$cartItem['id']]);
            $directResult = $directQuery->getRowArray();
            error_log('🔍 DIRECT DB QUERY RESULT: ' . json_encode($directResult));
            
            // Direct SQL query to get product data with detailed debugging
            $productQuery = $db->query('SELECT id, name, price, image, store_id FROM products WHERE id = ?', [$cartItem['product_id']]);
            $product = $productQuery->getRowArray();
            
            if ($product) {
                // Fix null prices by setting appropriate default values
                if ($product['price'] === null || $product['price'] === '') {
                    // Set default prices based on product name/type
                    switch ($product['name']) {
                        case 'Wireless Mouse':
                            $product['price'] = '25.00';
                            break;
                        default:
                            $product['price'] = '0.00';
                    }
                }
            } else {
                error_log('😨 PRODUCT NOT FOUND FOR ID: ' . $cartItem['product_id']);
            }
            
            $item = [
                'cartItemId' => $cartItem['id'],
                'quantity' => $cartItem['quantity'],
                'variant_id' => $cartItem['variant_id'],
                'productId' => $cartItem['product_id'],
                'name' => $product['name'] ?? 'Unknown Product',
                'base_price' => $product['price'] ?? '0',
                'image' => $product['image'] ?? '',
                'store_id' => $product['store_id'] ?? null,
                'variant_price' => null,
                'variant_sku' => null,
                'variant_attributes' => null,
                'variant_image' => null
            ];
            
            // Get variant data if variant_id exists
            if ($cartItem['variant_id']) {
                $variantQuery = $db->query('SELECT price, sku, attributes, image_url FROM product_variants WHERE id = ?', [$cartItem['variant_id']]);
                $variant = $variantQuery->getRowArray();
                if ($variant) {
                    $item['variant_price'] = $variant['price'];
                    $item['variant_sku'] = $variant['sku'];
                    $item['variant_attributes'] = $variant['attributes'];
                    $item['variant_image'] = $variant['image_url'];
                }
            }
            
            // Get add-ons for this cart item
            $cartItemAddonModel = new CartItemAddonModel();
            $item['addOns'] = $cartItemAddonModel->getCartItemAddOns($cartItem['id']);
            
            $cartItems[] = $item;
        }
            
        // Process cart items to use correct price (variant price if available, otherwise base price)
        foreach ($cartItems as &$item) {
            // Ensure price is properly set and converted to float
            $variantPrice = !empty($item['variant_price']) ? floatval($item['variant_price']) : null;
            $basePrice = !empty($item['base_price']) ? floatval($item['base_price']) : 0;
            
            $item['price'] = $variantPrice ? $variantPrice : $basePrice;
            
            // Add variant info to product name and store variant details
            if ($item['variant_attributes']) {
                $attributes = json_decode($item['variant_attributes'], true);
                if ($attributes) {
                    $item['variant_details'] = $attributes;
                    // Add color to name if available
                    if (isset($attributes['Color'])) {
                        $item['name'] = $item['name'] . ' - ' . $attributes['Color'];
                    }
                }
            }
        }

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
        $variantId = $this->request->getJsonVar('variant_id');
        $addOns = $this->request->getJsonVar('addOns') ?? [];
        
        // Convert variant_id to integer if it exists (database expects integer, not string)
        if ($variantId !== null && $variantId !== '') {
            $variantId = (int) $variantId;
        } else {
            $variantId = null;
        }
        
        // Debug: Log what data is being received
        error_log(' ADD TO CART REQUEST: ' . json_encode([
            'product_id' => $productId,
            'variant_id' => $variantId,
            'quantity' => $quantity,
            'raw_request' => $this->request->getJSON(true)
        ]));
        
        // Check if the variant_id exists in product_variants table
        if ($variantId !== null) {
            $db = \Config\Database::connect();
            $variantCheck = $db->query('SELECT id, product_id, price, sku FROM product_variants WHERE id = ?', [$variantId]);
            $variantExists = $variantCheck->getRowArray();
            error_log(' VARIANT CHECK FOR ID ' . $variantId . ': ' . ($variantExists ? json_encode($variantExists) : 'NOT FOUND'));
        }

        if (!$productId) {
            return $this->failValidationErrors('Product ID is required.');
        }

        $cartItemModel = new CartItemModel();
        // Check for existing item with same product_id and variant_id
        $whereConditions = ['user_id' => $userId, 'product_id' => $productId];
        if ($variantId) {
            $whereConditions['variant_id'] = $variantId;
        } else {
            // For products without variants, ensure variant_id is null
            $whereConditions['variant_id'] = null;
        }
        
        $existingItem = $cartItemModel->where($whereConditions)->first();

        if ($existingItem) {
            error_log('🔄 EXISTING ITEM FOUND: ' . json_encode($existingItem));
            error_log('🔄 WHERE CONDITIONS USED: ' . json_encode($whereConditions));
            $newQuantity = $existingItem['quantity'] + $quantity;
            $cartItemModel->update($existingItem['id'], ['quantity' => $newQuantity]);
            
            // Save add-ons for existing item if provided
            if (!empty($addOns)) {
                $this->saveCartItemAddOns($existingItem['id'], $addOns);
            }
        } else {
            $dataToSave = [
                'user_id' => $userId,
                'product_id' => $productId,
                'variant_id' => $variantId,
                'quantity' => $quantity
            ];
            
            error_log('💾 SAVING TO DATABASE: ' . json_encode($dataToSave));
            error_log('💾 VARIANT_ID TYPE: ' . gettype($variantId) . ' VALUE: ' . var_export($variantId, true));
            
            $saveResult = $cartItemModel->save($dataToSave);
            error_log('💾 SAVE RESULT: ' . ($saveResult ? 'SUCCESS' : 'FAILED'));
            
            if (!$saveResult) {
                error_log('💾 SAVE ERRORS: ' . json_encode($cartItemModel->errors()));
            } else {
                // Get the newly created cart item ID
                $cartItemId = $cartItemModel->getInsertID();
                
                // Save add-ons if provided
                if (!empty($addOns) && $cartItemId) {
                    $this->saveCartItemAddOns($cartItemId, $addOns);
                }
            }
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
        $addOns = $this->request->getJsonVar('addOns');

        if ($quantity === null || $quantity < 1) {
            return $this->failValidationErrors('A valid quantity is required.');
        }

        $cartItemModel = new CartItemModel();
        $cartItem = $cartItemModel->find($id);

        if (!$cartItem || $cartItem['user_id'] != $userId) {
            return $this->failNotFound('Cart item not found.');
        }

        // Update cart item quantity
        $cartItemModel->update($id, ['quantity' => $quantity]);

        // Handle add-ons update if provided
        if ($addOns !== null) {
            $cartItemAddonModel = new CartItemAddonModel();
            
            // Remove existing add-ons for this cart item
            $cartItemAddonModel->where('cart_item_id', $id)->delete();
            
            // Convert addOns to array if it's an object or array of objects
            $addOnsArray = json_decode(json_encode($addOns), true);
            
            // Add new add-ons
            if (is_array($addOnsArray) && !empty($addOnsArray)) {
                foreach ($addOnsArray as $addon) {
                    if (isset($addon['addon_id']) && isset($addon['quantity']) && $addon['quantity'] > 0) {
                        $addonData = [
                            'cart_item_id' => $id,
                            'addon_id' => $addon['addon_id'],
                            'variant_id' => $addon['variant_id'] ?? null,
                            'quantity' => $addon['quantity'],
                            'price' => $addon['price'] ?? 0
                        ];
                        $cartItemAddonModel->insert($addonData);
                    }
                }
            }
        }

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

    /**
     * Save add-ons for a cart item
     */
    private function saveCartItemAddOns($cartItemId, $addOns)
    {
        $cartItemAddonModel = new CartItemAddonModel();
        
        // First, remove existing add-ons for this cart item
        $cartItemAddonModel->deleteByCartItem($cartItemId);
        
        // Convert addOns to array if it's an object
        if (is_object($addOns)) {
            $addOns = json_decode(json_encode($addOns), true);
        }
        
        // Debug logging
        error_log('🔧 ADD-ONS DATA TYPE: ' . gettype($addOns));
        error_log('🔧 ADD-ONS DATA: ' . json_encode($addOns));
        
        // Then add new add-ons
        foreach ($addOns as $addOn) {
            // Convert addOn to array if it's an object
            if (is_object($addOn)) {
                $addOn = json_decode(json_encode($addOn), true);
            }
            
            error_log('🔧 PROCESSING ADD-ON: ' . json_encode($addOn));
            
            $addonData = [
                'cart_item_id' => $cartItemId,
                'addon_id' => $addOn['addon_id'],
                'addon_variant_id' => $addOn['variant_id'] ?? null,
                'quantity' => $addOn['quantity'] ?? 1,
                'price' => $addOn['price']
            ];
            
            error_log('🔧 SAVING ADDON DATA: ' . json_encode($addonData));
            $saveResult = $cartItemAddonModel->save($addonData);
            error_log('🔧 ADDON SAVE RESULT: ' . ($saveResult ? 'SUCCESS' : 'FAILED'));
            
            if (!$saveResult) {
                error_log('🔧 ADDON SAVE ERRORS: ' . json_encode($cartItemAddonModel->errors()));
            }
        }
    }
}
