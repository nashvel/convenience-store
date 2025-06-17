import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import { FaStar, FaShoppingBag, FaArrowRight, FaStore, FaMobileAlt, FaDownload } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard';
import { LOGO_ASSET_URL } from '../../config';
import NashSvg from '../../assets/nash.svg';
import slugify from '../../utils/slugify';

const Home = () => {
  const navigate = useNavigate();
  const { allProducts, stores, loading, error, categories } = useContext(StoreContext);

  const handleGetAppClick = (e) => {
    e.preventDefault();
    const section = document.getElementById('mobileapp');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      navigate('/#mobileapp', { replace: true });
    }
  };

  const featuredProducts = [...allProducts].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 4);

  if (loading) {
    return <LoadingContainer>Loading products...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  return (
    <HomeContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Quick and Easy <GradientText>Shopping</GradientText> at Your Fingertips
          </HeroTitle>
          <HeroSubtitle
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Order your favorite convenience store items with just a few clicks
          </HeroSubtitle>
          <HeroButtons
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <PrimaryButton to={categories.length > 0 ? `/products?category=${categories[0].name}` : '/products'}>
              Shop Now <FaArrowRight />
            </PrimaryButton>
            <SecondaryButton onClick={handleGetAppClick}>
              Get the App <FaDownload />
            </SecondaryButton>
          </HeroButtons>
        </HeroContent>
        <HeroImageContainer
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <HeroImage src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Convenience Store" />
        </HeroImageContainer>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle><FaStar /> Featured Products</SectionTitle>
          <ViewAllLink to="/products">View All</ViewAllLink>
        </SectionHeader>
        <ProductGrid>
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle><FaShoppingBag /> Shop by Category</SectionTitle>
        </SectionHeader>
        <CategoryGrid>
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              to={`/products?category=${category.name}`}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <CategoryIcon className={`fa fa-${category.icon}`} />
              <CategoryName>{category.name}</CategoryName>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Section>

      {stores && stores.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle><FaStore /> Shop by Store</SectionTitle>
            <ViewAllLink to="/stores">View All</ViewAllLink>
          </SectionHeader>
          <StoreGrid>
            {stores.slice(0, 4).map((store) => (
              <StoreCard 
                key={store.id} 
                to={`/stores/${store.id}/${slugify(store.name)}`}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <StoreLogo src={`${LOGO_ASSET_URL}/${store.logo}`} alt={store.name} />
                <StoreName>{store.name}</StoreName>
              </StoreCard>
            ))}
          </StoreGrid>
        </Section>
      )}

      <AppPromoSection id="mobileapp">
        <AppPromoContent>
          <SectionTitle><FaMobileAlt /> Get Our App</SectionTitle>
          <PromoDescription>Shop on the go and get exclusive deals with our mobile app. Download now and enjoy a seamless shopping experience.</PromoDescription>
          <AppBadges>
            <a href="#" target="_blank" rel="noopener noreferrer"><AppBadgeImg src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><AppBadgeImg src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" /></a>
          </AppBadges>
        </AppPromoContent>
        <AppPromoImage src={NashSvg} alt="Mobile App Promo" />
      </AppPromoSection>

      <PromoSection>
        <PromoCard $bgColor="#FFF3E0">
          <PromoContent>
            <PromoTitle>Free Delivery</PromoTitle>
            <PromoDescription>On your first order over ₱15</PromoDescription>
            <PromoButton to="/products">Order Now</PromoButton>
          </PromoContent>
          <PromoImage src="https://images.unsplash.com/photo-1586999768265-24af89630739?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Delivery" />
        </PromoCard>
        
        <PromoCard $bgColor="#E3F2FD">
          <PromoContent>
            <PromoTitle>Weekly Deals</PromoTitle>
            <PromoDescription>Save up to 25% on selected items</PromoDescription>
            <PromoButton to="/products?deals=true">See Deals</PromoButton>
          </PromoContent>
          <PromoImage src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Deals" />
        </PromoCard>
      </PromoSection>
    </HomeContainer>
  );
};

const HomeContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
  
  @media (max-width: 768px) {
    padding: 70px 15px 30px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.primary};
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.error};
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
`;

const HeroContent = styled.div`
  flex: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const GradientText = styled.span`
  background: ${({ theme }) => theme.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const buttonStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
`;

const PrimaryButton = styled(Link)`
  ${buttonStyles}
  background: ${({ theme }) => `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`};
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

const SecondaryButton = styled.button`
  ${buttonStyles}
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border-color: ${({ theme }) => theme.primary};

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-3px);
  }
`;

const HeroImageContainer = styled(motion.div)`
  flex: 1;
  max-width: 500px;
`;

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const ViewAllLink = styled(Link)`
  color: ${({ theme }) => theme.secondary};
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }
`;

const CategoryCard = styled(motion(Link))`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  padding: 20px;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.cardShadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CategoryIcon = styled.i`
  font-size: 2rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 10px;
`;

const CategoryName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const StoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
`;

const StoreCard = styled(motion(Link))`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  padding: 20px;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.cardShadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StoreLogo = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 15px;
`;

const StoreName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const PromoSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const PromoCard = styled.div`
  display: flex;
  background-color: ${props => props.$bgColor};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.cardShadow};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PromoContent = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PromoTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const PromoDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 20px;
`;

const PromoButton = styled(Link)`
  align-self: flex-start;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
  
  @media (max-width: 768px) {
    align-self: center;
  }
`;

const PromoImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 120px;
    order: -1;
  }
`;

const AppPromoSection = styled(Section)`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 40px;
  display: flex;
  align-items: center;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 30px;
  }
`;

const AppPromoContent = styled.div`
  flex: 1;
`;

const AppPromoImage = styled.img`
  width: 250px;
  height: auto;
  border-radius: 12px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 200px;
    margin-top: 20px;
  }
`;

const AppBadges = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const AppBadgeImg = styled.img`
  height: 45px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export default Home;