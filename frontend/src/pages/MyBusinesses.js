import React from 'react';
import Navbar from '../components/Navbar';

const MyBusinesses = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>My Businesses</h1>
        <div className="card">
          <p>Business management interface - Coming Soon</p>
          <p>Features:</p>
          <ul>
            <li>View your businesses</li>
            <li>Add new business</li>
            <li>Edit business details</li>
            <li>Manage business hours</li>
            <li>View business analytics</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MyBusinesses;
