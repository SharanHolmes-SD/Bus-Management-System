import React, { useState, useEffect } from 'react'
import Logo from '../assets/Images/logo-invert.png'
import AppleLogo from '../assets/Images/apple-store.svg'
import GooglePlay from '../assets/Images/google-play.svg'
import { User, LogOut, UserCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function Header() {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    toast.success("Logout successfully")
    navigate('/');
    setShowProfilePopup(false);
  };

  return (
    <div className='z-20 bg-black w-full h-[5rem] top-0 right-0 left-0 fixed'>
      <div className='p-4 flex flex-row justify-between items-center mx-4 md:mx-20'>
        <img src={Logo} alt="logo" className='w-24 md:w-auto'/>
        
        <div className='flex flex-row gap-2 md:gap-4 items-center'>
          <div className='hidden md:flex flex-row gap-4 items-center'>
            <img src={AppleLogo} alt="applelogo" className='w-[8rem]'/>
            <img src={GooglePlay} alt="googleplay" className='w-[8rem]'/>
          </div>
          
          {/* User Profile Button */}
          <div className='relative'>
            <button 
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/login');
                } else {
                  setShowProfilePopup(!showProfilePopup);
                }
              }}
              className='border-2 border-white rounded-full p-2 hover:bg-gray-800 transition-colors'
            >
              <User className='text-white w-5 h-5'/>
            </button>

            {/* Profile Popup - Only shows when logged in */}
            {isLoggedIn && showProfilePopup && (
              <div className='absolute right-0 mt-2 w-[13rem] bg-white rounded-lg shadow-lg py-1 z-50'>
                <div className='flex justify-end px-4 py-2'>
                  <button 
                    onClick={() => setShowProfilePopup(false)}
                    className='text-gray-500 hover:text-gray-700'
                  >
                    <X className='w-4 h-4'/>
                  </button>
                </div>
                <div className='px-4 py-2 border-b border-gray-200'>
                  <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                      <UserCircle className='w-6 h-6 text-gray-600'/>
                    </div>
                    <div>
                      <p className='font-poppins font-medium text-gray-900'>
                        {localStorage.getItem('userEmail')?.split('@')[0] || 'User'}
                      </p>
                      <p className='font-poppins text-xs text-gray-500'>
                        {localStorage.getItem('userEmail') || ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='py-2'>
                  <button 
                    className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2'
                    onClick={() => {
                      navigate('/profile');
                      setShowProfilePopup(false);
                    }}
                  >
                    <UserCircle className='w-4 h-4'/>
                    View Profile
                  </button>
                  <button 
                    className='w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2'
                    onClick={handleLogout}
                  >
                    <LogOut className='w-4 h-4'/>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header