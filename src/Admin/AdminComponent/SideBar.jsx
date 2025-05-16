import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bus, 
  Users, 
  Route, 
  DollarSign,
  LogOut,
  MapPin,
  UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Logout successfully")
    navigate('/');
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white font-poppins fixed left-0 top-0 shadow-lg flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-center">Admin Panel</h2>
      </div>
      <ul className="py-4 flex flex-col gap-10 flex-grow">
        <li>
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
              isActive('/admin/dashboard') ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/bus-details" 
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
              isActive('/admin/bus-details') ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <Bus className="w-5 h-5 mr-3" />
            Bus Details
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/route-details" 
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
              isActive('/admin/route-details') ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <MapPin className="w-5 h-5 mr-3" />
            Route Details
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/user-details" 
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
              isActive('/admin/user-details') ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            User Details
          </Link>
        </li>
        {/* <li>
          <Link 
            to="/admin/trip-details" 
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
              isActive('/admin/trip-details') ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <Route className="w-5 h-5 mr-3" />
            Trip Details
          </Link>
        </li> */}

<li>
          <Link 
            to="/admin/salary-details" 
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
              isActive('/admin/trip-details') ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <Route className="w-5 h-5 mr-3" />
            Salary Details
          </Link>
        </li>

        <li>
          <Link 
            to="/admin/income-details" 
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
              isActive('/admin/income-details') ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <DollarSign className="w-5 h-5 mr-3" />
            Inventory Details
          </Link>
        </li>

        <li>
          <Link 
            to="/admin/staff-management" 
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
              isActive('/admin/staff-management') ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <UserPlus className="w-5 h-5 mr-3" />
            Staff Management
          </Link>
        </li>
      </ul>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default SideBar;
