import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryForSubcats, setSelectedCategoryForSubcats] = useState(null);
  const [displaySubcategories, setDisplaySubcategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    subcategory_id: '',
    area_id: '',
    page: 1,
  });
  const [ratingBusiness, setRatingBusiness] = useState(null);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchAreas();
  }, []);

  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/categories');
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/areas');
      setAreas(response.data.areas || []);
    } catch (err) {
      console.error('Error fetching areas:', err);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/subcategories/category/${categoryId}`);
      setSubcategories(response.data.subcategories || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleCategoryCardClick = async (category) => {
    // If clicking the same category, toggle off
    if (selectedCategoryForSubcats?.id === category.id) {
      setSelectedCategoryForSubcats(null);
      setDisplaySubcategories([]);
    } else {
      setSelectedCategoryForSubcats(category);
      // Fetch subcategories for display
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/subcategories/category/${category.id}`);
        setDisplaySubcategories(response.data.subcategories || []);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setDisplaySubcategories([]);
      }
    }
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category_id) params.append('category_id', filters.category_id);
      if (filters.subcategory_id) params.append('subcategory_id', filters.subcategory_id);
      if (filters.area_id) params.append('area_id', filters.area_id);
      params.append('page', filters.page);

      const response = await axios.get(`http://127.0.0.1:5000/api/businesses?${params}`);
      setBusinesses(response.data.businesses || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleRating = async (businessId) => {
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      await axios.post(`http://127.0.0.1:5000/api/businesses/${businessId}/rate`, {
        rating: userRating
      });
      
      alert('Thank you for your rating!');
      setRatingBusiness(null);
      setUserRating(0);
      fetchBusinesses(); // Refresh to show updated rating
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="public-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📒</span>
            <span className="logo-text">Business Diary</span>
          </div>
          <nav className="header-nav">
            <button onClick={() => navigate('/login')} className="btn btn-outline">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="btn btn-primary">
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Local Businesses</h1>
          <p className="hero-subtitle">Discover, rate, and connect with trusted services near you</p>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Explore businesses in different categories</p>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-card ${selectedCategoryForSubcats?.id === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryCardClick(category)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
              </div>
            ))}
          </div>

          {/* Subcategories Section */}
          {selectedCategoryForSubcats && displaySubcategories.length > 0 && (
            <div className="subcategories-section">
              <div className="subcategories-header">
                <h3 className="subcategories-title">
                  {selectedCategoryForSubcats.icon} {selectedCategoryForSubcats.name} - Subcategories
                </h3>
              </div>
              <div className="subcategories-grid">
                {displaySubcategories.map((subcat) => (
                  <div
                    key={subcat.id}
                    className="subcategory-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters({ 
                        ...filters, 
                        category_id: selectedCategoryForSubcats.id,
                        subcategory_id: subcat.id, 
                        page: 1 
                      });
                      // Scroll to results
                      document.querySelector('.businesses-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="subcategory-icon">{subcat.icon || '🏷️'}</div>
                    <h4 className="subcategory-name">{subcat.name}</h4>
                    {subcat.description && (
                      <p className="subcategory-description">{subcat.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search and Filters */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-card">
            <form onSubmit={handleSearch} className="filters-grid">
              <div className="filter-group">
                <label>🔍 Search</label>
                <input
                  type="text"
                  placeholder="Business name or keyword..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="filter-group">
                <label>📂 Category</label>
                <select
                  value={filters.category_id}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    setFilters({ ...filters, category_id: categoryId, subcategory_id: '', page: 1 });
                    if (categoryId) {
                      fetchSubcategories(categoryId);
                    } else {
                      setSubcategories([]);
                    }
                  }}
                  className="form-control"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {filters.category_id && subcategories.length > 0 && (
                <div className="filter-group">
                  <label>🏷️ Subcategory</label>
                  <select
                    value={filters.subcategory_id}
                    onChange={(e) => setFilters({ ...filters, subcategory_id: e.target.value, page: 1 })}
                    className="form-control"
                  >
                    <option value="">All Subcategories</option>
                    {subcategories.map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.icon} {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="filter-group">
                <label>📍 Location</label>
                <select
                  value={filters.area_id}
                  onChange={(e) => setFilters({ ...filters, area_id: e.target.value, page: 1 })}
                  className="form-control"
                >
                  <option value="">All Areas</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}, {area.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <button type="submit" className="btn btn-primary btn-block">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Business Listings */}
      <section className="businesses-section">
        <div className="container">
          {loading ? (
            <div className="loading">Loading businesses...</div>
          ) : businesses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏪</div>
              <h2>No businesses found</h2>
              <p>Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="businesses-grid">
              {businesses.map((business) => (
                <div 
                  key={business.id} 
                  className="business-card"
                  onClick={() => navigate(`/business/${business.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {business.image_url && (
                    <div className="business-image">
                      <img src={business.image_url} alt={business.name} />
                    </div>
                  )}
                  
                  <div className="business-content">
                    <div className="business-header">
                      <h3 className="business-name">{business.name}</h3>
                      {business.category && (
                        <span className="business-category">
                          {business.category.icon} {business.category.name}
                        </span>
                      )}
                    </div>

                    <p className="business-description">{business.description}</p>

                    <div className="business-details">
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span>{business.area?.name}, {business.area?.city}</span>
                      </div>
                      {business.phone && (
                        <div className="detail-item">
                          <span className="detail-icon">📞</span>
                          <span>{business.phone}</span>
                        </div>
                      )}
                      {business.email && (
                        <div className="detail-item">
                          <span className="detail-icon">✉️</span>
                          <span>{business.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="business-footer">
                      <div className="rating-display">
                        <span className="stars">
                          {business.rating > 0 ? '⭐'.repeat(Math.round(business.rating)) : '☆☆☆☆☆'}
                        </span>
                        <span className="rating-text">
                          {business.rating > 0 ? business.rating.toFixed(1) : 'No ratings yet'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRatingBusiness(business.id);
                          setUserRating(0);
                        }}
                        className="btn btn-rate"
                      >
                        ⭐ Rate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rating Modal */}
      {ratingBusiness && (
        <div className="modal-overlay" onClick={() => setRatingBusiness(null)}>
          <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Rate this Business</h3>
            <p>How would you rate your experience?</p>
            
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${userRating >= star ? 'active' : ''}`}
                  onClick={() => setUserRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>

            <div className="rating-actions">
              <button
                onClick={() => handleRating(ratingBusiness)}
                className="btn btn-primary"
                disabled={userRating === 0}
              >
                Submit Rating
              </button>
              <button
                onClick={() => {
                  setRatingBusiness(null);
                  setUserRating(0);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="public-footer">
        <div className="container">
          <p>&copy; 2026 Business Diary. All rights reserved.</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
