import { useState } from 'react';
import { fetch } from '@tauri-apps/plugin-http';
import { useDatabase } from '../contexts/dbcontext';
import { useAuth } from '../contexts/authcontext';

/**
 * Custom hook to fetch Workshop data from the API with pagination
 * @param {function} executeQuery - Function to execute database queries
 * @returns {Object} - Functions and state for fetching and saving Workshop data
 */
export const useWorkshopData = () => {
  const { executeQuery } = useDatabase();
  const [ isLoading, setIsLoading] = useState(false);
  const [ error, setError] = useState(null);
  const [ syncStatus, setSyncStatus] = useState(null);
  const [ progress, setProgress] = useState({ current: 0, total: 0 });
  const { apiUri, getAuthHeaders, isAuthenticated } = useAuth();
  
  /**
   * Fetch data from a specific page of workshops endpoint
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} - API response data
   */
  const fetchWorkshopsPage = async (page) => {
    if (!apiUri) {
      throw new Error('API URI is not configured');
    }
    
    const endpoint = `${apiUri}/proxy/ciam-object-tree-back/api/v1/workshops?page=${page}&perPage=10&sortField=id&sortOrder=ASC`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch workshops data (page ${page}): ${response.status}`);
    }
    
    return await response.json();
  };
  
  /**
   * Save workshop data to the database
   * @param {Array} workshops - Array of workshop objects
   * @returns {Promise<number>} - Number of records saved
   */
  const saveWorkshopsToDb = async (workshops) => {
   // await executeQuery('BEGIN TRANSACTION');
    
    try {
      // Insert or replace each workshop record
      for (const workshop of workshops) {
        await executeQuery(
          'INSERT OR REPLACE INTO workshop (id, uuid, ngduId, baseId, abbrev, title, extendedTitle) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [workshop.id, workshop.uuid, workshop.ngduId, workshop.baseId, workshop.abbrev, workshop.title, workshop.extendedTitle]
        );
      }

     // await executeQuery('COMMIT');
      return workshops.length;
    } catch (error) {
     // await executeQuery('ROLLBACK');
      throw error;
    }
  };
  
  /**
   * Fetch all workshops data with pagination and save to database
   * @returns {Promise<{success: boolean, message: string, count?: number}>}
   */
  const fetchAndSaveWorkshopsData = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setError('User is not authenticated. Please log in first.');
      return { success: false, message: 'Authentication required' };
    }
    
    // Check if API URI is available
    if (!apiUri) {
      setError('API URI is not configured. Please check settings.');
      return { success: false, message: 'API URI missing' };
    }
    
    setIsLoading(true);
    setError(null);
    setSyncStatus({ status: 'in_progress', message: 'Syncing Workshops data...' });
    setProgress({ current: 0, total: 1 }); // Start with default assumption of 1 page
    
    try {
      // First, create the table if it doesn't exist
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS workshops (
          id INTEGER PRIMARY KEY,
          uid TEXT UNIQUE,
          ngduId INTEGER,
          baseId INTEGER,
          abbrev TEXT,
          title TEXT,
          FOREIGN KEY (ngduId) REFERENCES ngdu(id)
        )
      `);
      
      // Fetch first page and get total pages info
      const firstPageData = await fetchWorkshopsPage(0);
      const totalPages = firstPageData.pageInfo.totalPages;
      let allWorkshops = [...firstPageData.data];
      
      setProgress({ current: 1, total: totalPages });
      setSyncStatus({ 
        status: 'in_progress', 
        message: `Fetching page 1 of ${totalPages}...` 
      });
      
      // Fetch remaining pages if there are more than one
      if (totalPages > 1) {
        for (let page = 1; page < totalPages; page++) {
          setSyncStatus({ 
            status: 'in_progress', 
            message: `Fetching page ${page + 1} of ${totalPages}...` 
          });
          
          const pageData = await fetchWorkshopsPage(page);
          allWorkshops = [...allWorkshops, ...pageData.data];
          
          setProgress({ current: page + 1, total: totalPages });
        }
      }
      
      // Save all fetched workshops to database
      setSyncStatus({ status: 'in_progress', message: 'Saving data to database...' });
      const savedCount = await saveWorkshopsToDb(allWorkshops);
      
      // Update status with success
      setSyncStatus({ 
        status: 'completed', 
        message: `Successfully synced ${savedCount} workshop records` 
      });
      
      return { 
        success: true, 
        message: `Successfully synced ${savedCount} workshop records`,
        count: savedCount
      };
    } catch (error) {
      // Set error state and return error result
      const errorMessage = error.message || 'Failed to fetch or save workshops data';
      setError(errorMessage);
      setSyncStatus({ status: 'failed', message: errorMessage });
      
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    fetchAndSaveWorkshopsData,
    isLoading,
    error,
    syncStatus,
    progress
  };
};