import axios from 'axios';

const BASE_URL = 'http://92.161.62.7';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch professionals with optional parameters
 * @param {Object} params - Query parameters
 * @param {string} [params.person_id] - ID of the specific person to search for
 * @param {string|number} [params.company_query] - Company ID to filter by
 * @param {string} [params.job_query] - Job title to filter by
 * @returns {Promise} - Promise with the response data
 */
export const fetchProfessionals = async (params = {}) => {
  const defaultParams = {
    nb_results: '30',
  };

  // Merge default params with provided params
  const queryParams = { ...defaultParams, ...params };

  try {
    const response = await apiClient.get('/people', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching professionals:', error);
    throw error;
  }
};

/**
 * Fetch experiences for a specific person
 * @param {Object} params - Query parameters
 * @param {string} params.person_id - ID of the person
 * @param {string|number} [params.company_query] - Company ID to filter experiences
 * @returns {Promise} - Promise with the response data
 */
export const fetchExperiences = async (params = {}) => {
  if (!params.person_id) {
    throw new Error('Person ID is required to fetch experiences');
  }

  try {
    const response = await apiClient.get('/experiences', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw error;
  }
};

export default {
  fetchProfessionals,
  fetchExperiences,
}; 