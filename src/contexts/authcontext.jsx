// authContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetch } from '@tauri-apps/plugin-http';
import useLocalStorage from '../hooks/useLocalStorage';

// Create the authentication context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [tokenExpiry, setTokenExpiry] = useState(
    localStorage.getItem('tokenExpiry') 
      ? new Date(localStorage.getItem('tokenExpiry')) 
      : null
  );
  const [apiUri, setApiUri] = useLocalStorage('apiUri', '');
  const [username, setUsername] = useLocalStorage('username', '');
  const [password, setPassword] = useLocalStorage('password', '');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);


  const tryauth = async () => {
    if (apiUri && username && password){
      await authenticate(apiUri, username, password)
    }else{
      throw new Error('Необходимо указать все данные для входа');
    };
  }

  const clearToken = () => {
    setToken('');
  };
  
  // Initialize auth state
  useEffect(() => {
    // Check token validity on initial load
    if (token && tokenExpiry && new Date() > tokenExpiry) {
      // Token is expired, clear it
      clearToken();
    }
    
    // Try to auto-authenticate if we have credentials but no token
    const autoAuthenticate = async () => {
      if (!token && apiUri && username && password) {
        await authenticate(apiUri, username, password);
      }
      setIsLoading(false);
    };
    
    autoAuthenticate();
  }, []);
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    if (!token) return false;
    
    // Check if token is expired
    if (tokenExpiry && new Date() > tokenExpiry) {
      clearToken();
      return false;
    }
    
    return true;
  };
  
  // Set token and its expiry
  const setAuthToken = (newToken, expiryInSeconds = 3600) => {
    setToken(newToken);
    
    // Set token expiry (default 1 hour if not specified)
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + expiryInSeconds);
    setTokenExpiry(expiry);
    
    // Save to localStorage
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('tokenExpiry', expiry.toISOString());
  };
  
  // Save credentials to localStorage
  const saveCredentials = (apiUrl, user, pass) => {
    setApiUri(apiUrl);
    setUsername(user);
    setPassword(pass);
    
  };
  
  // Clear all auth data
  const clearAuthData = () => {
    setToken(null);
    setTokenExpiry(null);
    setUser(null);
    setApiUri('');
    setUsername('');
    setPassword('');
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
   // localStorage.removeItem('apiUri');
  //  localStorage.removeItem('username');
  //  localStorage.removeItem('password');
  };
  
  // Authenticate user
  const authenticate = async (apiUrl, user, pass, saveCredentialsFlag = true) => {
    setIsLoading(true);
    
    try {
      // Save credentials if requested
      if (saveCredentialsFlag) {
        saveCredentials(apiUrl, user, pass);
      }
      
      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user,
          password: pass
        })           
      });
      
      if (!response.ok) {
        const errorData = response.data || {};
        throw new Error(errorData.message || `Authentication failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Store the token (remove "Bearer " prefix if present)
      const newToken = data.token.startsWith('Bearer ') 
        ? data.token.substring(7) 
        : data.token;
        
      setAuthToken(newToken);
      
      // If the response includes user info, store it
      if (data.user) {
        setUser(data.user);
      }
      
      setIsLoading(false);
      return {
        success: true,
        token: newToken
      };
    } catch (error) {
      console.error('Authentication error:', error);
      // Don't clear credentials on failure, only clear the token
      setToken(null);
      setTokenExpiry(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');
      
      setIsLoading(false);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Get auth headers for API requests
  const getAuthHeaders = () => {
    return isAuthenticated() 
      ? { 'Authorization': `Bearer ${token}` } 
      : {};
  };
  
  // Logout function
  const logout = () => {
    clearAuthData();
  };
  
  // Create a unified value object for the context
  const value = {
    token,
    user,
    apiUri,
    username,
    password,
    isLoading,
    isAuthenticated,
    authenticate,
    logout,
    getAuthHeaders,
    saveCredentials,
    tryauth
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;