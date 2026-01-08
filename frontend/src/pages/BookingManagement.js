import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingManagement.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled, completed
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://businessdiary-api.tejasborade9594.workers.dev/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://businessdiary-api.tejasborade9594.workers.dev/api/bookings/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Booking ${newStatus} successfully!`);
      fetchBookings(); // Refresh the list
    } catch (err) {
      alert('Failed to update booking status');
      console.error(err);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', icon: '⏳', text: 'Pending' },
      confirmed: { class: 'status-confirmed', icon: '✓', text: 'Confirmed' },
      cancelled: { class: 'status-cancelled', icon: '✕', text: 'Cancelled' },
      completed: { class: 'status-completed', icon: '✓', text: 'Completed' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBookingStats = () => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
  };

  const stats = getBookingStats();

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="booking-management">
      <div className="page-header">
        <h1>📅 Booking Management</h1>
        <p>Manage all your appointment bookings</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-label">Total Bookings</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>
        <div className="stat-card confirmed">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <span className="stat-label">Confirmed</span>
            <span className="stat-value">{stats.confirmed}</span>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <button 
          className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >
          All ({bookings.length})
        </button>
        <button 
          className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('pending')}
        >
          Pending ({stats.pending})
        </button>
        <button 
          className={filter === 'confirmed' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({stats.confirmed})
        </button>
        <button 
          className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('completed')}
        >
          Completed ({stats.completed})
        </button>
        <button 
          className={filter === 'cancelled' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({stats.cancelled})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No bookings found</h3>
          <p>There are no {filter !== 'all' ? filter : ''} bookings at the moment.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div>
                  <h3>{booking.business.name}</h3>
                  <span className="business-category">
                    {booking.business.category?.name}
                  </span>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="detail-label">👤 Customer:</span>
                  <span className="detail-value">{booking.customer_name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">{booking.customer_email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📞 Phone:</span>
                  <span className="detail-value">{booking.customer_phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📅 Date:</span>
                  <span className="detail-value">{formatDate(booking.booking_date)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⏰ Time:</span>
                  <span className="detail-value">{booking.booking_time}</span>
                </div>
                {booking.service_type && (
                  <div className="detail-row">
                    <span className="detail-label">🛠️ Service:</span>
                    <span className="detail-value">{booking.service_type}</span>
                  </div>
                )}
                {booking.message && (
                  <div className="detail-row message">
                    <span className="detail-label">💬 Message:</span>
                    <span className="detail-value">{booking.message}</span>
                  </div>
                )}
              </div>

              <div className="booking-footer">
                <small className="booking-date">
                  Created: {new Date(booking.created_at).toLocaleString()}
                </small>
                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="btn-action btn-confirm"
                      >
                        ✓ Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="btn-action btn-cancel"
                      >
                        ✕ Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      className="btn-action btn-complete"
                    >
                      ✓ Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
