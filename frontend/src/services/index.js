import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
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
    const response = await api.get('/api/auth/verify');
    return response.data;
  },
};

export const userService = {
  getUsers: async (params) => {
    const response = await api.get('/api/users', { params });
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/api/users/stats');
    return response.data;
  },
};

export const businessService = {
  getBusinesses: async (params) => {
    const response = await api.get('/api/businesses', { params });
    return response.data;
  },

  getMyBusinesses: async () => {
    const response = await api.get('/api/businesses/my');
    return response.data;
  },

  getBusiness: async (id) => {
    const response = await api.get(`/api/businesses/${id}`);
    return response.data;
  },

  createBusiness: async (businessData) => {
    const response = await api.post('/api/businesses', businessData);
    return response.data;
  },

  updateBusiness: async (id, businessData) => {
    const response = await api.put(`/api/businesses/${id}`, businessData);
    return response.data;
  },

  deleteBusiness: async (id) => {
    const response = await api.delete(`/api/businesses/${id}`);
    return response.data;
  },

  addReview: async (id, reviewData) => {
    const response = await api.post(`/api/businesses/${id}/reviews`, reviewData);
    return response.data;
  },
};

export const areaService = {
  getAreas: async (params) => {
    const response = await api.get('/api/areas', { params });
    return response.data;
  },

  getArea: async (id) => {
    const response = await api.get(`/api/areas/${id}`);
    return response.data;
  },

  createArea: async (areaData) => {
    const response = await api.post('/api/areas', areaData);
    return response.data;
  },

  updateArea: async (id, areaData) => {
    const response = await api.put(`/api/areas/${id}`, areaData);
    return response.data;
  },

  deleteArea: async (id) => {
    const response = await api.delete(`/api/areas/${id}`);
    return response.data;
  },

  assignManager: async (areaId, userId) => {
    const response = await api.post(`/api/areas/${areaId}/managers`, { user_id: userId });
    return response.data;
  },

  removeManager: async (areaId, userId) => {
    const response = await api.delete(`/api/areas/${areaId}/managers/${userId}`);
    return response.data;
  },
};

export const categoryService = {
  getCategories: async (params) => {
    const response = await api.get('/api/categories', { params });
    return response.data;
  },

  getCategory: async (id) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/api/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/api/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },

  getSubcategories: async (categoryId) => {
    const response = await api.get(`/api/subcategories/category/${categoryId}`);
    return response.data;
  },

  createSubcategory: async (subcategoryData) => {
    const response = await api.post('/api/subcategories', subcategoryData);
    return response.data;
  },

  updateSubcategory: async (id, subcategoryData) => {
    const response = await api.put(`/api/subcategories/${id}`, subcategoryData);
    return response.data;
  },

  deleteSubcategory: async (id) => {
    const response = await api.delete(`/api/subcategories/${id}`);
    return response.data;
  },
};
