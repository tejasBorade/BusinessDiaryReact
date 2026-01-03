import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { businessService, categoryService, areaService } from '../services';

const MyBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    area_id: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    opening_hours: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBusinesses();
    fetchCategories();
    fetchAreas();
  }, []);

  const fetchMyBusinesses = async () => {
    try {
      setLoading(true);
      const data = await businessService.getBusinesses({ owner: 'me' });
      setBusinesses(data.businesses);
      setError('');
    } catch (err) {
      setError('Failed to fetch your businesses');
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchAreas = async () => {
    try {
      const data = await areaService.getAreas();
      setAreas(data.areas);
    } catch (err) {
      console.error('Error fetching areas:', err);
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
    setEditingBusiness(null);
    setFormData({
      name: '',
      description: '',
      category_id: '',
      area_id: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      opening_hours: '',
    });
    setShowModal(true);
    setMessage('');
    setError('');
  };

  const openEditModal = (business) => {
    setEditingBusiness(business);
    setFormData({
      name: business.name,
      description: business.description,
      category_id: business.category_id,
      area_id: business.area_id,
      address: business.address,
      phone: business.phone || '',
      email: business.email || '',
      website: business.website || '',
      opening_hours: business.opening_hours || '',
    });
    setShowModal(true);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate required fields
    if (!formData.name || !formData.category_id || !formData.area_id || !formData.address) {
      setError('Please fill all required fields');
      return;
    }

    try {
      if (editingBusiness) {
        await businessService.updateBusiness(editingBusiness.id, formData);
        setMessage('Business updated successfully!');
      } else {
        await businessService.createBusiness(formData);
        setMessage('Business created successfully!');
      }
      setTimeout(() => {
        setShowModal(false);
        fetchMyBusinesses();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (businessId, businessName) => {
    if (!window.confirm(`Are you sure you want to delete "${businessName}"?`)) {
      return;
    }

    try {
      await businessService.deleteBusiness(businessId);
      setMessage('Business deleted successfully!');
      fetchMyBusinesses();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete business');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>My Businesses</h1>
          <button onClick={openCreateModal} className="btn btn-primary">
            + Add New Business
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading your businesses...</div>
        ) : businesses.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">🏪</div>
            <h2>No businesses yet</h2>
            <p>Start by adding your first business listing</p>
            <button onClick={openCreateModal} className="btn btn-primary">
              Add Your First Business
            </button>
          </div>
        ) : (
          <div className="businesses-grid">
            {businesses.map((business) => (
              <div key={business.id} className="business-card">
                <div className="business-header">
                  <h3>{business.name}</h3>
                  {business.is_verified && (
                    <span className="verified-badge">✓ Verified</span>
                  )}
                </div>

                <div className="business-info">
                  <div className="info-row">
                    <span className="label">Category:</span>
                    <span className="badge badge-category">
                      {business.category?.name || 'N/A'}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="label">Location:</span>
                    <span>
                      {business.area?.name}, {business.area?.city}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="label">Address:</span>
                    <span>{business.address}</span>
                  </div>

                  {business.phone && (
                    <div className="info-row">
                      <span className="label">Phone:</span>
                      <span>{business.phone}</span>
                    </div>
                  )}

                  {business.email && (
                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span>{business.email}</span>
                    </div>
                  )}

                  {business.rating > 0 && (
                    <div className="info-row">
                      <span className="label">Rating:</span>
                      <span className="rating">
                        {'⭐'.repeat(Math.round(business.rating))} ({business.rating.toFixed(1)})
                      </span>
                    </div>
                  )}
                </div>

                <div className="business-description">
                  <p>{business.description}</p>
                </div>

                <div className="business-actions">
                  <button
                    onClick={() => openEditModal(business)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(business.id, business.name)}
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
                <h2>{editingBusiness ? 'Edit Business' : 'Add New Business'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Business Name *</label>
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
                  <label>Category *</label>
                  <select
                    name="category_id"
                    className="form-control"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Area *</label>
                  <select
                    name="area_id"
                    className="form-control"
                    value={formData.area_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Area</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}, {area.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    className="form-control"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Opening Hours</label>
                  <input
                    type="text"
                    name="opening_hours"
                    className="form-control"
                    value={formData.opening_hours}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Fri: 9AM-6PM"
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
                    {editingBusiness ? 'Update Business' : 'Create Business'}
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

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-state h2 {
          color: #333;
          margin-bottom: 10px;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 30px;
        }

        .businesses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .business-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }

        .business-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .business-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
        }

        .business-header h3 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }

        .verified-badge {
          background-color: #28a745;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .business-info {
          margin-bottom: 15px;
        }

        .info-row {
          display: flex;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .info-row .label {
          font-weight: 600;
          color: #666;
          min-width: 80px;
        }

        .badge-category {
          background-color: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .rating {
          color: #ff9800;
          font-weight: 500;
        }

        .business-description {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }

        .business-description p {
          margin: 0;
          font-size: 14px;
          color: #555;
          line-height: 1.5;
        }

        .business-actions {
          display: flex;
          gap: 10px;
        }

        .business-actions button {
          flex: 1;
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
          max-width: 600px;
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 15px 20px;
          border-top: 1px solid #e0e0e0;
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .businesses-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
        }
      `}</style>
    </>
  );
};

export default MyBusinesses;
