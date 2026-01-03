import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { areaService } from '../services';

const AreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [filterState, setFilterState] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Indian States
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Major cities by state
  const citiesByState = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Solapur', 'Kolhapur'],
    'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
  };

  useEffect(() => {
    fetchAreas();
  }, [filterState]);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const params = filterState ? { state: filterState } : {};
      const data = await areaService.getAreas(params);
      setAreas(data.areas);
      setError('');
    } catch (err) {
      setError('Failed to fetch areas');
      console.error('Error fetching areas:', err);
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
    setEditingArea(null);
    setFormData({
      name: '',
      city: '',
      state: '',
      pincode: '',
    });
    setShowModal(true);
    setMessage('');
    setError('');
  };

  const openEditModal = (area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      city: area.city,
      state: area.state,
      pincode: area.pincode || '',
    });
    setShowModal(true);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.name || !formData.city || !formData.state) {
      setError('Area name, city, and state are required');
      return;
    }

    try {
      if (editingArea) {
        await areaService.updateArea(editingArea.id, formData);
        setMessage('Area updated successfully!');
      } else {
        await areaService.createArea(formData);
        setMessage('Area created successfully!');
      }
      setTimeout(() => {
        setShowModal(false);
        fetchAreas();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (areaId, areaName) => {
    if (!window.confirm(`Are you sure you want to delete "${areaName}"?`)) {
      return;
    }

    try {
      await areaService.deleteArea(areaId);
      setMessage('Area deleted successfully!');
      fetchAreas();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete area');
      setTimeout(() => setError(''), 3000);
    }
  };

  const bulkAddCities = async (state) => {
    if (!citiesByState[state]) {
      setError('No cities configured for this state');
      return;
    }

    if (!window.confirm(`Add all major cities for ${state}?`)) {
      return;
    }

    try {
      const cities = citiesByState[state];
      for (const city of cities) {
        // Check if area already exists
        const exists = areas.some(
          (a) => a.city.toLowerCase() === city.toLowerCase() && a.state === state
        );
        if (!exists) {
          await areaService.createArea({
            name: city,
            city: city,
            state: state,
            pincode: '',
          });
        }
      }
      setMessage(`Successfully added cities for ${state}`);
      fetchAreas();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to add cities');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getCitySuggestions = () => {
    if (!formData.state || !citiesByState[formData.state]) {
      return [];
    }
    return citiesByState[formData.state];
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Area Management (States & Cities)</h1>
          <button onClick={openCreateModal} className="btn btn-primary">
            + Add New Area
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <div className="filter-section">
            <label>Filter by State:</label>
            <select
              className="form-control"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              style={{ width: '250px', display: 'inline-block', marginLeft: '10px' }}
            >
              <option value="">All States</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {filterState && citiesByState[filterState] && (
              <button
                onClick={() => bulkAddCities(filterState)}
                className="btn btn-secondary"
                style={{ marginLeft: '10px' }}
              >
                + Bulk Add Major Cities
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading">Loading areas...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Area Name</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Pincode</th>
                    <th>Businesses</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>
                        No areas found
                      </td>
                    </tr>
                  ) : (
                    areas.map((area) => (
                      <tr key={area.id}>
                        <td>{area.name}</td>
                        <td>{area.city}</td>
                        <td>{area.state}</td>
                        <td>{area.pincode || 'N/A'}</td>
                        <td>
                          <span className="badge">{area.business_count || 0}</span>
                        </td>
                        <td>
                          <button
                            onClick={() => openEditModal(area)}
                            className="btn btn-secondary btn-sm"
                            style={{ marginRight: '5px' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(area.id, area.name)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingArea ? 'Edit Area' : 'Add New Area'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>State *</label>
                  <select
                    name="state"
                    className="form-control"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City *</label>
                  {getCitySuggestions().length > 0 ? (
                    <>
                      <select
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select City</option>
                        {getCitySuggestions().map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <small>Or enter custom city name below:</small>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Custom city name"
                        style={{ marginTop: '5px' }}
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter city name"
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Area Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Andheri West, Koramangala"
                  />
                  <small>Specific locality or neighborhood name</small>
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-control"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    pattern="[0-9]{6}"
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
                    {editingArea ? 'Update Area' : 'Create Area'}
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

        .filter-section {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 4px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .table-container {
          overflow-x: auto;
        }

        .badge {
          background-color: #e9ecef;
          color: #495057;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
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
          padding: 4px 8px;
          font-size: 12px;
        }

        small {
          display: block;
          margin-top: 5px;
          color: #6c757d;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .filter-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-section .form-control {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

export default AreaManagement;
