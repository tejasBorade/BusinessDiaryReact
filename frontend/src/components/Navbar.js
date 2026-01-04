import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle" 
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <span className="toggle-icon">{collapsed ? '☰' : '✕'}</span>
      </button>

      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-brand">
          <span className="brand-icon">📒</span>
          {!collapsed && <span className="brand-text">Business Diary</span>}
        </Link>
      </div>

      <div className="sidebar-menu">
        <Link 
          to="/dashboard" 
          className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
          title="Dashboard"
        >
          <span className="link-icon">📊</span>
          {!collapsed && <span className="link-text">Dashboard</span>}
        </Link>

        <Link 
          to="/businesses" 
          className={`sidebar-link ${isActive('/businesses') ? 'active' : ''}`}
          title="Businesses"
        >
          <span className="link-icon">🏢</span>
          {!collapsed && <span className="link-text">Businesses</span>}
        </Link>

        {user && (user.role === 'store_owner' || user.role === 'admin' || user.role === 'super_admin') && (
          <Link 
            to="/my-businesses" 
            className={`sidebar-link ${isActive('/my-businesses') ? 'active' : ''}`}
            title="My Businesses"
          >
            <span className="link-icon">🏪</span>
            {!collapsed && <span className="link-text">My Businesses</span>}
          </Link>
        )}

        {user && (user.role === 'store_owner' || user.role === 'admin' || user.role === 'super_admin') && (
          <Link 
            to="/bookings" 
            className={`sidebar-link ${isActive('/bookings') ? 'active' : ''}`}
            title="Bookings"
          >
            <span className="link-icon">📅</span>
            {!collapsed && <span className="link-text">Bookings</span>}
          </Link>
        )}

        {user && (user.role === 'admin' || user.role === 'super_admin') && (
          <>
            <Link 
              to="/users" 
              className={`sidebar-link ${isActive('/users') ? 'active' : ''}`}
              title="Users"
            >
              <span className="link-icon">👥</span>
              {!collapsed && <span className="link-text">Users</span>}
            </Link>

            <Link 
              to="/categories" 
              className={`sidebar-link ${isActive('/categories') ? 'active' : ''}`}
              title="Categories"
            >
              <span className="link-icon">📂</span>
              {!collapsed && <span className="link-text">Categories</span>}
            </Link>
          </>
        )}

        {user && (user.role === 'area_manager' || user.role === 'admin' || user.role === 'super_admin') && (
          <Link 
            to="/areas" 
            className={`sidebar-link ${isActive('/areas') ? 'active' : ''}`}
            title="Areas"
          >
            <span className="link-icon">📍</span>
            {!collapsed && <span className="link-text">Areas</span>}
          </Link>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">{user?.full_name}</div>
              <div className="user-role">{user?.role?.replace('_', ' ')}</div>
            </div>
          )}
        </div>

        <Link 
          to="/profile" 
          className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
          title="Profile"
        >
          <span className="link-icon">⚙️</span>
          {!collapsed && <span className="link-text">Profile</span>}
        </Link>

        <button 
          onClick={handleLogout} 
          className="sidebar-link logout-btn"
          title="Logout"
        >
          <span className="link-icon">🚪</span>
          {!collapsed && <span className="link-text">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
