import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../AdminLayout/AdminLayout';
import Dashboard from '../AdminPages/Dashboard';
import BusDetails from '../AdminPages/BusDetails';
import UserDetailPage from '../AdminPages/UserDetailPage';
// import TripDetailsPage from '../AdminPages/TripDetailsPage';
import IncomeDetails from '../AdminPages/Inventory';
import RouteDetails from '../AdminPages/RouteDetails';
import SalaryManagement from '../AdminPages/SalaryDetails';
import StaffManagement from '../AdminPages/StaffManagement';

function AdminRoute() {
  // Define a wrapper component to protect the admin routes
  const ProtectedAdminLayout = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      // Check for authentication token
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not a valid user. Please login again.");
        navigate("/login");
        return;
      }

      // Verify admin status via API
      axios.get(import.meta.env.VITE_BACKEND_URL + '/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.data.type == "admin") {
            
            navigate("/admin");
          } else {
            setIsAdmin(true);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to fetch user data");
          navigate("/login");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [navigate]);

    // Show loading state while checking authentication
    if (isLoading) {
      return <div>Loading...</div>;
    }

    // If not an admin, return null (navigation handles redirection)
    if (!isAdmin) {
      return null;
    }

    // If authenticated and admin, render the AdminLayout
    return <AdminLayout />;
  };

  return (
    <Routes>
      <Route path="/" element={<ProtectedAdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bus-details" element={<BusDetails />} />
        <Route path="user-details" element={<UserDetailPage />} />
        <Route path="income-details" element={<IncomeDetails />} />
        <Route path='salary-details' element={<SalaryManagement/>}/>
        <Route path="route-details" element={<RouteDetails />} />
        <Route path="staff-management" element={<StaffManagement />} />
        {/* Add other admin routes here as they are created */}
      </Route>
    </Routes>
  );
}

export default AdminRoute;