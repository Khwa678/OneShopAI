import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Attach Authorization Token if stored locally as fallback
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('docs_playground_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
