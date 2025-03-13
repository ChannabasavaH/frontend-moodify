// Frontend service to handle authentication and token refresh
import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Important for cookies
});

// Add request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Request new access token using the refresh token (in cookies)
        const response = await axios.post(
          'http://localhost:8080/api/users/refresh-token',
          {},
          { withCredentials: true } // Important to include cookies
        );
        
        // Store the new access token
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Update the authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, redirect to login
        console.error('Error refreshing token:', refreshError);
        localStorage.removeItem('accessToken');
        
        // If using Next.js router outside of component
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export {api};