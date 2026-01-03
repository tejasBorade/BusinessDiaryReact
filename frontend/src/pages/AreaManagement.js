import React from 'react';
import Navbar from '../components/Navbar';

const AreaManagement = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Area Management</h1>
        <div className="card">
          <p>Area management interface - Coming Soon</p>
          <p>Features:</p>
          <ul>
            <li>View all areas</li>
            <li>Create new areas</li>
            <li>Edit area details</li>
            <li>Assign area managers</li>
            <li>View businesses by area</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AreaManagement;
