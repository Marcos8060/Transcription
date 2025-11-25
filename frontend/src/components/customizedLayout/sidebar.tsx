"use client";
import React from "react";
import MenuChildren from "./menuchildren";
import { LogOut } from 'lucide-react'

interface SidebarProps {
  collapse: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ collapse, setCollapse, icon }) => {
  const toggleSidebar = () => {
    setCollapse(!collapse);
  };

  const handleLogout = () => {
    // TODO: implement logout (clear cookies, redirect, etc.)
  };

  return (
    <section className="bg-white shadow-lg h-screen transition-all duration-300 relative">
      {/* Logo Section */}
      <div className="h-[8vh] flex items-center justify-center px-6 border-b border-input">
        {!collapse && (
          <div className="flex items-center space-x-2">
            {/* Replace with your actual logo */}
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <h1 className="text-primary font-semibold">Nexus</h1>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`absolute -right-3 top-4 bg-white rounded-full p-1 shadow-md border border-input transition-all duration-300 hover:bg-gray-50 ${
          collapse ? "rotate-180" : ""
        }`}
      >
        {icon}
      </button>

      {/* Menu Items */}
      <div className="space-y-4 py-6 px-4">
        <MenuChildren collapse={collapse} />
      </div>

      {/* Bottom Section */}
      {!collapse && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full text-xs text-slate-600 border border-input rounded-sm py-2 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </section>
  );
};

export default Sidebar;
