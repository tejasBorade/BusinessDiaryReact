import React from 'react';
import Navbar from '../components/Navbar';

const CategoryManagement = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Category Management</h1>
        <div className="card">
          <p>Category management interface - Coming Soon</p>
          <p>Features:</p>
          <ul>
            <li>View all categories</li>
            <li>Create new categories</li>
            <li>Edit category details</li>
            <li>Add category icons</li>
            <li>View businesses by category</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CategoryManagement;
