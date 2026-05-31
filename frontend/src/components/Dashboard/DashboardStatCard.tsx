import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
  bgClass: string;
  to: string;
}

export const DashboardStatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass, bgClass, to }) => (
  <Link to={to} className="no-underline block group">
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div
        className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0 ${colorClass} group-hover:scale-110 transition-transform duration-200`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium mb-0.5 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      </div>
    </div>
  </Link>
);
