import React, { useState } from 'react';
import styled from 'styled-components';

const FormCard = styled.div`
  ${({ theme }) => theme.neumorphism(false, '20px')};
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.text};
  text-align: center;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const Input = styled.input`
  ${({ theme }) => theme.neumorphismPressed('15px')};
  border: none;
  outline: none;
  padding: 18px;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const Button = styled.button`
  ${({ theme }) => theme.neumorphism(false, '15px')};
  border: none;
  outline: none;
  padding: 18px;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  &:active, &:disabled {
    ${({ theme }) => theme.neumorphismPressed('15px')};
    color: ${({ theme }) => theme.primary};
  }
`;

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === 'price') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        parsedValue = '';
      }
    }
    setProductData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Product "${productData.name}" added successfully!`);
      setProductData({ name: '', price: '', category: '', image: '' });
    } catch (error) {
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <FormTitle>Add a New Product</FormTitle>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <Input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <Input
          type="text"
          name="category"
          value={productData.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <Input
          type="text"
          name="image"
          value={productData.image}
          onChange={handleChange}
          placeholder="Image URL"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </Form>
    </FormCard>
  );
};

export default AddProduct;
