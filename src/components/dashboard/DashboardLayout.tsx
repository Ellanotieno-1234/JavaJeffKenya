'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Bell, Settings, Menu, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3);

  const menuItems = [
    { name: 'Dashboard', icon: '📊', glow: true },
    { name: 'Inventory', icon: '📦' },
    { name: 'Orders', icon: '📝' },
    { name: 'Analytics', icon: '📈' },
    { name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-float" style={{ animationDelay: '-1.5s' }}></div>
      </div>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed left-0 top-0 h-full glass-panel z-30 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } animate-smooth`}
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {isSidebarOpen ? (
              <h1 className="text-xl font-bold gradient-text">Aviation Parts</h1>
            ) : (
              <span className="text-2xl">✈️</span>
            )}
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 animate-smooth"
            >
              <Menu size={20} className="text-white" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ x: 5 }}
                className={`w-full p-3 flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg animate-smooth ${
                  item.glow ? 'glow-text' : ''
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1">
                    <span>{item.name}</span>
                    <ChevronRight size={16} className="text-white/40" />
                  </div>
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <div className="glass-panel sticky top-0 z-20 p-4 mx-4 mt-4 flex items-center justify-between backdrop-blur-2xl">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search parts, orders, or requirements..."
                className="w-full glass-input py-2 px-4 pl-10 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-500/40 outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10 rounded-lg animate-smooth glass-input"
            >
              <Filter size={20} className="text-white" />
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10 rounded-lg animate-smooth relative glass-input"
            >
              <Bell size={20} className="text-white" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white glow">
                  {notifications}
                </span>
              )}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10 rounded-lg animate-smooth glass-input"
            >
              <Settings size={20} className="text-white" />
            </motion.button>
            <div className="w-px h-6 bg-white/20" />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg animate-smooth glass-input"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                JD
              </div>
              {isSidebarOpen && (
                <span className="text-white">John Doe</span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
