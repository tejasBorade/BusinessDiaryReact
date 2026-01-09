import React from 'react';
import Navbar from './Navbar';

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="md:ml-64 transition-all duration-300 pt-0 md:pt-0">
        <div className="md:hidden h-16"></div> {/* Mobile header spacer */}
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
