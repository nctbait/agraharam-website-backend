import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function VendorCreate() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Vendor name is required';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return 'Email looks invalid';
    if (form.phone && form.phone.length > 40) return 'Phone is too long';
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const v = validate();
    if (v) return setError(v);

    try {
      setSaving(true);
      const res = await api.instance.post('/api/vendors', form);
      setSuccess(`Vendor created (ID: ${res?.data?.id ?? ''}).`);
      setForm({ name: '', contactName: '', phone: '', email: '', address: '' });
      setTimeout(() => navigate('/vendor-list'), 600);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Create vendor failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} />
        <div className="flex-1 p-6 space-y-6">
          <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl my-6">
            <h2 className="text-2xl font-bold mb-4">Create Vendor</h2>

            {success && (
              <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-800">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Name/Company of Vendor"
                required
                maxLength={160}
              />
              <input
                name="contactName"
                value={form.contactName}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Vendor Contact Name"
                maxLength={120}
              />
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Phone Number"
                maxLength={40}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="email"
                maxLength={160}
              />
              <textarea
                name="address"
                value={form.address}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Address of Vendor"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Create Vendor'}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
