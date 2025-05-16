import React from 'react';
import Logo from '../assets/Images/logoReal.png';
import AppleLogo from '../assets/Images/apple-store.svg';
import GooglePlay from '../assets/Images/google-play.svg';
import { Facebook, Twitter, Instagram, Mail, Phone, HelpCircle, FileText, Info } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-linear-to-t from-yellow-900 from-1% to-black text-gray-100 px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        {/* Logo and Download Section */}
        <div className="space-y-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img src={Logo} alt="Logo" className="w-36 hover:scale-105 transition-transform duration-300" />
            <p className="text-sm mt-3 text-gray-300 max-w-xs">Your trusted partner for comfortable and reliable bus travel across Sri Lanka.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-medium text-gray-200">Download Our App</h4>
            <div className="flex justify-center md:justify-start gap-3">
              <a href="#" className="hover:scale-95 transition-transform duration-200">
                <img src={AppleLogo} alt="Apple Store" className="h-10" />
              </a>
              <a href="#" className="hover:scale-95 transition-transform duration-200">
                <img src={GooglePlay} alt="Google Play" className="h-10" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center justify-center md:justify-start gap-2">
            <HelpCircle className="w-5 h-5" />
            <span>Quick Links</span>
          </h3>
          <ul className="space-y-3">
            <li>
              <a href="/faq" className="hover:text-blue-300 transition-colors duration-200 flex items-center justify-center md:justify-start gap-2">
                <span>FAQ</span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-300 transition-colors duration-200 flex items-center justify-center md:justify-start gap-2">
                <span>Contact Us</span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-300 transition-colors duration-200 flex items-center justify-center md:justify-start gap-2">
                <Info className="w-4 h-4" />
                <span>About Us</span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-300 transition-colors duration-200 flex items-center justify-center md:justify-start gap-2">
                <FileText className="w-4 h-4" />
                <span>Terms & Conditions</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center justify-center md:justify-start gap-2">
            <Phone className="w-5 h-5" />
            <span>Contact Us</span>
          </h3>
          <div className="space-y-3">
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4" />
              <span>(+94) 76 676 4848</span>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              <span>info@busseat.lk</span>
            </p>
            <p className="text-sm text-gray-300 text-center md:text-left mt-4">
              Available 24/7 for your travel inquiries
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center justify-center md:justify-start gap-2">
            <span>Follow Us</span>
          </h3>
          <div className="flex justify-center md:justify-start gap-5">
            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-colors duration-300 group">
              <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-sky-500 transition-colors duration-300 group">
              <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-pink-600 transition-colors duration-300 group">
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
          
          <div className="pt-6 text-center md:text-left">
            <h4 className="text-sm font-medium mb-2">Subscribe to Newsletter</h4>
            <div className="flex flex-col sm:flex-row gap-2 max-w-xs mx-auto md:mx-0">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 rounded bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} BusSeat.lk. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;