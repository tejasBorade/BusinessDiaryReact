import React from 'react';
import Navbar from './Navbar';

const PageLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {children}
      </div>
    </>
  );
};

export default PageLayout;
