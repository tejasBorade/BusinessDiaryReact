import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { businessService, categoryService, areaService } from '../services';
import './BusinessList.css';

const BusinessList = () => {
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

  useEffect(() => {
    fetchCategories();
    fetchAreas();
  }, []);

  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.subcategory_id) params.subcategory_id = filters.subcategory_id;
      if (filters.area_id) params.area_id = filters.area_id;
      
      const data = await businessService.getBusinesses(params);
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

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(`https://businessdiary-api.tejasborade9594.workers.dev/api/subcategories/category/${categoryId}`);
      const data = await response.json();
      setSubcategories(data.subcategories || []);
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
        const response = await fetch(`https://businessdiary-api.tejasborade9594.workers.dev/api/subcategories/category/${category.id}`);
        const data = await response.json();
        setDisplaySubcategories(data.subcategories || []);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setDisplaySubcategories([]);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // If category changes, fetch subcategories and reset subcategory filter
    if (name === 'category_id') {
      setFilters({ ...filters, [name]: value, subcategory_id: '', page: 1 });
      if (value) {
        fetchSubcategories(value);
      } else {
        setSubcategories([]);
      }
    } else {
      setFilters({ ...filters, [name]: value, page: 1 });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBusinesses();
  };

  const getDefaultImage = () => {
    return 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop';
  };

  return (
    <PageLayout>
      <div className="business-list-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Find Local Businesses</h1>
            <p className="hero-subtitle">Discover trusted services and businesses near you</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="filters-wrapper">
          <div className="container">
            <div className="filters-card">
              <form onSubmit={handleSearch} className="filters-grid">
                <div className="filter-group">
                  <label>🔍 Search</label>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search businesses..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label>📁 Category</label>
                  <select
                    name="category_id"
                    value={filters.category_id}
                    onChange={handleFilterChange}
                    className="filter-select"
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
                      name="subcategory_id"
                      value={filters.subcategory_id}
                      onChange={handleFilterChange}
                      className="filter-select"
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
                    name="area_id"
                    value={filters.area_id}
                    onChange={handleFilterChange}
                    className="filter-select"
                  >
                    <option value="">All Areas</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}, {area.city}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Categories Showcase */}
        <div className="categories-section">
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
                  <div className="category-icon">{category.icon || '📦'}</div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description || 'Browse listings'}</p>
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
                        document.querySelector('.business-grid')?.scrollIntoView({ behavior: 'smooth' });
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
        </div>

        {/* Business Grid */}
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading businesses...</p>
            </div>
          ) : businesses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h2>No businesses found</h2>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h2>{businesses.length} {businesses.length === 1 ? 'Business' : 'Businesses'} Found</h2>
              </div>
              <div className="business-grid">
                {businesses.map((business) => (
                  <Link
                    key={business.id}
                    to={`/businesses/${business.id}`}
                    className="business-card-link"
                  >
                    <div className="business-card">
                      <div className="business-image-container">
                        <img
                          src={business.image_url || getDefaultImage()}
                          alt={business.name}
                          className="business-image"
                          onError={(e) => {
                            e.target.src = getDefaultImage();
                          }}
                        />
                        {business.is_verified && (
                          <div className="verified-badge-overlay">
                            <span className="verified-icon">✓</span>
                          </div>
                        )}
                      </div>

                      <div className="business-card-content">
                        <div className="business-header">
                          <h3 className="business-name">{business.name}</h3>
                          {business.category && (
                            <span className="category-badge">
                              {business.category.icon} {business.category.name}
                            </span>
                          )}
                        </div>

                        <div className="business-location">
                          <span className="location-icon">📍</span>
                          {business.area?.name}, {business.area?.city}
                        </div>

                        {business.description && (
                          <p className="business-description">
                            {business.description.length > 100
                              ? business.description.substring(0, 100) + '...'
                              : business.description}
                          </p>
                        )}

                        <div className="business-footer">
                          <div className="rating-section">
                            {business.rating > 0 ? (
                              <>
                                <span className="stars">
                                  {'★'.repeat(Math.round(business.rating))}
                                  {'☆'.repeat(5 - Math.round(business.rating))}
                                </span>
                                <span className="rating-text">
                                  {business.rating.toFixed(1)} ({business.total_reviews})
                                </span>
                              </>
                            ) : (
                              <span className="no-rating">No reviews yet</span>
                            )}
                          </div>

                          {business.phone && (
                            <div className="phone-section">
                              <span className="phone-icon">📞</span>
                              {business.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default BusinessList;
