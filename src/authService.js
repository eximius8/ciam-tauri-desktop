// authService.js
// Service to handle authentication and token management
import { fetch } from '@tauri-apps/plugin-http';

class AuthService {
    constructor() {
      this.token = localStorage.getItem('authToken');
      this.tokenExpiry = localStorage.getItem('tokenExpiry') 
        ? new Date(localStorage.getItem('tokenExpiry')) 
        : null;
    }
  
    // Check if we have a valid token
    isAuthenticated() {
      if (!this.token) return false;
      
      // Check if token is expired (if we have expiry info)
      if (this.tokenExpiry && new Date() > this.tokenExpiry) {
        this.clearToken();
        return false;
      }
      
      return true;
    }
  
    // Get the stored token
    getToken() {
        console.log(this.token);
      return this.token;
    }
  
    // Store the token and optionally its expiry
    setToken(token, expiryInSeconds = 3600) {
      this.token = token;
      
      // Set token expiry (default 1 hour if not specified)
      const expiry = new Date();
      expiry.setSeconds(expiry.getSeconds() + expiryInSeconds);
      this.tokenExpiry = expiry;
      
      // Save to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('tokenExpiry', expiry.toISOString());
    }
  
    // Clear the token
    clearToken() {
      this.token = null;
      this.tokenExpiry = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');
    }
  
    // Authenticate and get new token
    async authenticate(apiUri, username, password) {
        try {
          console.log(password);
      
          const response = await fetch(`${apiUri}/api/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
              })           
          });
          
          if (!response.ok) {
            const errorData = response.data || {};
            throw new Error(errorData.message || `Authentication failed: ${response.status}`);
          }
   
          const data = await response.json()
          
          // Store the token (remove "Bearer " prefix if present)
          const token = data.token.startsWith('Bearer ') 
            ? data.token.substring(7) 
            : data.token;
            
          this.setToken(token);
          
          return {
            success: true,
            token: token
          };
        } catch (error) {
          console.error('Authentication error:', error);
          this.clearToken();
          return {
            success: false,
            error: error.message
          };
        }
      }
  
    // Get authorization headers for API requests
    getAuthHeaders() {
      return this.isAuthenticated() 
        ? { 'Authorization': `Bearer ${this.token}` } 
        : {};
    }
  }
  
  // Export as singleton
  const authService = new AuthService();
  export default authService;