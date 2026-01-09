# Modern UI Design Samples - Light Green Theme

## Color Palette 🎨

```css
:root {
  /* Primary Green Shades */
  --primary-green: #10b981;        /* Emerald green */
  --primary-light: #6ee7b7;        /* Light green */
  --primary-dark: #059669;         /* Dark green */
  --primary-pale: #d1fae5;         /* Very light green */
  
  /* Accent Colors */
  --accent-mint: #a7f3d0;          /* Mint green */
  --accent-teal: #5eead4;          /* Teal */
  
  /* Neutral Colors */
  --white: #ffffff;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-600: #4b5563;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Gradients */
  --gradient-green: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-light: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  --gradient-hero: linear-gradient(135deg, #10b981 0%, #5eead4 100%);
}
```

---

## 1. Home Page - Hero Section

### Modern Hero with Search
```jsx
// Modern Hero Component
<div className="hero-section">
  <div className="hero-content">
    <h1 className="hero-title">
      Find the Best <span className="highlight">Businesses</span> Near You
    </h1>
    <p className="hero-subtitle">
      Discover local restaurants, doctors, services, and more
    </p>
    
    {/* Modern Search Bar */}
    <div className="search-container">
      <div className="search-box">
        <input 
          type="text" 
          placeholder="What are you looking for?" 
          className="search-input"
        />
        <button className="search-button">
          <svg>🔍</svg>
          Search
        </button>
      </div>
      
      {/* Quick Filters */}
      <div className="quick-filters">
        <button className="filter-chip">🍽️ Restaurants</button>
        <button className="filter-chip">🏥 Doctors</button>
        <button className="filter-chip">💇 Salons</button>
        <button className="filter-chip">🔧 Services</button>
      </div>
    </div>
    
    {/* Stats */}
    <div className="stats-row">
      <div className="stat-item">
        <div className="stat-number">1000+</div>
        <div className="stat-label">Businesses</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">50+</div>
        <div className="stat-label">Categories</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">10K+</div>
        <div className="stat-label">Happy Users</div>
      </div>
    </div>
  </div>
</div>
```

### CSS for Hero
```css
.hero-section {
  background: linear-gradient(135deg, #10b981 0%, #5eead4 100%);
  padding: 120px 20px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg>...</svg>') repeat;
  opacity: 0.1;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(to right, #fff, #d1fae5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.hero-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
}

/* Modern Search Box */
.search-container {
  max-width: 700px;
  margin: 0 auto 40px;
}

.search-box {
  background: white;
  border-radius: 50px;
  padding: 8px;
  display: flex;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.search-box:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
}

.search-input {
  flex: 1;
  border: none;
  padding: 18px 25px;
  font-size: 16px;
  outline: none;
  background: transparent;
}

.search-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 18px 35px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

/* Quick Filters */
.quick-filters {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.filter-chip {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.filter-chip:hover {
  background: white;
  color: #10b981;
  transform: translateY(-2px);
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 40px;
  max-width: 600px;
  margin: 0 auto;
  padding-top: 20px;
}

.stat-item {
  color: white;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .search-box {
    flex-direction: column;
    border-radius: 20px;
  }
  
  .search-button {
    width: 100%;
    justify-content: center;
  }
}
```

---

## 2. Business Card - Modern Design

```jsx
// Modern Business Card Component
<div className="business-card">
  <div className="card-badge">⭐ 4.5</div>
  
  <div className="card-image">
    <img src={business.image_url} alt={business.name} />
    <div className="image-overlay">
      <button className="quick-action">
        <svg>🔖</svg>
      </button>
      <button className="quick-action">
        <svg>❤️</svg>
      </button>
    </div>
  </div>
  
  <div className="card-content">
    <div className="card-header">
      <h3 className="card-title">{business.name}</h3>
      <span className="verified-badge">✓ Verified</span>
    </div>
    
    <p className="card-description">{business.description}</p>
    
    <div className="card-meta">
      <span className="meta-item">
        <svg>📍</svg> {business.area_name}
      </span>
      <span className="meta-item">
        <svg>🏷️</svg> {business.category_name}
      </span>
    </div>
    
    <div className="card-actions">
      <button className="btn-primary">View Details</button>
      <button className="btn-secondary">
        <svg>📞</svg>
      </button>
      <button className="btn-secondary">
        <svg>📅</svg>
      </button>
    </div>
  </div>
</div>
```

### CSS for Business Card
```css
.business-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.business-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(16, 185, 129, 0.15);
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 8px 15px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.card-image {
  height: 220px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.business-card:hover .card-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.business-card:hover .image-overlay {
  opacity: 1;
}

.quick-action {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 20px;
}

.quick-action:hover {
  background: #10b981;
  transform: scale(1.1);
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.verified-badge {
  background: #d1fae5;
  color: #059669;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.card-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f3f4f6;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.btn-secondary {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 20px;
}

.btn-secondary:hover {
  background: #d1fae5;
  color: #10b981;
}
```

---

## 3. Modern Dashboard

```jsx
// Dashboard Component
<div className="dashboard-container">
  {/* Header */}
  <div className="dashboard-header">
    <div className="welcome-section">
      <h1>Welcome back, Admin! 👋</h1>
      <p>Here's what's happening with your business today.</p>
    </div>
    <button className="btn-add">
      <svg>+</svg>
      Add New Business
    </button>
  </div>

  {/* Stats Grid */}
  <div className="stats-grid">
    <div className="stat-card green">
      <div className="stat-icon">💼</div>
      <div className="stat-details">
        <div className="stat-value">1,234</div>
        <div className="stat-label">Total Businesses</div>
      </div>
      <div className="stat-trend up">+12%</div>
    </div>
    
    <div className="stat-card blue">
      <div className="stat-icon">👥</div>
      <div className="stat-details">
        <div className="stat-value">5,678</div>
        <div className="stat-label">Active Users</div>
      </div>
      <div className="stat-trend up">+8%</div>
    </div>
    
    <div className="stat-card purple">
      <div className="stat-icon">📅</div>
      <div className="stat-details">
        <div className="stat-value">892</div>
        <div className="stat-label">Bookings Today</div>
      </div>
      <div className="stat-trend up">+23%</div>
    </div>
    
    <div className="stat-card orange">
      <div className="stat-icon">⭐</div>
      <div className="stat-details">
        <div className="stat-value">4.8</div>
        <div className="stat-label">Avg Rating</div>
      </div>
      <div className="stat-trend up">+0.2</div>
    </div>
  </div>
</div>
```

### CSS for Dashboard
```css
.dashboard-container {
  padding: 30px;
  background: #f9fafb;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.welcome-section h1 {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.welcome-section p {
  color: #6b7280;
  font-size: 16px;
}

.btn-add {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.1;
  transition: all 0.3s ease;
}

.stat-card.green::before {
  background: #10b981;
}

.stat-card.blue::before {
  background: #3b82f6;
}

.stat-card.purple::before {
  background: #8b5cf6;
}

.stat-card.orange::before {
  background: #f59e0b;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.stat-card:hover::before {
  width: 150px;
  height: 150px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.stat-card.green .stat-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.stat-card.blue .stat-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.stat-card.purple .stat-icon {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
}

.stat-card.orange .stat-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.stat-details {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.stat-trend {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.stat-trend.up {
  background: #d1fae5;
  color: #059669;
}

.stat-trend.down {
  background: #fee2e2;
  color: #dc2626;
}
```

---

## 4. Modern Navigation Bar

```jsx
// Modern Navbar Component
<nav className="modern-navbar">
  <div className="navbar-container">
    <div className="navbar-brand">
      <div className="logo">
        <span className="logo-icon">🏪</span>
        <span className="logo-text">BusinessHub</span>
      </div>
    </div>
    
    <div className="navbar-menu">
      <a href="/" className="nav-link active">Home</a>
      <a href="/categories" className="nav-link">Categories</a>
      <a href="/businesses" className="nav-link">Businesses</a>
      <a href="/about" className="nav-link">About</a>
    </div>
    
    <div className="navbar-actions">
      <button className="btn-icon">
        <svg>🔔</svg>
        <span className="notification-badge">3</span>
      </button>
      
      <div className="user-menu">
        <img src="/avatar.jpg" alt="User" className="user-avatar" />
        <span className="user-name">John Doe</span>
        <svg className="dropdown-icon">▼</svg>
      </div>
    </div>
  </div>
</nav>
```

### CSS for Navigation
```css
.modern-navbar {
  background: white;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f3f4f6;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-menu {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #10b981;
  background: #f0fdf4;
}

.nav-link.active {
  color: #10b981;
  background: #d1fae5;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  font-size: 20px;
}

.btn-icon:hover {
  background: #d1fae5;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-menu:hover {
  background: #f3f4f6;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #10b981;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.dropdown-icon {
  color: #9ca3af;
  font-size: 12px;
}
```

---

## 5. Modern Forms

```css
/* Modern Form Styling */
.modern-form {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-select {
  appearance: none;
  background-image: url('data:image/svg+xml,...');
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

/* Modern Button */
.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.btn-submit:active {
  transform: translateY(0);
}
```

---

## 6. Modal/Dialog Design

```css
.modern-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  animation: slideUp 0.3s ease;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 24px 30px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
}
```

---

## Implementation Steps:

1. **Update global CSS** with the color palette
2. **Create component files** for each design
3. **Test responsive design** on mobile/tablet
4. **Add smooth animations** and transitions
5. **Optimize images** and assets

Would you like me to implement these designs in your actual React components?
