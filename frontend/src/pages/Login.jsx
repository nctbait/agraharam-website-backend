import React, { useState, useContext,useEffect } from 'react';
import { useNavigate,useSearchParams,useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { setToken } from '../auth/token';

export default function Login() {
  const location = useLocation();
  //const [banner, setBanner] = useState(location?.state?.msg || null);
    // Clear location.state so the banner doesn’t persist across navigations
    const [banner, setBanner] = useState(() => {
          // 1) try router state
          const fromState = location?.state?.msg;
          if (fromState) return fromState;
          // 2) fallback: sessionStorage (covers full reloads / plain links)
          const fromStore = sessionStorage.getItem('logout.msg');
          if (fromStore) {
            sessionStorage.removeItem('logout.msg');
            return fromStore;
          }
          return null;
        });
 const nav = useNavigate();
 useEffect(() => {
     if (location?.state?.msg) {
        nav(location.pathname, { replace: true, state: {} });
      }
    }, [location?.state?.msg, location.pathname, nav]);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const { setUserRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [params] = useSearchParams(); // NEW: read query params
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/api/login`, {
        email,
        password
      });
  
      const { token } = response.data;
  
      // Store token securely (e.g. localStorage or memory)
      //localStorage.setItem('jwtToken', token);
      setToken(token); 
  
      // Decode token to extract role (e.g., with jwt-decode)
      const decoded = jwtDecode(token);
      const role = decoded.accessRole;
  
      setUserRole(role);
      const redirect = params.get('redirect');
      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (role === 'superAdmin' || role === 'admin') {
        navigate('/admin-dashboard', { replace: true, state: {} });
      } else {
        navigate('/dashboard', { replace: true, state: {} });
      }
    } catch (err) {
      console.error("Login failed", err);
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-10 bg-white">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow p-6 sm:p-10">
        {banner && (
            <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm flex items-start justify-between gap-3">
              <span>{banner}</span>
              <button
                onClick={() => setBanner(null)}
                className="text-xs underline"
                aria-label="Dismiss"
              >
                Dismiss
              </button>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Welcome back</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="text-base font-medium pb-1">Email</span>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full rounded-xl border border-gray-300 h-12 px-4"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-base font-medium pb-1">Password</span>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full rounded-xl border border-gray-300 h-12 px-4"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full h-10 bg-blue-600 text-white font-bold mt-2"
            >
              Log In
            </button>
          </form>
          <div className="text-center pt-4">
            <span className="text-sm text-gray-500">Don't have an account?</span>
            <a href="/register" className="text-blue-600 text-sm underline ml-1">Register</a>
          </div>
          <div className="text-center pt-4">
            <button
              onClick={logout}
              className="text-sm text-red-600 underline"
            >
              Log Off
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
