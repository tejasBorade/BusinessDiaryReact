import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './BusinessDetail.css';

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBusinessDetail();
  }, [id]);

  const fetchBusinessDetail = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/businesses/${id}`);
      setBusiness(response.data.business);
    } catch (error) {
      console.error('Error fetching business:', error);
      setError('Business not found');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:5000/api/businesses/${id}/rate`, {
        rating: reviewForm.rating
      });
      alert('Thank you for your rating!');
      setReviewForm({ rating: 5, comment: '' });
      fetchBusinessDetail();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  if (loading) {
    return (
      <div className="public-page-wrapper">
        <div className="loading">Loading business details...</div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="public-page-wrapper">
        <header className="public-header">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <span className="logo-icon">📒</span>
              <span className="logo-text">Business Diary</span>
            </div>
            <nav className="header-nav">
              {!user ? (
                <>
                  <button onClick={() => navigate('/login')} className="btn btn-outline">Login</button>
                  <button onClick={() => navigate('/register')} className="btn btn-primary">Sign Up</button>
                </>
              ) : (
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Dashboard</button>
              )}
            </nav>
          </div>
        </header>
        <div className="container">
          <div className="alert alert-error">{error || 'Business not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-page-wrapper">
      <header className="public-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">📒</span>
            <span className="logo-text">Business Diary</span>
          </div>
          <nav className="header-nav">
            {!user ? (
              <>
                <button onClick={() => navigate('/login')} className="btn btn-outline">Login</button>
                <button onClick={() => navigate('/register')} className="btn btn-primary">Sign Up</button>
              </>
            ) : (
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Dashboard</button>
            )}
          </nav>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '40px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-back">
          ← Back
        </button>

        <div className="business-detail-card">
          <div className="business-detail-header">
            <div>
              <h1>{business.name}</h1>
              <p className="category-badge">{business.category?.name}</p>
            </div>
            {business.is_verified && (
              <span className="verified-badge-large">✓ Verified</span>
            )}
          </div>

          <div className="business-info-grid">
            <div className="info-section">
              <h3>Contact Information</h3>
              <p>📞 <strong>Phone:</strong> {business.phone}</p>
              {business.email && <p>✉️ <strong>Email:</strong> {business.email}</p>}
              {business.website && (
                <p>🌐 <strong>Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>
              )}
              <p>📍 <strong>Address:</strong> {business.address}</p>
              <p><strong>Area:</strong> {business.area?.name}, {business.area?.city}, {business.area?.state}</p>
            </div>

            <div className="info-section">
              <h3>Rating & Reviews</h3>
              <div className="rating-display">
                <span className="rating-number">{business.rating.toFixed(1)}</span>
                <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                <span className="review-count">{business.total_reviews} reviews</span>
              </div>
            </div>
          </div>

          {business.description && (
            <div className="info-section">
              <h3>About</h3>
              <p>{business.description}</p>
            </div>
          )}

          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            
            <div className="review-form-card">
              <h4>Write a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Rating</label>
                  <select
                    className="form-control"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Comment</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Share your experience..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            </div>

            <div className="reviews-list">
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <strong>{review.user?.full_name}</strong>
                      <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <p className="review-date">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
