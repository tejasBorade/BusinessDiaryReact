import React, { useState, createContext, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Create Sidebar Context
const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    return { collapsed: false }; // Default value if used outside provider
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard', show: true },
    { path: '/businesses', icon: '🏢', label: 'Businesses', show: true },
    { path: '/my-businesses', icon: '🏪', label: 'My Businesses', show: ['store_owner', 'admin', 'super_admin'].includes(user?.role) },
    { path: '/bookings', icon: '📅', label: 'Bookings', show: ['store_owner', 'admin', 'super_admin'].includes(user?.role) },
    { path: '/users', icon: '👥', label: 'Users', show: ['admin', 'super_admin'].includes(user?.role) },
    { path: '/categories', icon: '📂', label: 'Categories', show: ['admin', 'super_admin'].includes(user?.role) },
    { path: '/areas', icon: '📍', label: 'Areas', show: ['area_manager', 'admin', 'super_admin'].includes(user?.role) },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-emerald-800 to-emerald-900 shadow-2xl transition-all duration-300 z-40 hidden md:flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-5 w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        >
          <span className="text-xs">{collapsed ? '→' : '←'}</span>
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 p-5 border-b border-emerald-700">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            🏪
          </div>
          {!collapsed && <span className="text-xl font-bold text-white">Business Hub</span>}
        </Link>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-emerald-700">
          {menuItems.filter(item => item.show).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-primary-500 text-white shadow-lg scale-105'
                  : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <span className="text-2xl">{item.icon}</span>
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {isActive(item.path) && !collapsed && (
                <span className="ml-auto">✓</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-emerald-700 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">{user?.full_name}</div>
                <div className="text-emerald-300 text-xs capitalize">{user?.role?.replace('_', ' ')}</div>
              </div>
            )}
          </div>

          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-2 mb-2 rounded-xl transition-all ${
              isActive('/profile') ? 'bg-primary-500 text-white' : 'text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <span className="text-xl">⚙️</span>
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-300 hover:bg-red-900/30 transition-all"
          >
            <span className="text-xl">🚪</span>
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="flex items-center justify-between p-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-xl">
              🏪
            </div>
            <span className="text-lg font-bold text-gray-900">Business Hub</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-up">
            <nav className="p-4">
              {menuItems.filter(item => item.show).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl ${
                    isActive(item.path)
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl text-gray-700 hover:bg-gray-100"
                >
                  <span className="text-xl">⚙️</span>
                  <span className="font-medium">Settings</span>
                </Link>
                
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
