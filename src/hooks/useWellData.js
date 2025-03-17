import { useState } from 'react';
import { fetch } from '@tauri-apps/plugin-http';
import { useDatabase } from '../contexts/dbcontext';
import { useAuth } from '../contexts/authcontext';


export const useWellData = () => {
  const { executeQuery } = useDatabase();
  const [ isLoadingWell, setIsLoading] = useState(false);
  const [ errorWell, setError] = useState(null);
  const [ syncStatusWell, setSyncStatus] = useState(null);
  const [ progressWell, setProgress] = useState({ current: 0, total: 0 });
  const { apiUri, getAuthHeaders, isAuthenticated } = useAuth();
  

  const fetchWellsPage = async (page) => {
    if (!apiUri) {
      throw new Error('API URI is not configured');
    }
    
    const endpoint = `${apiUri}/proxy/ciam-object-tree-back/api/v1/wells2?page=${page}&perPage=10&sortField=id&sortOrder=ASC`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch wells data (page ${page}): ${response.status}`);
    }
    
    return await response.json();
  };
  

  const saveWellsToDb = async (wells) => {
   // await executeQuery('BEGIN TRANSACTION');
    
    try {
      // Insert or replace each Well record
      for (const well of wells) {
        await executeQuery(

          'INSERT OR REPLACE INTO well (id, uuid, baseId, number, workshopId) VALUES ($1, $2, $3, $4, $5)',
          [well.id, well.uuid, well.baseId, well.number, well.workshopId]
        );
      }

     // await executeQuery('COMMIT');
      return wells.length;
    } catch (error) {
     // await executeQuery('ROLLBACK');
      throw error;
    }
  };
  
  
  const fetchAndSaveWellsData = async () => {
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
    setSyncStatus({ status: 'in_progress', message: 'Syncing Wells data...' });
    setProgress({ current: 0, total: 1 }); // Start with default assumption of 1 page
    
    try {
      // First, create the table if it doesn't exist
     
      
      // Fetch first page and get total pages info
      const firstPageData = await fetchWellsPage(0);
      const totalPages = firstPageData.pageInfo.totalPages;
      let allWells = [...firstPageData.data];
      
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
          
          const pageData = await fetchWellsPage(page);
          allWells = [...allWells, ...pageData.data];
          
          setProgress({ current: page + 1, total: totalPages });
        }
      }
      
      // Save all fetched Wells to database
      setSyncStatus({ status: 'in_progress', message: 'Saving data to database...' });
      const savedCount = await saveWellsToDb(allWells);
      
      // Update status with success
      setSyncStatus({ 
        status: 'completed', 
        message: `Успешно обновлено / добавлено ${savedCount} записей скважин` 
      });
      
      return { 
        success: true, 
        message: `Успешно обновлено / добавлено ${savedCount} записей скважин`,
        count: savedCount
      };
    } catch (error) {
      // Set error state and return error result
      const errorMessage = error.message || 'Failed to fetch or save Wells data';
      setError(errorMessage);
      setSyncStatus({ status: 'failed', message: errorMessage });
      
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    fetchAndSaveWellsData,
    isLoadingWell,
    errorWell,
    syncStatusWell,
    progressWell
  };
};