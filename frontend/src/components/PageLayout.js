import React from 'react';
import Navbar, { useSidebar } from './Navbar';

const PageLayout = ({ children }) => {
  const { collapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className={`transition-all duration-300 pt-0 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="md:hidden h-16"></div> {/* Mobile header spacer */}
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
