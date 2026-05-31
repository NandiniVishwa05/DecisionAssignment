import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tag, AlertCircle, CheckSquare } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/' },
  { icon: <CheckSquare size={18} />, label: 'Todos', path: '/todo' },
  { icon: <Tag size={18} />, label: 'Categories', path: '/category' },
  { icon: <AlertCircle size={18} />, label: 'Priorities', path: '/priority' },
];

export const Sidebar: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-[220px] flex-shrink-0 bg-white border-r border-gray-150 flex flex-col h-screen sticky top-0">
      {/* Logo area */}
      <div className="p-7 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <CheckSquare size={18} />
          </div>
          <div>
            <div className="font-bold text-[15px] text-gray-900 leading-tight">
              Todo Manager
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Stay organized
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="p-3.5 px-2.5 flex-1">
        {navItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 py-2 px-3 rounded-lg no-underline text-sm mb-0.5 transition-all ${
                isActive
                  ? 'font-semibold text-indigo-600 bg-indigo-50/70'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              <span className={`transition-opacity duration-150 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 px-5 border-t border-gray-100 text-[12px] text-gray-400">
       Nandini Vishwakarma
      </div>
    </aside>
  );
};
