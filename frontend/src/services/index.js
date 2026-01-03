import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export const userService = {
  getUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

export const businessService = {
  getBusinesses: async (params) => {
    const response = await api.get('/businesses', { params });
    return response.data;
  },

  getBusiness: async (id) => {
    const response = await api.get(`/businesses/${id}`);
    return response.data;
  },

  createBusiness: async (businessData) => {
    const response = await api.post('/businesses', businessData);
    return response.data;
  },

  updateBusiness: async (id, businessData) => {
    const response = await api.put(`/businesses/${id}`, businessData);
    return response.data;
  },

  deleteBusiness: async (id) => {
    const response = await api.delete(`/businesses/${id}`);
    return response.data;
  },

  addReview: async (id, reviewData) => {
    const response = await api.post(`/businesses/${id}/reviews`, reviewData);
    return response.data;
  },
};

export const areaService = {
  getAreas: async (params) => {
    const response = await api.get('/areas', { params });
    return response.data;
  },

  getArea: async (id) => {
    const response = await api.get(`/areas/${id}`);
    return response.data;
  },

  createArea: async (areaData) => {
    const response = await api.post('/areas', areaData);
    return response.data;
  },

  updateArea: async (id, areaData) => {
    const response = await api.put(`/areas/${id}`, areaData);
    return response.data;
  },

  deleteArea: async (id) => {
    const response = await api.delete(`/areas/${id}`);
    return response.data;
  },

  assignManager: async (areaId, userId) => {
    const response = await api.post(`/areas/${areaId}/managers`, { user_id: userId });
    return response.data;
  },

  removeManager: async (areaId, userId) => {
    const response = await api.delete(`/areas/${areaId}/managers/${userId}`);
    return response.data;
  },
};

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
