import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

const useAddressModal = (initialAddress, isOpen, onSave) => {
  const [address, setAddress] = useState({});
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMap, setShowMap] = useState(false); // This will be repurposed for the MapModal
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState([14.5995, 120.9842]); // Default to Manila
  const [selectedPosition, setSelectedPosition] = useState(null);
  const searchTimeoutRef = useRef(null);
  
  // Address selection states
  const [addressSelectionMethod, setAddressSelectionMethod] = useState(''); // 'select' or 'map'
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [selectedAddressData, setSelectedAddressData] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    const initialAddr = initialAddress || {
      full_name: '',
      region: '',
      province: '',
      city: '',
      barangay: '',
      phone: '',
      type: 'home',
      latitude: null,
      longitude: null,
    };
    setAddress(initialAddr);
    
    if (initialAddr.region && initialAddr.province && initialAddr.city && initialAddr.barangay) {
      setSelectedAddressData({
        region: initialAddr.region,
        province: initialAddr.province,
        city: initialAddr.city,
        barangay: initialAddr.barangay,
        fullAddress: `${initialAddr.barangay}, ${initialAddr.city}, ${initialAddr.province}, ${initialAddr.region}`
      });
      setAddressSelectionMethod('select');
    }
    
    if (initialAddr.latitude && initialAddr.longitude) {
      setMapCenter([initialAddr.latitude, initialAddr.longitude]);
      setSelectedPosition([initialAddr.latitude, initialAddr.longitude]);
      if (!initialAddr.region) {
        setAddressSelectionMethod('map');
      }
    }
  }, [initialAddress, isOpen]);
  
  const handleAddressMethodSelect = (method) => {
    setAddressSelectionMethod(method);
    if (method === 'select') {
      setShowAddressSelector(true);
    } else if (method === 'map') {
      setShowMapModal(true);
    }
  };
  
  const handleAddressSelectorSave = (addressData) => {
    setSelectedAddressData(addressData);
    setAddress(prev => ({
      ...prev,
      region: addressData.region,
      province: addressData.province,
      city: addressData.city,
      barangay: addressData.barangay
    }));
    setAddressSelectionMethod('select');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await reverseGeocode(latitude, longitude);
        setMapCenter([latitude, longitude]);
        setSelectedPosition([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        toast.error('Unable to retrieve your location.');
        setIsLocating(false);
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.address) {
        setAddress(prev => ({
          ...prev,
          province: data.address.state || data.address.county || '',
          city: data.address.city || data.address.town || '',
          latitude: lat,
          longitude: lng,
        }));

      } else {
        toast.error('Could not determine address from location.');
      }
    } catch (error) {
      toast.error('Failed to fetch address details.');
    }
  };

  const handleMapLocationSelect = async (lat, lng) => {
    setSelectedPosition([lat, lng]);
    setMapCenter([lat, lng]);
    await reverseGeocode(lat, lng);
  };

  const handleAddressSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      toast.error('Failed to search address.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setMapCenter([lat, lng]);
    setSelectedPosition([lat, lng]);
    setSearchQuery(result.display_name);
    setSearchResults([]);

    // Update address fields from the selected suggestion
    reverseGeocode(lat, lng);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleAddressSearch(query);
      }, 1000);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (addressSelectionMethod === 'select' && (!address.full_name || !selectedAddressData || !address.phone)) {
      toast.error('Please fill in all required fields and select an address.');
      return;
    } else if (addressSelectionMethod === 'map' && (!address.full_name || !address.latitude || !address.longitude || !address.phone)) {
      toast.error('Please fill in all required fields and confirm a location on the map.');
      return;
    } else if (!addressSelectionMethod) {
      toast.error('Please select an address method.');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(address);
      toast.success('Address saved successfully!');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    address,
    isLocating,
    isSaving,
    showMap, // Keep for now, might be useful for passing to map modal
    searchQuery,
    isSearching,
    mapCenter,
    selectedPosition,
    addressSelectionMethod,
    showAddressSelector,
    selectedAddressData,
    showMapModal,
    setShowAddressSelector,
    setShowMapModal,
    handleAddressMethodSelect,
    handleAddressSelectorSave,
    handleChange,
    handleLocateMe,
    handleMapLocationSelect,
    handleSearchInputChange,
    handleSuggestionClick,
    searchResults,
    handleSave,
    handleMapSave: () => {
      if (!selectedPosition) {
        toast.error('Please select a location on the map first.');
        return;
      }
      setAddressSelectionMethod('map');
      setSelectedAddressData(null); // Clear selected address if map is used
      setShowMapModal(false);

    },
  };
};

export default useAddressModal;
