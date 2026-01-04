import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { categoryService } from '../services';
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });
  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name: '',
    description: '',
    icon: '',
    category_id: null,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Common category icons
  const iconOptions = [
    '🍕', '☕', '🏥', '🏫', '🏦', '🏪', '🏨', '🍔',
    '🛒', '💼', '🏋️', '💇', '🔧', '🚗', '📱', '💻',
    '🏡', '🎬', '📚', '🎨', '🏛️', '⚖️', '🏭', '🌳'
  ];

  // Subcategory icons
  const subcategoryIcons = [
    '🩺', '❤️', '🧴', '🦴', '🦷', '👶', '👩‍⚕️', '👁️', '👂', '🧠',
    '🏋️', '🧘', '💃', '⚡', '🤸', '🥊', '👟',
    '🍽️', '🍔', '☕', '🍛', '🥢', '🍕', '🥐', '🥗', '🦞', '🍖',
    '🚗', '🏍️', '🔧', '💦', '⚙️', '🎵', '🔨',
    '📚', '📝', '🗣️', '🎵', '💃', '🎨', '💻', '🎤',
    '💒', '📸', '🎉', '📦', '🆔', '🎬'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5000/api/categories?include_subcategories=true');
      setCategories(response.data.categories || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:5000/api/subcategories/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubcategories(response.data.subcategories || []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchSubcategories(category.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '🏪',
    });
    setShowModal(true);
    setMessage('');
    setError('');
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '🏪',
    });
    setShowModal(true);
    setMessage('');
    setError('');
  };

  const openSubcategoryModal = (subcategory = null) => {
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }
    setEditingSubcategory(subcategory);
    setSubcategoryFormData({
      name: subcategory?.name || '',
      description: subcategory?.description || '',
      icon: subcategory?.icon || '🩺',
      category_id: selectedCategory.id,
    });
    setShowSubcategoryModal(true);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (editingCategory) {
        await axios.put(`http://127.0.0.1:5000/api/categories/${editingCategory.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Category updated successfully!');
      } else {
        await axios.post('http://127.0.0.1:5000/api/categories', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Category created successfully!');
      }
      setTimeout(() => {
        setShowModal(false);
        fetchCategories();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!subcategoryFormData.name.trim()) {
      setError('Subcategory name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (editingSubcategory) {
        await axios.put(`http://127.0.0.1:5000/api/subcategories/${editingSubcategory.id}`, subcategoryFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Subcategory updated successfully!');
      } else {
        await axios.post('http://127.0.0.1:5000/api/subcategories', subcategoryFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Subcategory created successfully!');
      }
      setTimeout(() => {
        setShowSubcategoryModal(false);
        fetchSubcategories(selectedCategory.id);
        fetchCategories();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:5000/api/subcategories/${subcategoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Subcategory deleted successfully!');
      fetchSubcategories(selectedCategory.id);
      fetchCategories();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subcategory');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      setMessage('Category deleted successfully!');
      fetchCategories();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <PageLayout>
      <div className="container">
        <div className="page-header">
          <h1>📂 Category & Subcategory Management</h1>
          <button onClick={openCreateModal} className="btn btn-primary">
            + Add New Category
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading categories...</div>
        ) : (
          <div className="category-management-layout">
            {/* Categories Section */}
            <div className="categories-section">
              <h2>Categories</h2>
              <div className="categories-list">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className={`category-item ${selectedCategory?.id === category.id ? 'selected' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="category-icon">{category.icon || '🏪'}</div>
                    <div className="category-info">
                      <h3>{category.name}</h3>
                      {category.description && <p>{category.description}</p>}
                      <div className="category-stats">
                        <span className="badge">{(category.subcategories || []).length} subcategories</span>
                      </div>
                    </div>
                    <div className="category-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(category)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Category"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="btn btn-danger btn-sm"
                        title="Delete Category"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subcategories Section */}
            <div className="subcategories-section">
              <div className="subcategories-header">
                <h2>{selectedCategory ? `Subcategories of ${selectedCategory.name}` : 'Select a Category'}</h2>
                {selectedCategory && (
                  <button onClick={() => openSubcategoryModal()} className="btn btn-primary btn-sm">
                    + Add Subcategory
                  </button>
                )}
              </div>
              
              {!selectedCategory ? (
                <div className="empty-state">
                  <p>👈 Select a category to view and manage its subcategories</p>
                </div>
              ) : subcategories.length === 0 ? (
                <div className="empty-state">
                  <p>No subcategories yet</p>
                  <button onClick={() => openSubcategoryModal()} className="btn btn-primary">
                    + Add First Subcategory
                  </button>
                </div>
              ) : (
                <div className="subcategories-grid">
                  {subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="subcategory-card">
                      <div className="subcategory-icon">{subcategory.icon || '📌'}</div>
                      <div className="subcategory-info">
                        <h4>{subcategory.name}</h4>
                        {subcategory.description && <p>{subcategory.description}</p>}
                      </div>
                      <div className="subcategory-actions">
                        <button
                          onClick={() => openSubcategoryModal(subcategory)}
                          className="btn btn-secondary btn-sm"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(subcategory.id)}
                          className="btn btn-danger btn-sm"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Icon *</label>
                  <div className="icon-selector">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, icon })}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    name="icon"
                    className="form-control"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="Or enter custom emoji"
                    style={{ marginTop: '10px' }}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subcategory Modal */}
        {showSubcategoryModal && (
          <div className="modal-overlay" onClick={() => setShowSubcategoryModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}</h2>
                <button className="modal-close" onClick={() => setShowSubcategoryModal(false)}>
                  &times;
                </button>
              </div>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubcategorySubmit}>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory?.name}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Subcategory Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={subcategoryFormData.name}
                    onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={subcategoryFormData.description}
                    onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, description: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Icon *</label>
                  <div className="icon-selector">
                    {subcategoryIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`icon-option ${subcategoryFormData.icon === icon ? 'selected' : ''}`}
                        onClick={() => setSubcategoryFormData({ ...subcategoryFormData, icon })}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    name="icon"
                    className="form-control"
                    value={subcategoryFormData.icon}
                    onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, icon: e.target.value })}
                    placeholder="Or enter custom emoji"
                    style={{ marginTop: '10px' }}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowSubcategoryModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingSubcategory ? 'Update Subcategory' : 'Create Subcategory'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .category-management-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }

        .categories-section,
        .subcategories-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .categories-section h2,
        .subcategories-section h2 {
          margin: 0 0 20px 0;
          font-size: 20px;
          color: #333;
        }

        .subcategories-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-item:hover {
          border-color: #007bff;
          background-color: #f8f9fa;
          transform: translateX(5px);
        }

        .category-item.selected {
          border-color: #007bff;
          background-color: #e7f3ff;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
        }

        .subcategories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .subcategory-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s;
        }

        .subcategory-card:hover {
          border-color: #007bff;
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .subcategory-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .subcategory-info h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #333;
        }

        .subcategory-info p {
          font-size: 13px;
          color: #666;
          margin: 0 0 12px 0;
        }

        .subcategory-actions {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .empty-state p {
          font-size: 18px;
          margin-bottom: 20px;
        }

        .container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .category-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: box-shadow 0.3s ease;
        }

        .category-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .category-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .category-info {
          flex: 1;
          width: 100%;
          margin-bottom: 15px;
        }

        .category-info h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
          color: #333;
        }

        .category-info p {
          margin: 0;
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }

        .category-stats {
          margin-top: 10px;
        }

        .badge {
          background-color: #e9ecef;
          color: #495057;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
        }

        .category-actions {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .category-actions button {
          flex: 1;
        }

        .icon-selector {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 5px;
          margin-top: 10px;
        }

        .icon-option {
          font-size: 24px;
          padding: 8px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-option:hover {
          border-color: #007bff;
          transform: scale(1.1);
        }

        .icon-option.selected {
          border-color: #007bff;
          background-color: #e7f3ff;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #666;
        }

        .modal-content form {
          padding: 20px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 15px 20px;
          border-top: 1px solid #e0e0e0;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }

          .icon-selector {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>
    </PageLayout>
  );
};

export default CategoryManagement;
