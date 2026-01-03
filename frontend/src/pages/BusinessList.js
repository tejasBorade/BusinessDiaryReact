import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { businessService, categoryService, areaService } from '../services';
import './BusinessList.css';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    area_id: '',
    page: 1,
  });

  useEffect(() => {
    fetchCategories();
    fetchAreas();
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [filters]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await businessService.getBusinesses(filters);
      setBusinesses(data.businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAreas = async () => {
    try {
      const data = await areaService.getAreas();
      setAreas(data.areas);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBusinesses();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Business Directory</h1>
        </div>

        <div className="filters-card">
          <form onSubmit={handleSearch}>
            <div className="filters-grid">
              <div className="form-group">
                <input
                  type="text"
                  name="search"
                  className="form-control"
                  placeholder="Search businesses..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="form-group">
                <select
                  name="category_id"
                  className="form-control"
                  value={filters.category_id}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <select
                  name="area_id"
                  className="form-control"
                  value={filters.area_id}
                  onChange={handleFilterChange}
                >
                  <option value="">All Areas</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}, {area.city}
                    </option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="loading">Loading businesses...</div>
        ) : (
          <div className="business-grid">
            {businesses.length === 0 ? (
              <p>No businesses found.</p>
            ) : (
              businesses.map((business) => (
                <Link
                  to={`/businesses/${business.id}`}
                  key={business.id}
                  className="business-card"
                >
                  <div className="business-header">
                    <h3>{business.name}</h3>
                    {business.is_verified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>
                  <p className="business-category">
                    {business.category?.name}
                  </p>
                  <p className="business-location">
                    📍 {business.area?.name}, {business.area?.city}
                  </p>
                  <p className="business-description">
                    {business.description || 'No description available'}
                  </p>
                  <div className="business-footer">
                    <span className="rating">
                      ⭐ {business.rating.toFixed(1)} ({business.total_reviews} reviews)
                    </span>
                    <span className="phone">📞 {business.phone}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BusinessList;
