import { useState } from 'react';
import { useAuth } from '../contexts/authcontext';
import { useDatabase } from '../contexts/dbcontext';
import { fetch } from '@tauri-apps/plugin-http';


export const useNgduData = () => {
  const { executeQuery } = useDatabase()
  const [ isLoadingNgdu, setIsLoading] = useState(false);
  const [ errorNgdu, setError] = useState(null);
  const [ syncStatusNgdu, setSyncStatus] = useState(null);
  const { apiUri, getAuthHeaders, isAuthenticated } = useAuth();
  
  /**
   * Fetches NGDU data from the API and saves it to the database
   * @returns {Promise<{success: boolean, message: string, count?: number}>}
   */
  const fetchAndSaveNgduData = async () => {
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
    setSyncStatus({ status: 'in_progress', message: 'Syncing NGDU data...' });
    
    try {
      // Construct the full endpoint URL
      const endpoint = `${apiUri}/proxy/ciam-object-tree-back/api/v1/ngdu`;
      
      // Make the API request
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      
      // Check if request was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch NGDU data: ${response.status}`);
      }
      
      // Parse the response
      const result = await response.json();
      console.log(result);
      // Begin a transaction for better performance and data integrity
      //await executeQuery('BEGIN TRANSACTION');
      
      try {
        // Insert or replace each NGDU record
        for (const element of result) {
          await executeQuery(
            'INSERT OR REPLACE INTO ngdu (id, uid, baseId, abbrev, title) VALUES ($1, $2, $3, $4, $5)',
            [element.id, element.uid, element.baseId, element.abbrev, element.title]
          );
        }
        
        // Commit the transaction
       // await executeQuery('COMMIT');
        
        // Update status with success
        setSyncStatus({ 
          status: 'completed', 
          message: `Успешно обновлено / добавлено ${result.length} записей НГДУ` 
        });
        
        return { 
          success: true, 
          message: `Успешно обновлено / добавлено ${result.length} записей НГДУ`,
          count: result.length
        };
      } catch (dbError) {
        // Rollback on error
        await executeQuery('ROLLBACK');
        throw new Error(`Database error: ${dbError.message}`);
      }
    } catch (error) {
      // Set error state and return error result
      const errorMessage = error.message || 'Failed to fetch or save NGDU data';
      setError(errorMessage);
      setSyncStatus({ status: 'failed', message: errorMessage });
      
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    fetchAndSaveNgduData,
    isLoadingNgdu,
    errorNgdu,
    syncStatusNgdu
  };
};