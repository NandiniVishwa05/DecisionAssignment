import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#f8f8f6]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-h-0">
        {children}
      </main>
    </div>
  );
};
