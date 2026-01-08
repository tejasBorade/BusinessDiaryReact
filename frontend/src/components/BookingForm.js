import React, { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = ({ business, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    booking_time: '',
    service_type: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://businessdiary-api.tejasborade9594.workers.dev/api/bookings', {
        business_id: business.id,
        ...formData
      });

      if (response.data) {
        alert('Booking request submitted successfully! You will receive a confirmation email once approved.');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    timeSlots.push(time);
    if (hour < 18) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  return (
    <div className="booking-form-overlay" onClick={onClose}>
      <div className="booking-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-form-header">
          <h2>📅 Book Appointment</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="business-info">
          <h3>{business.name}</h3>
          <p>📍 {business.area?.name}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                required
                min={today}
              />
            </div>

            <div className="form-group">
              <label>Time *</label>
              <select
                name="booking_time"
                value={formData.booking_time}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Service Type</label>
            <input
              type="text"
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              placeholder="e.g., Consultation, Photo Shoot, etc."
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Any special requirements or notes..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Submitting...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
