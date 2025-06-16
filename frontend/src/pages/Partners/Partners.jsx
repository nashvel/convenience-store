import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const Partners = () => {
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Section>
        <Title>Partnership Program</Title>
        <Subtitle>Join our network of trusted partners and reach a wider audience</Subtitle>
      </Section>

      <PricingSection>
        <PricingCard>
          <PlanTitle>Basic</PlanTitle>
          <Price>₱1,999 / month</Price>
          <Features>
            <Feature><FaCheckCircle /> Basic product listing</Feature>
            <Feature><FaCheckCircle /> 10 product listings</Feature>
            <Feature><FaCheckCircle /> Basic analytics</Feature>
            <Feature><FaCheckCircle /> Basic customer support</Feature>
          </Features>
        </PricingCard>

        <PricingCard featured>
          <PopularTag>Most Popular</PopularTag>
          <PlanTitle>Professional</PlanTitle>
          <Price>₱4,999 / month</Price>
          <Features>
            <Feature><FaCheckCircle /> Unlimited product listings</Feature>
            <Feature><FaCheckCircle /> Advanced analytics</Feature>
            <Feature><FaCheckCircle /> Priority customer support</Feature>
            <Feature><FaCheckCircle /> Custom store branding</Feature>
            <Feature><FaCheckCircle /> Featured store status</Feature>
          </Features>
        </PricingCard>

        <PricingCard>
          <PlanTitle>Enterprise</PlanTitle>
          <Price>₱9,999 / month</Price>
          <Features>
            <Feature><FaCheckCircle /> Everything in Professional</Feature>
            <Feature><FaCheckCircle /> Custom API integration</Feature>
            <Feature><FaCheckCircle /> Dedicated account manager</Feature>
            <Feature><FaCheckCircle /> Advanced marketing tools</Feature>
            <Feature><FaCheckCircle /> White-label solution</Feature>
          </Features>
        </PricingCard>
      </PricingSection>

      <ContactSection>
        <Title>Request Partnership</Title>
        <Subtitle>Interested in joining our partnership program? Fill out the form below to get started.</Subtitle>
        <ContactForm>
          <FormGrid>
            <InputWrapper>
              <Label>Business Name</Label>
              <Input type="text" placeholder="Your business name" />
            </InputWrapper>
            <InputWrapper>
              <Label>Contact Person</Label>
              <Input type="text" placeholder="Your name" />
            </InputWrapper>
            <InputWrapper>
              <Label>Email Address</Label>
              <Input type="email" placeholder="your@email.com" />
            </InputWrapper>
            <InputWrapper>
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="(000) 000-0000" />
            </InputWrapper>
            <InputWrapper>
              <Label>Preferred Plan</Label>
              <Select>
                <option value="">Select a plan</option>
                <option value="basic">Basic</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </Select>
            </InputWrapper>
            <InputWrapper>
              <Label>Message</Label>
              <Textarea placeholder="Tell us about your business and why you want to partner with us..." />
            </InputWrapper>
            <ButtonWrapper>
              <SubmitButton type="submit">Send Request</SubmitButton>
            </ButtonWrapper>
          </FormGrid>
        </ContactForm>
      </ContactSection>
    </PageContainer>
  );
};

const PageContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
`;

const Section = styled.section`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 15px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 800px;
  margin: 0 auto;
`;

const PricingSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const PricingCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: ${({ theme }) => theme.cardShadow};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }

  ${props => props.featured && `
    border: 2px solid ${({ theme }) => theme.primary};
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  `}
`;

const PopularTag = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const PlanTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
`;

const Price = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 30px;
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ContactSection = styled.section`
  background: ${({ theme }) => theme.cardBg};
  padding: 60px 20px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const ContactForm = styled.form`
  max-width: 600px;
  margin: 40px auto 0;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  min-height: 150px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ButtonWrapper = styled.div``;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

export default Partners;
