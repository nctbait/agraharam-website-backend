import React, { useState, useContext } from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
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
      localStorage.setItem('jwtToken', token);
  
      // Decode token to extract role (e.g., with jwt-decode)
      const decoded = jwtDecode(token);
      const role = decoded.accessRole;
  
      setUserRole(role);
      const redirect = params.get('redirect');
      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (role === 'superAdmin' || role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
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
