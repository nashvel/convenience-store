import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleClientLogin = () => {
    setEmail('client@store.com');
    setPassword('clientpassword');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'client@store.com' && password === 'clientpassword') {
      navigate('/client-dashboard');
    } else {
      alert('Invalid credentials');
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
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Sign In</Button>
        </Form>
        <Links>
          <StyledLink to="/signup">Don't have an account? Sign Up</StyledLink>
          <StyledLink to="/forgot-password">Forgot Password?</StyledLink>
        </Links>
        <ClientButton onClick={handleClientLogin}>Log in as Client</ClientButton>
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

const ClientButton = styled(Button)`
  background-color: ${({ theme }) => theme.secondary};
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

export default SignIn;
