import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { categoryService } from '../services';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Common category icons
  const iconOptions = [
    '🍕', '☕', '🏥', '🏫', '🏦', '🏪', '🏨', '🍔',
    '🛒', '💼', '🏋️', '💇', '🔧', '🚗', '📱', '💻',
    '🏡', '🎬', '📚', '🎨', '🏛️', '⚖️', '🏭', '🌳'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data.categories);
      setError('');
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        setMessage('Category updated successfully!');
      } else {
        await categoryService.createCategory(formData);
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
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Category Management</h1>
          <button onClick={openCreateModal} className="btn btn-primary">
            + Add New Category
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading categories...</div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-icon">{category.icon || '🏪'}</div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  {category.description && <p>{category.description}</p>}
                  <div className="category-stats">
                    <span className="badge">{category.business_count || 0} businesses</span>
                  </div>
                </div>
                <div className="category-actions">
                  <button
                    onClick={() => openEditModal(category)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
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
      </div>

      <style jsx>{`
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
    </>
  );
};

export default CategoryManagement;
