import { useState, useEffect, useCallback } from 'react';
import { fetchProfessionals } from '../services/api';

/**
 * Custom hook to fetch and manage professionals data with infinite scrolling
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} - Object containing professionals data, loading state, error state and fetch functions
 */
const useProfessionals = (initialParams = {}) => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  // Fixed number of results per page
  const RESULTS_PER_PAGE = 30;

  // Keep track of the loaded professionals' IDs to avoid duplicates
  const [loadedIds, setLoadedIds] = useState(new Set());

  // Load initial data
  const loadProfessionals = useCallback(async (queryParams = {}, resetData = true) => {
    try {
      setLoading(true);
      setError(null);

      // Update params state if new params provided
      const newParams = Object.keys(queryParams).length > 0 ? queryParams : params;

      if (Object.keys(queryParams).length > 0) {
        setParams(queryParams);
      }

      // Reset page, professionals, and loadedIds if requested
      if (resetData) {
        setPage(1);
        setProfessionals([]);
        setLoadedIds(new Set());

        // Add the fixed results per page to the query
        const requestParams = {
          ...newParams,
          nb_results: String(RESULTS_PER_PAGE)
        };

        const data = await fetchProfessionals(requestParams);

        // Handle the case when a direct person_id lookup returns a single object instead of an array
        if (data && data.data && !Array.isArray(data.data) && data.data.data_member_id) {
          // Convert single object to array with one item
          const singleProfessional = data.data;
          setProfessionals([singleProfessional]);

          // Store the ID of the loaded professional
          setLoadedIds(new Set([singleProfessional.data_member_id]));

          // No more data to load after a direct lookup
          setHasMore(false);
        } else if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          const newProfessionals = data.data;
          setProfessionals(newProfessionals);

          // Store the IDs of loaded professionals
          const newIds = new Set(newProfessionals.map(p => p.data_member_id));
          setLoadedIds(newIds);

          // Check if there are potentially more results
          setHasMore(data.data.length >= RESULTS_PER_PAGE);
        } else {
          console.log('No professionals found in API response', data);
          setProfessionals([]);
          setLoadedIds(new Set());
          setHasMore(false);
        }
      }
    } catch (err) {
      setError(err);
      console.error("Error loading professionals:", err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Function to load more data when scrolling
  const loadMore = useCallback(async () => {
    // Don't try to load more data if we're already loading or there's no more data
    if (loading || !hasMore) return;

    // Don't try to load more for person_id searches since they return a single result
    if (params.person_id) {
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);

      // Increment the page for the next batch
      const nextPage = page + 1;
      setPage(nextPage);

      // Calculate how many more results we need based on the page number
      const totalNeeded = nextPage * RESULTS_PER_PAGE;

      // Create new params with the updated nb_results
      const loadMoreParams = {
        ...params,
        nb_results: String(totalNeeded)
      };

      const data = await fetchProfessionals(loadMoreParams);

      // Handle the case of a single object response (shouldn't happen during loadMore,
      // but added for consistency)
      if (data && data.data && !Array.isArray(data.data) && data.data.data_member_id) {
        // Since we're already showing this single professional, just set hasMore to false
        setHasMore(false);
      } else if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Filter out professionals that are already loaded
        const currentIds = loadedIds;
        const allProfessionals = data.data;

        const newProfessionals = allProfessionals.filter(p => !currentIds.has(p.data_member_id));

        if (newProfessionals.length > 0) {
          // Add new professionals to the list
          setProfessionals(prevProfessionals => [...prevProfessionals, ...newProfessionals]);

          // Update the set of loaded IDs
          const updatedIds = new Set(currentIds);
          newProfessionals.forEach(p => updatedIds.add(p.data_member_id));
          setLoadedIds(updatedIds);

          // Check if there are more results to load
          setHasMore(allProfessionals.length >= totalNeeded);
        } else {
          // No new professionals were found
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err);
      console.error("Error loading more professionals:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, params, loadedIds]);

  // Initial fetch when component mounts
  useEffect(() => {
    loadProfessionals();
  }, [loadProfessionals]);

  return {
    professionals,
    loading,
    error,
    loadProfessionals,
    loadMore,
    hasMore,
    params
  };
};

export default useProfessionals; 