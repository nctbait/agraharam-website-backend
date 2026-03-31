import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from '../components/LogoutButton';
import api from '../api/authAxios';
import { BellIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { userRole } = useContext(AuthContext);
  const [hasNotifications, setHasNotifications] = useState(false);
  const isLoggedIn = ['user', 'admin', 'superAdmin'].includes(userRole);  
  const navigate = useNavigate();

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await api.get('/api/notifications/unread-count');
        setHasNotifications(res.count > 0);
      } catch (e) {
        console.error('Failed to fetch notifications', e);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 3000000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 lg:px-10">
      <Link to="/" className="flex items-center gap-3 text-black">
          <img
            src="/images/Agraharam_Logo_Transperant_Background.png"
            alt="NCTBA - Agraharam NC"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain shrink-0"
            loading="eager"
            decoding="async"
          />
          <h2 className="text-base sm:text-lg font-bold tracking-tight">
            NCTBA - Agraharam NC
          </h2>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6">
          <Link className="text-sm font-medium" to="/">Home</Link>
          {/*<Link className="text-sm font-medium" to="/public-events">Events</Link>*/}
          <Link className="text-sm font-medium" to="/committees">Services</Link>
          <Link className="text-sm font-medium" to="/matrimony_reg">Matrimony</Link>
          <Link className="text-sm font-medium" to="/donate">Donate</Link>
          {(userRole === 'user' || userRole === 'admin' || userRole === 'superAdmin') && (
            <Link className="text-sm font-medium" to="/dashboard">Dashboard</Link>
          )}
          {(userRole === 'admin' || userRole === 'superAdmin') && (
            <Link className="text-sm font-medium" to="/admin-dashboard">Admin Dashboard</Link>
          )}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:block relative">
          {(userRole === 'user' || userRole === 'admin' || userRole === 'superAdmin') && (
            <div className="relative">
              <button
                onClick={() => navigate('/notification-center')}
                className="relative"
                aria-label="Notifications"
              >
                <BellIcon className="h-6 w-6 text-gray-700" />
                {hasNotifications && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div>
          )}

          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Register</Link>
              <Link to="/login" className="bg-gray-100 text-black px-4 py-2 rounded-lg text-sm font-bold">Login</Link>
            </div>
          ) : (
            <LogoutButton />
          )}
        </div>

        {/* Mobile Hamburger */}
        {isLoggedIn && (
          <div className="lg:hidden relative mr-2">
            <button
              onClick={() => navigate('/notification-center')}
              className="relative"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6 text-gray-700" />
              {hasNotifications && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        )}


        <button
          className="lg:hidden p-2"
          onClick={() => document.getElementById('mobileMenu').classList.toggle('hidden')}
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>
        </button>

      </div>

      {/* Mobile Menu */}
      <nav id="mobileMenu" className="lg:hidden px-4 pb-4 hidden">
        <ul className="space-y-2">
          <li><Link to="/" className="block text-sm font-medium">Home</Link></li>
          {/* <li><Link to="/public-events" className="block text-sm font-medium">Events</Link></li>*/}
          <li><Link to="/committees" className="block text-sm font-medium">Services</Link></li>
          <li><Link to="/matrimony_reg" className="block text-sm font-medium">Matrimony</Link></li>
          <li><Link to="/donate" className="block text-sm font-medium">Donate</Link></li>
          {(userRole === 'user' || userRole === 'admin' || userRole === 'superAdmin') && (
            <li><Link to="/dashboard" className="block text-sm font-medium">Dashboard</Link></li>
          )}
          {(userRole === 'admin' || userRole === 'superAdmin') && (
            <li><Link to="/admin-dashboard" className="block text-sm font-medium">Admin Dashboard</Link></li>
          )}
        </ul>
        <div className="mt-3 flex gap-2">
          {!isLoggedIn ? (
            <>
              <Link to="/register" className="flex-1 h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center">Register</Link>
              <Link to="/login" className="flex-1 h-10 px-4 rounded-lg bg-gray-100 text-black text-sm font-bold flex items-center justify-center">Login</Link>
            </>
          ) : (
            <LogoutButton />
          )}
        </div>
      </nav>
    </header>
  );
}
