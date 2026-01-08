import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user.role === 'super_admin' || user.role === 'admin') {
        const userStats = await userService.getUserStats();
        setStats(userStats);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      area_manager: 'Area Manager',
      store_owner: 'Store Owner',
      employee: 'Employee',
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="loading">Loading dashboard...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user.full_name}!</h1>
          <p className="role-badge">{getRoleDisplayName(user.role)}</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Profile Information</h3>
            <div className="info-row">
              <span className="label">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Username:</span>
              <span>{user.username}</span>
            </div>
            <div className="info-row">
              <span className="label">Role:</span>
              <span>{getRoleDisplayName(user.role)}</span>
            </div>
          </div>

          {stats && (
            <>
              <div className="dashboard-card stats-card">
                <h3>Total Users</h3>
                <div className="stat-number">{stats.total_users}</div>
                <div className="stat-subtitle">
                  {stats.active_users} active, {stats.inactive_users} inactive
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Users by Role</h3>
                {Object.entries(stats.role_counts).map(([role, count]) => (
                  <div className="info-row" key={role}>
                    <span className="label">{getRoleDisplayName(role)}:</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="dashboard-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <a href="/businesses" className="btn btn-primary">Browse Businesses</a>
              {(user.role === 'store_owner' || user.role === 'admin' || user.role === 'super_admin') && (
                <a href="/my-businesses" className="btn btn-secondary">My Businesses</a>
              )}
              {(user.role === 'admin' || user.role === 'super_admin') && (
                <>
                  <a href="/users" className="btn btn-secondary">Manage Users</a>
                  <a href="/categories" className="btn btn-secondary">Manage Categories</a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
