import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AIChat from './components/AIChat';
import ThemeCustomizer from './components/ThemeCustomizer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BusinessList from './pages/BusinessList';
import BusinessDetail from './pages/BusinessDetail';
import UserManagement from './pages/UserManagement';
import AreaManagement from './pages/AreaManagement';
import CategoryManagement from './pages/CategoryManagement';
import MyBusinesses from './pages/MyBusinesses';
import Profile from './pages/Profile';
import BookingManagement from './pages/BookingManagement';

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/business/:id" element={<BusinessDetail />} />
          
          <Route path="/businesses" element={
            <PrivateRoute>
              <BusinessList />
            </PrivateRoute>
          } />
          
          <Route path="/businesses/:id" element={
            <PrivateRoute>
              <BusinessDetail />
            </PrivateRoute>
          } />
          
          <Route path="/my-businesses" element={
            <PrivateRoute roles={['store_owner', 'admin', 'super_admin']}>
              <MyBusinesses />
            </PrivateRoute>
          } />
          
          <Route path="/users" element={
            <PrivateRoute roles={['admin', 'super_admin']}>
              <UserManagement />
            </PrivateRoute>
          } />
          
          <Route path="/bookings" element={
            <PrivateRoute roles={['store_owner', 'admin', 'super_admin']}>
              <BookingManagement />
            </PrivateRoute>
          } />
          
          <Route path="/areas" element={
            <PrivateRoute roles={['admin', 'super_admin', 'area_manager']}>
              <AreaManagement />
            </PrivateRoute>
          } />
          
          <Route path="/categories" element={
            <PrivateRoute roles={['admin', 'super_admin']}>
              <CategoryManagement />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
        </Routes>
        <AIChat />
        <ThemeCustomizer />
        {/* Debug: ThemeCustomizer should render */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'red',
          color: 'white',
          padding: '10px',
          zIndex: 99999
        }}>
          Test Component Loaded
        </div>
      </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
