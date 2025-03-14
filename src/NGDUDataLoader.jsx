import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetch } from '@tauri-apps/plugin-http';


import authService from './authService';

const NGDUDataLoader = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to fetch data from the NGDU endpoint
  const fetchNGDUData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the API URI from localStorage
      const apiUri = localStorage.getItem('apiUri');
      
      if (!apiUri) {
        throw new Error('API URI not configured. Please check settings.');
      }

      // Check if we have a valid token, otherwise try to get one
      if (!authService.isAuthenticated()) {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');

                
        if (!username || !password) {
          throw new Error('Authentication credentials missing. Please configure in settings.');
        }
        
        const authResult = await authService.authenticate(apiUri, username, password);
        if (!authResult.success) {
          throw new Error('Authentication failed. Please check your credentials.');
        }
      }

      // Construct the full endpoint URL
      const endpoint = `${apiUri}/proxy/ciam-object-tree-back/api/v1/ngdu`;
      
      // Get authorization headers with the token
      const headers = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders()
      };

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token might be expired or invalid
          authService.clearToken();
          throw new Error('Authentication token expired. Please reauthenticate.');
        }
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      
      // Check if result is what we expect (an array)
      if (result && Array.isArray(result)) {
        setData(result);
      } else if (result && typeof result === 'object') {
        // If it's an object but not an array, it might be wrapped in a property
        // Common API patterns include { data: [...] } or { results: [...] }
        const possibleArrays = ['data', 'results', 'items', 'records', 'ngdu'];
        for (const key of possibleArrays) {
          if (Array.isArray(result[key])) {
            console.log(`Found array in response.${key}`);
            setData(result[key]);
            break;
          }
        }
        
        // If we couldn't find an array, just use the object as is
        if (!Array.isArray(data)) {
          console.log("Could not find array in response, using raw response");
          setData(result);
        }
      } else {
        console.error("Unexpected response format:", result);
        setData([]);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching NGDU data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchNGDUData();
  }, []);

  const handleRefresh = () => {
    fetchNGDUData();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          NGDU Data
        </Typography>
        
        <Box>
          <Button 
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          
          
        </Box>
      </Box>
      
      {lastUpdated && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Last updated: {lastUpdated.toLocaleString()}
        </Typography>
      )}
      
      {!authService.isAuthenticated() && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Not authenticated. Please configure credentials in settings.
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : !data || data.length === 0 ? (
        <Alert severity="info">
          No NGDU data available. Please check your connection settings.
        </Alert>
      ) : (
        <List>
          {Array.isArray(data) ? data.map((item, index) => (
            <React.Fragment key={item?.id || index}>
              <ListItem>
                <ListItemText 
                  primary={item?.name || `NGDU Item ${index + 1}`}
                  secondary={
                    <Typography variant="body2" component="span">
                      {item?.description || 'No description available'}
                    </Typography>
                  }
                />
              </ListItem>
              {index < data.length - 1 && <Divider />}
            </React.Fragment>
          )) : (
            <Alert severity="warning">
              Data received is not in the expected format. Received: {typeof data}
            </Alert>
          )}
        </List>
      )}
    </Paper>
  );
};

export default NGDUDataLoader;