import React, { useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function strengthCheck(pwd) {
  if (!pwd || pwd.length < 15) return 'Use at least 15 characters.';
  return '';
}

export default function ResetPassword() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const strengthMsg = useMemo(()=>strengthCheck(pwd), [pwd]);
  const canSubmit = token && pwd && confirm && pwd === confirm && !strengthMsg;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError('');
    try {
      await axios.post('/api/public/auth/reset-password', {
        token,
        newPassword: pwd
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      setError('Invalid or expired link. Please request a new reset email.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Set a new password</h1>
        {!token ? (
          <div className="rounded-lg border p-4 bg-red-50 text-red-700">
            Missing token. Please use the link from your email.
          </div>
        ) : done ? (
          <div className="rounded-lg border p-4 bg-green-50 text-green-800">
            Your password has been changed. You can now sign in with your new password.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New password</label>
              <input
                type="password"
                className="w-full border rounded-lg h-11 px-3"
                value={pwd}
                onChange={(e)=>setPwd(e.target.value)}
                placeholder="Choose a strong password"
                required
                minLength={15}
              />
              {strengthMsg && <p className="text-xs text-red-600 mt-1">{strengthMsg}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm new password</label>
              <input
                type="password"
                className="w-full border rounded-lg h-11 px-3"
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                required
                minLength={15}
              />
              {confirm && pwd !== confirm && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match.</p>
              )}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
              disabled={!canSubmit || saving}
            >
              {saving ? 'Saving…' : 'Set new password'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
