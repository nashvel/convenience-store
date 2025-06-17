import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  const dashboardPath = user ? {
    'admin': '/admin/dashboard',
    'client': '/seller/dashboard',
    'rider': '/rider/dashboard'
  }[user.role] : null;

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to update profile
    console.log('Updating profile:', profileData);
    alert('Profile update functionality not yet implemented.');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to update password
    console.log('Updating password');
    alert('Password update functionality not yet implemented.');
  };

  return (
    <SettingsContainer>
      <Header>
        <Title>Account Settings</Title>
        {dashboardPath && <ManageButton as={Link} to={dashboardPath}>Manage Dashboard</ManageButton>}
      </Header>
      
      <FormsWrapper>
        <FormCard onSubmit={handleProfileSubmit}>
          <FormTitle>Profile Information</FormTitle>
          <Row>
            <InputGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" type="text" value={profileData.firstName} onChange={handleProfileChange} />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" type="text" value={profileData.lastName} onChange={handleProfileChange} />
            </InputGroup>
          </Row>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} disabled />
          </InputGroup>
          <Button type="submit">Save Profile</Button>
        </FormCard>

        <FormCard onSubmit={handlePasswordSubmit}>
          <FormTitle>Change Password</FormTitle>
          <InputGroup>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
          </InputGroup>
          <Button type="submit">Change Password</Button>
        </FormCard>
      </FormsWrapper>
    </SettingsContainer>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ManageButton = styled.button`
  background-color: ${({ theme }) => theme.secondary || theme.primary};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    filter: brightness(1.1);
  }
`;

const SettingsContainer = styled.div`
  padding: 2rem;
  max-width: 1100px;
  margin: 2rem auto;
  background-color: ${({ theme }) => theme.body};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0; /* Adjusted */
  text-align: left; /* Adjusted */
`;

const FormsWrapper = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const FormCard = styled.form`
  flex: 1;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.cardShadow};
  margin-bottom: 0; /* Adjusted */
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 1rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1.5rem;

  & > div {
    flex: 1;
  }

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  
  &:disabled {
    background-color: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem; /* Added margin */

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

export default Settings;
