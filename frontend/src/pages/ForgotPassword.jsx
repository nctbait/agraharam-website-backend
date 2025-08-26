import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await axios.post('/api/public/auth/forgot-password', { email });
      setSent(true); // always 200 (no user enumeration)
    } catch (err) {
      console.error(err);
      // Still show generic success to avoid enumeration
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Forgot your password?</h1>
        {!sent ? (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full border rounded-lg h-11 px-3"
                placeholder="Your Agraharam Registered Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <div className="rounded-lg border p-4 bg-green-50 text-green-800">
            If that email exists in our system, we’ve sent a link to reset your password.
            Please check your inbox.
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
