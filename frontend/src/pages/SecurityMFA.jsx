import React, { useEffect, useState } from 'react';
import api from '../api/authAxios';              
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { QRCodeCanvas } from 'qrcode.react';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';


export default function SecurityMFA() {
  const [enabled, setEnabled] = useState(null);
  const [secret, setSecret] = useState('');
  const [otpauthUri, setOtpauthUri] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);


  // If you already have a /api/me endpoint, use it to set initial enabled state.
  useEffect(() => {
    (async () => {
      try {
        const me = await api.get('/api/me'); // adjust if different
        setEnabled(!!me?.totpEnabled);
      } catch (e) {
        console.warn('Could not determine MFA status from /api/me, defaulting to false');
        setEnabled(false);
      }
    })();
  }, []);

  const beginSetup = async () => {
    setMsg('');
    setLoading(true);
    try {
      const res = await api.post('/api/user/security/totp/begin-setup');
      setSecret(res.secret);
      setOtpauthUri(res.otpauthUri);
    } catch (e) {
      console.error(e);
      setMsg('Failed to start MFA setup.');
    } finally {
      setLoading(false);
    }
  };

  const enable = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await api.post('/api/user/security/totp/enable', { secret, code });
      setEnabled(true);
      setSecret(''); setOtpauthUri(''); setCode('');
      setMsg('Multi-factor authentication is now enabled.');
    } catch (e) {
      console.error(e);
      setMsg('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disable = async () => {
    setMsg('');
    setLoading(true);
    try {
      await api.post('/api/user/security/totp/disable', { confirm: 'yes' });
      setEnabled(false);
      setSecret(''); setOtpauthUri(''); setCode('');
      setMsg('Multi-factor authentication is now disabled.');
    } catch (e) {
      console.error(e);
      setMsg('Failed to disable MFA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} showDashboardLink={true} />
        <div className="flex-1 p-6 space-y-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {sidebarOpen ? <ArrowLeftIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
          
      <main className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Account Security</h1>
        <p className="text-gray-600">Protect your account with an authenticator app (Google or Microsoft Authenticator).</p>

        {enabled === null ? (
          <div>Loading…</div>
        ) : enabled ? (
          <div className="rounded-lg border p-4">
            <p className="mb-3">MFA is <span className="font-semibold text-green-700">enabled</span> on your account.</p>
            <button
              onClick={disable}
              disabled={loading}
              className="h-10 px-4 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-60"
            >
              {loading ? 'Disabling…' : 'Disable MFA'}
            </button>
          </div>
        ) : (
          <div className="rounded-lg border p-4 space-y-4">
            <p>MFA is <span className="font-semibold">not enabled</span>.</p>
            {!secret ? (
              <button
                onClick={beginSetup}
                disabled={loading}
                className="h-10 px-4 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
              >
                {loading ? 'Starting…' : 'Begin setup'}
              </button>
            ) : (
              <form onSubmit={enable} className="space-y-4">
                <div className="flex items-center gap-4">
                  <QRCodeCanvas value={otpauthUri} />
                  <div className="text-sm">
                    <div className="font-semibold">Scan this QR with your Authenticator app</div>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Or enter code:</span>
                      <div className="font-mono">{secret}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Enter the 6-digit code</label>
                  <input
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e)=>setCode(e.target.value.replace(/\D/g,''))}
                    className="w-48 border rounded-lg h-11 px-3 tracking-widest"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={()=>{ setSecret(''); setOtpauthUri(''); setCode(''); }} className="h-10 px-4 rounded-lg border">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="h-10 px-4 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60">
                    {loading ? 'Enabling…' : 'Enable MFA'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {msg && <div className="text-sm">{msg}</div>}
      </main>
      </div>
      </div>
      <Footer />
    </>
  );
}
