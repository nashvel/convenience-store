import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ForgotPassword = () => {
  return (
    <Container>
      <FormWrapper>
        <Title>Forgot Password</Title>
        <Form>
          <Input type="email" placeholder="Email" />
          <Button type="submit">Reset Password</Button>
        </Form>
        <Links>
          <StyledLink to="/signin">Back to Sign In</StyledLink>
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

export default ForgotPassword;
