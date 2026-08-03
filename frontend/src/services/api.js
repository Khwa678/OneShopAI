import axios from 'axios';

const PRODUCTION_API_URL = 'https://my-project-is-ready.onrender.com/api';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname === '[::1]' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local');
    if (isLocalhost) {
      return import.meta.env.VITE_DEV_API_BASE_URL || '/api';
    }
  }
  // Production: use env var if available (baked at build time), otherwise use hardcoded production URL
  return import.meta.env.VITE_API_BASE_URL || PRODUCTION_API_URL;
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 45000 // 45s timeout for Render backend cold-starts & AI requests
});

// Authentication supports both HttpOnly cookies AND Bearer token header for cross-site cookie resilience
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('docs_playground_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: automatically retry once on Render cold-start 502/503/504 or network timeout
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config._retry) {
      return Promise.reject(error);
    }
    // If Render cold-start error (502, 503, 504, or Network Error / timeout)
    const status = error.response?.status;
    const isNetworkOrColdStart = !error.response || status === 502 || status === 503 || status === 504 || error.code === 'ECONNABORTED';

    if (isNetworkOrColdStart) {
      config._retry = true;
      // Wait 3 seconds for Render backend service to finish spinning up
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return API(config);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const loginWithGoogle = (data) => API.post('/auth/google', data);
export const logoutUser = () => API.post('/auth/logout');
export const resetPassword = (data) => API.post('/auth/forgot-password', data);
export const getCurrentUser = () => API.get('/auth/me');

// AI APIs
export const summarizeText = (data) => API.post('/ai/summarize', data);
export const summarizeDocument = summarizeText;

export const performOcr = (data) => API.post('/ai/ocr', data);
export const processOcr = performOcr;

export const checkAtsScore = (data) => API.post('/ai/ats-check', data);
export const checkAgreement = (data) => API.post('/ai/agreement-check', data);
export const detectAiContent = (data) => API.post('/ai/detector', data);
export const humanizeText = (data) => API.post('/ai/humanizer', data);
export const getAiStatus = () => API.get('/ai/status');

// Documents API
export const uploadDocument = (formData) => API.post('/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getDocuments = () => API.get('/documents');
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

// Blogs API
export const getBlogs = () => API.get('/blogs');
export const createBlogPost = (data) => API.post('/blogs', data);
export const verifyBlogPost = (id) => API.put(`/blogs/${id}/verify`);
export const deleteBlogPost = (id) => API.delete(`/blogs/${id}`);

// Contact API
export const sendContactMessage = (data) => API.post('/auth/contact', data);

export default API;
