import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  function userLogin(e) {
    e.preventDefault();
    axios.post(import.meta.env.VITE_BACKEND_URL +'/api/users/login', {
      email,
      password,
    })
    .then((res) => {
      if (res.data.user == null) {
        console.error(res.data.message);
        return;
      }
      toast.success("Login Successfully")
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      console.log('Login successful, token:', res.data.token);
      console.log('Login successful, userId:', res.data.user._id);
      navigate(res.data.user.type === 'admin' ? '/admin' : '/');
      })
    .catch((error) => {
      console.error('Login error:', error);
    });
  }

  
  return (
    <div className="min-h-screen flex font-poppins items-center justify-center bg-radial from-yellow-900 from-1% to-black">
      <div className="bg-white p-8 shadow-md w-full max-w-sm border border-gray-300">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={userLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
            <div className="flex items-center border border-gray-400 bg-white px-3 py-2">
              <Mail className="text-gray-500 w-4 h-4 mr-2" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="flex items-center border border-gray-400 bg-white px-3 py-2 rounded">
              <Lock className="text-gray-500 w-4 h-4 mr-2" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm focus:outline-none bg-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
              </button>
            </div>
          </div>
          <div className='text-xs text-center'>
            <h1>You Don't have an account? <Link to="/register"><span className='font-poppinsMedium text-blue-600'>Sign up</span></Link></h1>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 text-sm tracking-wide hover:bg-black transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
