import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styled from 'styled-components';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/auth/resend-verification', { email });
      setError('A new verification email has been sent. Please check your inbox.');
      setShowResend(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle admin login directly on the frontend for now
    if (email === 'admin@test.com' && password === 'admin1234') {
      const adminUser = {
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
      };
      login(adminUser); // Update auth context
      navigate('/admin/dashboard'); // Redirect to admin dashboard
      return; // Skip the rest of the function
    }

    setLoading(true);
    setError('');
    setShowResend(false);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true,
      });

            const { token, user } = response.data;
      
      login(user); // Update the user in the context

      // Keep token and user info in local storage for session persistence
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('firstName', user.first_name || '');
        localStorage.setItem('lastName', user.last_name || '');
      }

      switch (user.role) {
        case 'customer':
          navigate('/');
          break;
        case 'client':
          navigate('/seller/dashboard');
          break;
        case 'rider':
          navigate('/rider/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.error === 'not_verified') {
        setError('Email not verified. Resend verification email?');
        setShowResend(true);
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Sign In</Title>
        <Form onSubmit={handleSubmit}>
          <Input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Error>{error}</Error>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          {showResend && (
            <Button 
              type="button" 
              onClick={handleResendVerification} 
              disabled={loading}
              style={{ marginTop: '10px', backgroundColor: '#ffc107' }}
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          )}
        </Form>
        <Links>
          <StyledLink to="/signup">Don't have an account? Sign Up</StyledLink>
          <StyledLink to="/forgot-password">Forgot Password?</StyledLink>
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
  margin-bottom: 10px;
`;



const Links = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  margin-top: 10px;

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

export default SignIn;
