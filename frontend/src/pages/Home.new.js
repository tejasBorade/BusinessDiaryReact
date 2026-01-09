import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://businessdiary-api.tejasborade9594.workers.dev';

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchBusinesses();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/businesses`);
      setBusinesses(response.data.businesses || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/businesses?search=${searchTerm}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/businesses?category_id=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Top Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-2xl shadow-md">
                🏪
              </div>
              <span className="text-xl font-bold text-gray-900">Business Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2 text-sm font-medium text-white bg-primary-500 rounded-full hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Clean Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find the Best
            <span className="block text-primary-600">Local Businesses</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover trusted businesses near you. From restaurants to services, everything you need in one place.
          </p>

          {/* Modern Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for businesses, services, or categories..."
                className="flex-1 px-6 py-4 text-base bg-transparent border-none outline-none rounded-full text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                className="mr-2 px-8 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✓</span>
              <span>1000+ Businesses</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span>Verified Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📍</span>
              <span>Local & Trusted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Category Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                  {category.icon || '📦'}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Businesses</h2>
            <p className="text-gray-600">Highly rated and trusted by the community</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {businesses.slice(0, 8).map((business) => (
                <div
                  key={business.id}
                  onClick={() => navigate(`/businesses/${business.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {business.image_url ? (
                      <img
                        src={business.image_url}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🏢
                      </div>
                    )}
                    {business.rating > 0 && (
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-semibold text-gray-900">{business.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {business.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {business.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-1">📍</span>
                      <span className="line-clamp-1">{business.area_name || business.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/businesses')}
              className="px-8 py-3 bg-white border-2 border-primary-500 text-primary-600 rounded-full font-semibold hover:bg-primary-500 hover:text-white transition-all shadow-md hover:shadow-lg"
            >
              View All Businesses
            </button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-xl">
                  🏪
                </div>
                <span className="font-bold text-gray-900">Business Hub</span>
              </div>
              <p className="text-sm text-gray-600">
                Your trusted platform for finding local businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary-600">About Us</a></li>
                <li><a href="#" className="hover:text-primary-600">Contact</a></li>
                <li><a href="#" className="hover:text-primary-600">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">For Business</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary-600">List Your Business</a></li>
                <li><a href="#" className="hover:text-primary-600">Business Login</a></li>
                <li><a href="#" className="hover:text-primary-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary-600">Facebook</a></li>
                <li><a href="#" className="hover:text-primary-600">Instagram</a></li>
                <li><a href="#" className="hover:text-primary-600">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            © 2026 Business Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
