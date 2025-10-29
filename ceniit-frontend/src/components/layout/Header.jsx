import React from 'react';
import { Bell, Search } from 'lucide-react';

export const Header = ({ title = 'Dashboard' }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="relative">
            <Bell className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};