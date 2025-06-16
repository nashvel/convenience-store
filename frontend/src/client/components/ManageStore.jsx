import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSave, FaStore, FaClock, FaPhone, FaCreditCard } from 'react-icons/fa';

const Container = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const SaveButton = styled.button`
  ${({ theme }) => theme.neumorphism(false, '15px')};
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease-in-out;

  &:hover {
    ${({ theme }) => theme.neumorphismActive(theme.primary, '15px')};
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const Card = styled.div`
  ${({ theme }) => theme.neumorphism(false, '20px')};
  background: ${({ theme }) => theme.body};
  border-radius: 20px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
`;

const Input = styled.input`
  ${({ theme }) => theme.neumorphism(true, '10px')};
  background: ${({ theme }) => theme.body};
  border: none;
  padding: 12px 15px;
  border-radius: 10px;
  color: ${({ theme }) => theme.text};
  width: 100%;
`;

const TimeInputContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const LogoUploader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LogoPreview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  ${({ theme }) => theme.neumorphism(false, '50%')};
`;

const UploadButton = styled.label`
  ${({ theme }) => theme.neumorphism(false, '10px')};
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
`;

const ManageStore = () => {
  const [storeName, setStoreName] = useState('My Awesome Store');
  const [logo, setLogo] = useState('https://via.placeholder.com/150');
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('21:00');
  const [contactNumber, setContactNumber] = useState('123-456-7890');
  const [paymentMethods, setPaymentMethods] = useState('Credit Card, PayPal, Crypto');

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = () => {
    // In a real app, this would save to a backend.
    alert('Store settings saved!');
  };

  return (
    <Container>
      <Header>
        <Title>Manage Store</Title>
        <SaveButton onClick={handleSave}>
          <FaSave />
          Save Changes
        </SaveButton>
      </Header>

      <SettingsGrid>
        <Card>
          <CardHeader><FaStore /> Store Details</CardHeader>
          <FormGroup>
            <Label>Store Name</Label>
            <Input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Store Logo</Label>
            <LogoUploader>
              <LogoPreview src={logo} alt="Store Logo" />
              <UploadButton htmlFor="logo-upload">Change Logo</UploadButton>
              <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
            </LogoUploader>
          </FormGroup>
        </Card>

        <Card>
          <CardHeader><FaClock /> Operating Hours</CardHeader>
          <FormGroup>
            <Label>Opening & Closing Time</Label>
            <TimeInputContainer>
              <Input type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
              <Input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
            </TimeInputContainer>
          </FormGroup>
        </Card>

        <Card>
          <CardHeader><FaPhone /> Contact & Payment</CardHeader>
          <FormGroup>
            <Label>Contact Number</Label>
            <Input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Payment Methods</Label>
            <Input type="text" value={paymentMethods} onChange={(e) => setPaymentMethods(e.target.value)} placeholder="e.g., Visa, Mastercard, PayPal" />
          </FormGroup>
        </Card>
      </SettingsGrid>
    </Container>
  );
};

export default ManageStore;
