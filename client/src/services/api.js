import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for error handling
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        console.error('API Error:', message);
        return Promise.reject(message);
    }
);

export const formService = {
    // Form operations
    getForms: () => api.get('/forms'),
    getForm: (id) => api.get(`/forms/${id}`),
    createForm: (data) => api.post('/forms', data),
    updateForm: (id, data) => api.put(`/forms/${id}`, data),
    deleteForm: (id) => api.delete(`/forms/${id}`),
    publishForm: (id, isPublished) => api.patch(`/forms/${id}/publish`, { isPublished }),

    // Response operations
    getResponses: (formId) => api.get(`/responses/form/${formId}`),
    submitResponse: (data) => api.post('/responses', data),
    getResponseStats: (formId) => api.get(`/responses/form/${formId}/stats`),
};

export default api;
