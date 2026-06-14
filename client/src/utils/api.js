import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  getMe: () => api.get('/auth/me'),
};

export const volunteerAPI = {
  getAll: (params) => api.get('/volunteers', { params }),
  getById: (id) => api.get(`/volunteers/${id}`),
  getDashboard: () => api.get('/volunteers/dashboard'),
  updateProfile: (data) => api.put('/volunteers/profile', data),
  approve: (id) => api.put(`/volunteers/${id}/approve`),
  reject: (id) => api.put(`/volunteers/${id}/reject`),
  exportCSV: () => api.get('/volunteers/export', { responseType: 'blob' }),
};

export const internshipAPI = {
  apply: (data) => api.post('/internships/apply', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => api.get('/internships', { params }),
  getMyApplication: () => api.get('/internships/my-application'),
  getDashboard: () => api.get('/internships/dashboard'),
  updateStatus: (id, data) => api.put(`/internships/${id}/status`, data),
  addTask: (id, data) => api.post(`/internships/${id}/tasks`, data),
  updateTaskStatus: (id, taskId, data) => api.put(`/internships/${id}/tasks/${taskId}`, data),
};

export const eventAPI = {
  create: (data) => api.post('/events', data),
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  getMyEvents: () => api.get('/events/my-events'),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`),
  cancel: (id) => api.post(`/events/${id}/cancel`),
  markAttendance: (id, data) => api.post(`/events/${id}/attendance`, data),
};

export const certificateAPI = {
  generate: (data) => api.post('/certificates/generate', data),
  getAll: (params) => api.get('/certificates', { params }),
  getMyCertificates: () => api.get('/certificates/my-certificates'),
  download: (id) => api.get(`/certificates/${id}/download`, { responseType: 'blob' }),
  sendEmail: (id) => api.post(`/certificates/${id}/send-email`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getVolunteerGrowth: () => api.get('/analytics/volunteer-growth'),
  getEventParticipation: () => api.get('/analytics/event-participation'),
  getInternshipStats: () => api.get('/analytics/internship-stats'),
  getPopularEvents: () => api.get('/analytics/popular-events'),
};

export const chatAPI = {
  sendMessage: (message) => api.post('/chat/message', { message }),
  getHistory: () => api.get('/chat/history'),
};

export default api;
