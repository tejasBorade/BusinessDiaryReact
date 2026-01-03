import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Business Diary
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/businesses" className="nav-link">Businesses</Link>
          
          {user && (user.role === 'store_owner' || user.role === 'admin' || user.role === 'super_admin') && (
            <Link to="/my-businesses" className="nav-link">My Businesses</Link>
          )}
          
          {user && (user.role === 'admin' || user.role === 'super_admin') && (
            <>
              <Link to="/users" className="nav-link">Users</Link>
              <Link to="/categories" className="nav-link">Categories</Link>
            </>
          )}
          
          {user && (user.role === 'area_manager' || user.role === 'admin' || user.role === 'super_admin') && (
            <Link to="/areas" className="nav-link">Areas</Link>
          )}
          
          <div className="navbar-user">
            <span className="user-name">{user?.full_name} ({user?.role})</span>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
