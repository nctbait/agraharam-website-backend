import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { setToken } from '../auth/token';

export default function Login() {
  const location = useLocation();

  // Banner (kept from your version)
  const [banner, setBanner] = useState(() => {
    const fromState = location?.state?.msg;
    if (fromState) return fromState;
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
  const [params] = useSearchParams();

  // Step 1 state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // MFA step state
  const [mfaNeeded, setMfaNeeded] = useState(false);
  const [challengeId, setChallengeId] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  // UX helpers
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const routeAfterLogin = (token) => {
    setToken(token);
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
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE}/api/login`, {
        email,
        password
      });

      // Two possible shapes:
      // { token } OR { mfaRequired: true, challengeId }
      if (response.data?.mfaRequired) {
        setChallengeId(response.data.challengeId);
        setMfaNeeded(true);
        setMfaCode('');
      } else if (response.data?.token) {
        routeAfterLogin(response.data.token);
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (!mfaCode || mfaCode.length < 6) {
      setError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/api/login/mfa-verify`, {
        challengeId,
        code: mfaCode
      });
      if (res.data?.token) {
        routeAfterLogin(res.data.token);
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      console.error('MFA verify failed', err);
      setError('Invalid code. Please try again.');
    } finally {
      setSubmitting(false);
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

          {!mfaNeeded ? (
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
              {error && <div className="text-sm text-red-600">{error}</div>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full h-10 bg-blue-600 text-white font-bold mt-2 disabled:opacity-60"
              >
                {submitting ? 'Signing in…' : 'Log In'}
              </button>

              <div className="text-center pt-4">
                <span className="text-sm text-gray-500">Forgot Password? </span>
                <button
                  type="button"
                  onClick={() => navigate('/forgotPassword')}
                  className="rounded-full h-10 px-6 bg-gray-300 text-[#111418] text-sm font-medium"
                >
                  Reset Password
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMfaVerify} className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                Enter the 6-digit code from your authenticator app to finish signing in.
              </p>
              <label className="flex flex-col">
                <span className="text-base font-medium pb-1">Authenticator code</span>
                <input
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  className="form-input w-44 rounded-xl border border-gray-300 h-12 px-4 tracking-widest"
                  autoFocus
                  required
                />
              </label>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setMfaNeeded(false); setChallengeId(''); setMfaCode(''); }}
                  className="w-1/3 rounded-full h-10 bg-gray-100 text-gray-900 font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full h-10 bg-blue-600 text-white font-bold disabled:opacity-60"
                >
                  {submitting ? 'Verifying…' : 'Verify'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
