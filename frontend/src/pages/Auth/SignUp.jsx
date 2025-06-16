import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true,
        credentials: 'include',
        timeout: 10000
      });

      // Handle successful signup
      if (response.data.status === 'success') {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Show success message
        setError('Registration successful! Please log in.');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 1500);
      } else {
        console.error('Signup error:', response);
        setError(response.data?.message || 'An error occurred during signup');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Sign Up</Title>
        <Form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="First Name" 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input 
            type="text" 
            placeholder="Last Name" 
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <Input 
            type="email" 
            placeholder="Email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input 
            type="tel" 
            placeholder="Phone Number" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input 
            type="password" 
            placeholder="Password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input 
            type="password" 
            placeholder="Confirm Password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {error && <Error>{error}</Error>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </Form>
        <Links>
          <StyledLink to="/signin">Already have an account? Sign In</StyledLink>
        </Links>
      </FormWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
  background-color: ${({ theme }) => theme.body};
`;

const FormWrapper = styled.div`
  padding: 40px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;
  font-weight: bold;
`;

const Links = styled.div`
  margin-top: 20px;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Error = styled.div`
  color: #dc3545;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f8d7da;
`;

export default SignUp;
