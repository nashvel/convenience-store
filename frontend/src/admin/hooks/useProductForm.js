import React, { useState, useEffect, useMemo } from 'react';
import axios from '../../api/axios-config';
import {
  DesktopComputerIcon,
  ShoppingBagIcon,
  HomeIcon,
  BookOpenIcon,
  FireIcon,
  ShoppingCartIcon,
  MusicNoteIcon,
  CameraIcon,
  DeviceMobileIcon,
  UserGroupIcon,
  BriefcaseIcon,
  SparklesIcon,
  CubeIcon,
  BeakerIcon,
  MoonIcon,
  TagIcon
} from '@heroicons/react/outline';

const getCategoryIcon = (categoryName) => {
  const iconClass = `h-5 w-5 mr-3 text-blue-500`;
  if (!categoryName) return <TagIcon className={iconClass} />;
  const name = categoryName.toLowerCase();

  // Electronics
  if (name.includes('computers')) return <DesktopComputerIcon className={iconClass} />;
  if (name.includes('headphones')) return <MusicNoteIcon className={iconClass} />;
  if (name.includes('camera')) return <CameraIcon className={iconClass} />;
  if (name.includes('smartphones') || name.includes('tablets')) return <DeviceMobileIcon className={iconClass} />;
  if (name.includes('electronics')) return <DesktopComputerIcon className={iconClass} />;

  // Fashion
  if (name.includes('wear')) return <UserGroupIcon className={iconClass} />;
  if (name.includes('shoes')) return <SparklesIcon className={iconClass} />;
  if (name.includes('bags')) return <BriefcaseIcon className={iconClass} />;
  if (name.includes('fashion')) return <ShoppingBagIcon className={iconClass} />;

  // Home & Kitchen
  if (name.includes('kitchen')) return <BeakerIcon className={iconClass} />;
  if (name.includes('furniture')) return <CubeIcon className={iconClass} />;
  if (name.includes('decor')) return <SparklesIcon className={iconClass} />;
  if (name.includes('bed & bath')) return <MoonIcon className={iconClass} />;
  if (name.includes('home')) return <HomeIcon className={iconClass} />;

  // Other
  if (name.includes('books')) return <BookOpenIcon className={iconClass} />;
  if (name.includes('sports')) return <FireIcon className={iconClass} />;
  if (name.includes('grocery')) return <ShoppingCartIcon className={iconClass} />;

  return <TagIcon className={iconClass} />;
};

const PRODUCT_ASSET_URL = process.env.REACT_APP_PRODUCT_ASSET_URL || 'http://localhost:8080/uploads/products';

export const useProductForm = (isOpen, product, categories) => {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Effect to fetch full product details when modal opens for a specific product
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (product?.id) {
        setIsFetchingDetails(true);
        try {
          const response = await axios.get(`/products/${product.id}`);
          const fullProduct = response.data;
          setFormData(fullProduct);
          setVariants(fullProduct.variants || []);
          if (fullProduct.image) {
            setImagePreview(`${PRODUCT_ASSET_URL}/${fullProduct.image}`);
          } else {
            setImagePreview(null);
          }
        } catch (error) {
          console.error('Failed to fetch product details', error);
        } finally {
          setIsFetchingDetails(false);
        }
      }
    };

    if (isOpen) {
      fetchProductDetails();
    } else {
      // Reset all state when modal closes
      setFormData({});
      setImagePreview(null);
      setProductImage(null);
      setVariants([]);
      setSelectedCategory(null);
      if (isFetchingDetails) {
          setIsFetchingDetails(false);
      }
    }
  }, [isOpen, product]);

  // Memoize category options and find the initial selected category
  const { categoryOptions, initialCategory } = useMemo(() => {
    if (!categories || categories.length === 0) {
      return { categoryOptions: [], initialCategory: null };
    }

    const options = [];
    const buildOptions = (cats, parentId = null, level = 0) => {
      const children = cats.filter(c => c.parent_id === parentId);
      for (const category of children) {
        options.push({ 
          value: category.id, 
          label: category.name, 
          level: level, 
          icon: getCategoryIcon(category.name) 
        });
        buildOptions(cats, category.id, level + 1);
      }
    };
    buildOptions(categories);

    let foundCategory = null;
    if (product && product.category_id && options.length > 0) {
      foundCategory = options.find(opt => opt.value == product.category_id);
    }
    
    return { categoryOptions: options, initialCategory: foundCategory };
  }, [categories, product]);

  // Effect to set the selected category once it's calculated
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  return {
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    productImage,
    setProductImage,
    variants,
    setVariants,
    isLoading,
    setIsLoading,
    isFetchingDetails,
    selectedCategory,
    setSelectedCategory,
    categoryOptions,
    PRODUCT_ASSET_URL,
  };
};
