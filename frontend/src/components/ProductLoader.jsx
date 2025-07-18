import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { fetchAllProducts } from '../api/productApi';

const ProductLoader = () => {
  const { setAllProducts, setPagination, setLoading, setError } = useContext(StoreContext);
  const location = useLocation();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const response = await fetchAllProducts(params);
        if (response.data && response.data.products) {
          setAllProducts(response.data.products);
          setPagination(response.data.pager);
        } else {
          // Handle non-paginated or empty responses gracefully
          setAllProducts(response.data || []);
          setPagination(null);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname.startsWith('/products')) {
        loadProducts();
    }
  }, [location.search, location.pathname, setAllProducts, setPagination, setLoading, setError]);

  return null; // This component does not render anything
};

export default ProductLoader;
