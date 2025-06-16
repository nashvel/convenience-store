import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal = 0,
    cartCount 
  } = useContext(CartContext);
  const { user } = useAuth();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckout = (e) => {
    e.preventDefault();
    // In a real app, this would process the payment and create an order
    alert('Order placed successfully! Thank you for your purchase.');
    clearCart();
    setIsCheckingOut(false);
  };
  
  if (cartItems.length === 0) {
    return (
      <CartContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageTitle>Your Cart</PageTitle>
        <EmptyCartContainer>
          <EmptyCartIcon>
            <FaShoppingCart />
          </EmptyCartIcon>
          <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
          <EmptyCartSubtext>Looks like you haven't added any products to your cart yet.</EmptyCartSubtext>
          <ShopNowButton to="/products">Continue Shopping</ShopNowButton>
        </EmptyCartContainer>
      </CartContainer>
    );
  }
  
  return (
    <CartContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageTitle>Your Cart</PageTitle>
      <BackLink to="/products">
        <FaArrowLeft /> Continue Shopping
      </BackLink>
      
      {!isCheckingOut ? (
        <CartContent>
          <CartItemsSection>
            <CartHeader>
              <HeaderItem $flex="3">Product</HeaderItem>
              <HeaderItem $flex="1">Price</HeaderItem>
              <HeaderItem $flex="1">Quantity</HeaderItem>
              <HeaderItem $flex="1">Total</HeaderItem>
              <HeaderItem $flex="0.5"></HeaderItem>
            </CartHeader>
            
            {cartItems.map(item => {
              const { price = 0, discount = 0, quantity = 1 } = item;
              const itemTotal = price * (1 - discount / 100) * quantity;
              
              return (
                <CartItemRow key={item.id}>
                  <CartItemInfo $flex="3">
                    <CartItemImage src={item.image} alt={item.name} />
                    <CartItemDetails>
                      <CartItemName to={`/products/${item.id}`}>{item.name}</CartItemName>
                      {item.discount > 0 && (
                        <DiscountBadge>{item.discount}% OFF</DiscountBadge>
                      )}
                    </CartItemDetails>
                  </CartItemInfo>
                  
                  <CartItemPrice $flex="1">
                    ₱{(price * (1 - discount / 100)).toFixed(2)}
                    {discount > 0 && (
                      <OriginalPrice>₱{price.toFixed(2)}</OriginalPrice>
                    )}
                  </CartItemPrice>
                  
                  <CartItemQuantity $flex="1">
                    <QuantityControl>
                      <QuantityButton 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </QuantityButton>
                      <QuantityValue>{item.quantity}</QuantityValue>
                      <QuantityButton 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </QuantityButton>
                    </QuantityControl>
                  </CartItemQuantity>
                  
                  <CartItemTotal $flex="1">
                    ₱{itemTotal.toFixed(2)}
                  </CartItemTotal>
                  
                  <CartItemRemove $flex="0.5">
                    <RemoveButton onClick={() => removeFromCart(item.id)}>
                      <FaTrash />
                    </RemoveButton>
                  </CartItemRemove>
                </CartItemRow>
              );
            })}
            
            <CartActions>
              <ClearCartButton onClick={clearCart}>Clear Cart</ClearCartButton>
            </CartActions>
          </CartItemsSection>
          
          <CartSummarySection>
            <SummaryCard>
              <SummaryTitle>Order Summary</SummaryTitle>
              
              <SummaryRow>
                <SummaryLabel>Items ({cartCount}):</SummaryLabel>
                <SummaryValue>₱{(cartTotal || 0).toFixed(2)}</SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Shipping:</SummaryLabel>
                <SummaryValue>Free</SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Tax:</SummaryLabel>
                <SummaryValue>₱{(cartTotal * 0.1).toFixed(2)}</SummaryValue>
              </SummaryRow>
              
              <Divider />
              
              <SummaryRow $total>
                <SummaryLabel>Total:</SummaryLabel>
                <SummaryValue>₱{(cartTotal * 1.1).toFixed(2)}</SummaryValue>
              </SummaryRow>
              
              {user ? (
                <CheckoutButton onClick={() => setIsCheckingOut(true)}>
                  <FaCreditCard /> Proceed to Checkout
                </CheckoutButton>
              ) : (
                <LoginPrompt>
                  Please <Link to="/signin">log in</Link> to proceed to checkout.
                </LoginPrompt>
              )}
            </SummaryCard>
          </CartSummarySection>
        </CartContent>
      ) : (
        <CheckoutContainer>
          <CheckoutForm onSubmit={handleCheckout}>
            <FormSection>
              <SectionTitle>Shipping Information</SectionTitle>
              <FormRow>
                <FormGroup>
                  <FormLabel>Full Name</FormLabel>
                  <FormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <FormInput 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>Address</FormLabel>
                  <FormInput 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    required 
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup $half>
                  <FormLabel>City</FormLabel>
                  <FormInput 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    required 
                  />
                </FormGroup>
                <FormGroup $half>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormInput 
                    type="text" 
                    name="zipCode" 
                    value={formData.zipCode} 
                    onChange={handleInputChange} 
                    required 
                  />
                </FormGroup>
              </FormRow>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Payment Information</SectionTitle>
              <FormRow>
                <FormGroup>
                  <FormLabel>Card Number</FormLabel>
                  <FormInput 
                    type="text" 
                    name="cardNumber" 
                    value={formData.cardNumber} 
                    onChange={handleInputChange} 
                    placeholder="1234 5678 9012 3456" 
                    required 
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup $half>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormInput 
                    type="text" 
                    name="cardExpiry" 
                    value={formData.cardExpiry} 
                    onChange={handleInputChange} 
                    placeholder="MM/YY" 
                    required 
                  />
                </FormGroup>
                <FormGroup $half>
                  <FormLabel>CVV</FormLabel>
                  <FormInput 
                    type="text" 
                    name="cardCvv" 
                    value={formData.cardCvv} 
                    onChange={handleInputChange} 
                    placeholder="123" 
                    required 
                  />
                </FormGroup>
              </FormRow>
            </FormSection>
            
            <OrderSummary>
              <SummaryTitle>Order Summary</SummaryTitle>
              <SummaryItems>
                {cartItems.map(item => (
                  <SummaryItem key={item.id}>
                    <SummaryItemName>{item.name} × {item.quantity}</SummaryItemName>
                    <SummaryItemPrice>
                      ₱{(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}
                    </SummaryItemPrice>
                  </SummaryItem>
                ))}
              </SummaryItems>
              
              <Divider />
              
              <SummaryRow>
                <SummaryLabel>Subtotal:</SummaryLabel>
                <SummaryValue>${cartTotal.toFixed(2)}</SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Tax (10%):</SummaryLabel>
                <SummaryValue>${(cartTotal * 0.1).toFixed(2)}</SummaryValue>
              </SummaryRow>
              
              <SummaryRow $total>
                <SummaryLabel>Total:</SummaryLabel>
                <SummaryValue>₱{(cartTotal * 1.1).toFixed(2)}</SummaryValue>
              </SummaryRow>
            </OrderSummary>
            
            <FormActions>
              <BackButton type="button" onClick={() => setIsCheckingOut(false)}>
                Back to Cart
              </BackButton>
              <PlaceOrderButton type="submit">
                Place Order
              </PlaceOrderButton>
            </FormActions>
          </CheckoutForm>
        </CheckoutContainer>
      )}
    </CartContainer>
  );
};

const CartContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
  
  @media (max-width: 768px) {
    padding: 70px 15px 30px;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 30px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsSection = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  overflow: hidden;
`;

const CartHeader = styled.div`
  display: flex;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.background};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 576px) {
    display: none;
  }
`;

const HeaderItem = styled.div`
  flex: ${props => props.$flex};
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
`;

const CartItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`;

const CartItemInfo = styled.div`
  flex: ${props => props.$flex};
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 576px) {
    flex: 1 0 100%;
    margin-bottom: 15px;
  }
`;

const CartItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const CartItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const CartItemName = styled(Link)`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const DiscountBadge = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => theme.accent};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const CartItemPrice = styled.div`
  flex: ${props => props.$flex};
  display: flex;
  flex-direction: column;
  
  @media (max-width: 576px) {
    flex: 1;
  }
`;

const OriginalPrice = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
  text-decoration: line-through;
`;

const CartItemQuantity = styled.div`
  flex: ${props => props.$flex};
  
  @media (max-width: 576px) {
    flex: 1;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.cardBg};
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.border};
  }
  
  &:disabled {
    color: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid ${({ theme }) => theme.border};
  border-right: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
`;

const CartItemTotal = styled.div`
  flex: ${props => props.$flex};
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  
  @media (max-width: 576px) {
    flex: 1;
  }
`;

const CartItemRemove = styled.div`
  flex: ${props => props.$flex};
  display: flex;
  justify-content: center;
  
  @media (max-width: 576px) {
    flex: 0;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.error};
  }
`;

const CartActions = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 20px;
`;

const ClearCartButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textSecondary};
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
  }
`;

const CartSummarySection = styled.div`
  align-self: start;
  
  @media (max-width: 768px) {
    grid-row: 1;
  }
`;

const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 25px;
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const SummaryTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: ${props => props.$total ? '1.2rem' : '1rem'};
  font-weight: ${props => props.$total ? '600' : '400'};
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
`;

const SummaryValue = styled.span`
  color: ${({ theme }) => theme.text};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
  margin: 15px 0;
`;

const CheckoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-weight: 600;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  text-align: center;
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.border};
  margin-bottom: 20px;
`;

const EmptyCartMessage = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const EmptyCartSubtext = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 30px;
  max-width: 400px;
`;

const ShopNowButton = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const CheckoutContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  padding: 30px;
`;

const CheckoutForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: ${props => props.$half ? '1' : '1 0 100%'};
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const FormInput = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const OrderSummary = styled.div`
  grid-column: span 2;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 20px;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const SummaryItems = styled.div`
  margin-bottom: 15px;
  max-height: 200px;
  overflow-y: auto;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SummaryItemName = styled.span`
  color: ${({ theme }) => theme.text};
`;

const SummaryItemPrice = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const FormActions = styled.div`
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.border};
  }
`;

const PlaceOrderButton = styled.button`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 20px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;

  a {
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Cart;