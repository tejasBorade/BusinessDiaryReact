import React from 'react';
import Navbar from '../components/Navbar';

const UserManagement = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>User Management</h1>
        <div className="card">
          <p>User management interface - Coming Soon</p>
          <p>Features:</p>
          <ul>
            <li>View all users</li>
            <li>Create new users</li>
            <li>Edit user details</li>
            <li>Activate/Deactivate users</li>
            <li>Assign roles</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
