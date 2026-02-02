'use client';

import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0 print:min-h-0">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0 print:mx-0">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
