import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';

export default function VendorEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: ''
  });

  // Load vendor
  useEffect(() => {
    const load = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await api.instance.get(`/api/vendors/${id}`);
        const v = res?.data || {};
        setForm({
          name: v.name || '',
          contactName: v.contactName || '',
          phone: v.phone || '',
          email: v.email || '',
          address: v.address || ''
        });
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load vendor');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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
      await api.instance.put(`/api/vendors/${id}`, form);
      setSuccess('Vendor updated successfully.');
      setTimeout(() => navigate('/vendor-list'), 600);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Update failed');
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Edit Vendor</h1>
            <div className="flex items-center gap-2">
              <Link to="/admin/vendors" className="px-4 py-2 rounded-lg border hover:bg-gray-50">Back to list</Link>
            </div>
          </div>

          <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
            {loading ? (
              <p className="text-gray-600">Loading…</p>
            ) : (
              <>
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
                  <div>
                    <label className="block text-sm font-medium">Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      required
                      maxLength={160}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Contact Name</label>
                      <input
                        name="contactName"
                        value={form.contactName}
                        onChange={onChange}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        maxLength={120}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        maxLength={40}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      maxLength={160}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Address</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      rows={3}
                      maxLength={500}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/vendor-list')}
                      className="h-10 px-4 rounded-lg border hover:bg-gray-50"
                    >Cancel</button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
                    >{saving ? 'Saving…' : 'Save Changes'}</button>
                  </div>
                </form>
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
