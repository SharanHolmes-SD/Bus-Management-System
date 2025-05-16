import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../AdminComponent/SideBar';
import BusDetails from '../AdminPages/BusDetails';

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
