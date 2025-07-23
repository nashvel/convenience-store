import axios from 'axios';

const API_URL = 'https://psgc.gitlab.io/api';

export const getRegions = async () => {
  try {
    const response = await axios.get(`${API_URL}/regions/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};

export const getProvincesByRegion = async (regionCode) => {
  try {
    const response = await axios.get(`${API_URL}/regions/${regionCode}/provinces/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching provinces for region ${regionCode}:`, error);
    return [];
  }
};

export const getCitiesAndMunicipalitiesByProvince = async (provinceCode) => {
  try {
    const response = await axios.get(`${API_URL}/provinces/${provinceCode}/cities-municipalities/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cities and municipalities for province ${provinceCode}:`, error);
    return [];
  }
};

export const getBarangaysByCityOrMunicipality = async (cityOrMunCode) => {
  try {
    const response = await axios.get(`${API_URL}/cities-municipalities/${cityOrMunCode}/barangays/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching barangays for city/municipality ${cityOrMunCode}:`, error);
    return [];
  }
};
