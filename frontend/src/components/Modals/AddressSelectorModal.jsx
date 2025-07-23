import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getRegions,
  getProvincesByRegion,
  getCitiesAndMunicipalitiesByProvince,
  getBarangaysByCityOrMunicipality,
} from '../../services/psgcService';

const AddressSelectorModal = ({ isOpen, onClose, onSave, initialAddress }) => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        setIsLoadingRegions(true);
        const regionsData = await getRegions();
        setRegions(regionsData);
        setIsLoadingRegions(false);

        if (initialAddress?.region) {
          const initialRegion = regionsData.find(r => r.name === initialAddress.region);
          if (initialRegion) {
            setSelectedRegion(initialRegion);
          }
        }
      };
      fetchInitialData();
    }
  }, [isOpen, initialAddress]);

  useEffect(() => {
    if (selectedRegion?.code) {
      const fetchProvinces = async () => {
        setIsLoadingProvinces(true);
        setProvinces([]);
        setCities([]);
        setBarangays([]);
        const provincesData = await getProvincesByRegion(selectedRegion.code);
        setProvinces(provincesData);
        setIsLoadingProvinces(false);

        if (initialAddress?.province) {
            const initialProvince = provincesData.find(p => p.name === initialAddress.province);
            if (initialProvince) {
                setSelectedProvince(initialProvince);
            }
        }
      };
      fetchProvinces();
    }
  }, [selectedRegion, initialAddress]);

  useEffect(() => {
    if (selectedProvince?.code) {
      const fetchCities = async () => {
        setIsLoadingCities(true);
        setCities([]);
        setBarangays([]);
        const citiesData = await getCitiesAndMunicipalitiesByProvince(selectedProvince.code);
        setCities(citiesData);
        setIsLoadingCities(false);

        if (initialAddress?.city) {
            const initialCity = citiesData.find(c => c.name === initialAddress.city);
            if (initialCity) {
                setSelectedCity(initialCity);
            }
        }
      };
      fetchCities();
    }
  }, [selectedProvince, initialAddress]);

  useEffect(() => {
    if (selectedCity?.code) {
      const fetchBarangays = async () => {
        setIsLoadingBarangays(true);
        setBarangays([]);
        const barangaysData = await getBarangaysByCityOrMunicipality(selectedCity.code);
        setBarangays(barangaysData);
        setIsLoadingBarangays(false);

        if (initialAddress?.barangay) {
            const initialBarangay = barangaysData.find(b => b.name === initialAddress.barangay);
            if (initialBarangay) {
                setSelectedBarangay(initialBarangay);
            }
        }
      };
      fetchBarangays();
    }
  }, [selectedCity, initialAddress]);

  const handleRegionChange = (regionCode) => {
    const region = regions.find(r => r.code === regionCode);
    setSelectedRegion(region);
    setSelectedProvince(null);
    setSelectedCity(null);
    setSelectedBarangay(null);
    setProvinces([]);
    setCities([]);
    setBarangays([]);
  };

  const handleProvinceChange = (provinceCode) => {
    const province = provinces.find(p => p.code === provinceCode);
    setSelectedProvince(province);
    setSelectedCity(null);
    setSelectedBarangay(null);
    setCities([]);
    setBarangays([]);
  };

  const handleCityChange = (cityCode) => {
    const city = cities.find(c => c.code === cityCode);
    setSelectedCity(city);
    setSelectedBarangay(null);
    setBarangays([]);
  };

  const handleBarangayChange = (barangayCode) => {
    const barangay = barangays.find(b => b.code === barangayCode);
    setSelectedBarangay(barangay);
  };

  const handleSave = () => {
    if (!selectedRegion || !selectedProvince || !selectedCity || !selectedBarangay) {
      toast.error('Please select all address fields.');
      return;
    }

    const addressData = {
      region: selectedRegion.name,
      province: selectedProvince.name,
      city: selectedCity.name,
      barangay: selectedBarangay.name,
      fullAddress: `${selectedBarangay.name}, ${selectedCity.name}, ${selectedProvince.name}, ${selectedRegion.name}`
    };

    onSave(addressData);
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: '-50%', opacity: 0 },
    visible: { y: '0', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { y: '50%', opacity: 0 },
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaMapMarkerAlt />
                  Select Address
                </h2>
                <button 
                  onClick={onClose} 
                  className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Region Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
                  <select
                    value={selectedRegion?.code || ''}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    disabled={isLoadingRegions}
                  >
                    <option value="">{isLoadingRegions ? 'Loading...' : 'Select Region'}</option>
                    {regions.map(region => (
                      <option key={region.code} value={region.code}>{region.name}</option>
                    ))}
                  </select>
                </div>

                {/* Province Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                  <select
                    value={selectedProvince?.code || ''}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={!selectedRegion || isLoadingProvinces}
                    required
                  >
                    <option value="">{isLoadingProvinces ? 'Loading...' : 'Select Province'}</option>
                    {provinces.map(province => (
                      <option key={province.code} value={province.code}>{province.name}</option>
                    ))}
                  </select>
                </div>

                {/* City Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <select
                    value={selectedCity?.code || ''}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={!selectedProvince || isLoadingCities}
                    required
                  >
                    <option value="">{isLoadingCities ? 'Loading...' : 'Select City/Municipality'}</option>
                    {cities.map(city => (
                      <option key={city.code} value={city.code}>{city.name}</option>
                    ))}
                  </select>
                </div>

                {/* Barangay Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barangay *</label>
                  <select
                    value={selectedBarangay?.code || ''}
                    onChange={(e) => handleBarangayChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={!selectedCity || isLoadingBarangays}
                    required
                  >
                    <option value="">{isLoadingBarangays ? 'Loading...' : 'Select Barangay'}</option>
                    {barangays.map(barangay => (
                      <option key={barangay.code} value={barangay.code}>{barangay.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview */}
              {selectedRegion && selectedProvince && selectedCity && selectedBarangay && !isLoadingBarangays && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Selected Address:</h4>
                  <p className="text-sm text-blue-700">
                    {selectedBarangay.name}, {selectedCity.name}, {selectedProvince.name}, {selectedRegion.name}
                  </p>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedRegion || !selectedProvince || !selectedCity || !selectedBarangay || isLoadingRegions || isLoadingProvinces || isLoadingCities || isLoadingBarangays}
                >
                  Save Address
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AddressSelectorModal;
