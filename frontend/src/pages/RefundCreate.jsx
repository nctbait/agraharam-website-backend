import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';
import AsyncSelect from 'react-select/async';

/**
 * RefundCreate.jsx
 * Admin creates a refund request (REQUESTED). Another admin approves + processes it.
 *
 * POST /api/refunds
 * body: {
 *   referenceType, referenceId, originalPaymentId?, requesterUserId?, amountRequested, reason?
 * }
 */
export default function RefundCreate() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // 1) add a separate state just for the select's option
  const [requesterUserOption, setRequesterUserOption] = useState(null);


  // If you want smart pickers later (e.g., choose an event registration), we can add them.
  const referenceTypes = ['VendorPayment', 'EventRegistration', 'Membership', 'Donation', 'Other'];

  const [form, setForm] = useState({
    referenceType: 'EventRegistration',
    referenceId: '',
    originalPaymentId: '',
    requesterUserId: '',
    amountRequested: '',
    reason: '',
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.referenceType) return 'Select a reference type';
    if (!form.referenceId) return 'Reference ID is required';
    const amt = Number(form.amountRequested);
    if (!amt || isNaN(amt) || amt <= 0) return 'Amount must be greater than 0';
    return null;
  };

  // 2) return a Promise from loadOptions (simpler than callback form)
  const loadUserOptions = async (inputValue) => {
    const res = await api.get(`/api/family/user-search`, { params: { query: inputValue || '' } });
    return (res || []).map(u => ({
      value: u.id,
      label: `${u.firstName} ${u.lastName} (${u.email})`,
    }));
  };


  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const v = validate();
    if (v) return setError(v);
    try {
      setSaving(true);
      const payload = {
        referenceType: form.referenceType,
        referenceId: Number(form.referenceId),
        originalPaymentId: form.originalPaymentId ? Number(form.originalPaymentId) : null,
        requesterUserId: requesterUserOption ? Number(requesterUserOption.value) : null,
        amountRequested: Number(form.amountRequested),
        reason: form.reason || null,
      };
      const res = await api.instance.post('/api/refunds', payload);
      setSuccess(`Refund created (ID: ${res?.data?.id ?? ''}).`);
      setTimeout(() => navigate('/admin/refunds'), 700);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Create refund failed');
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
            <h1 className="text-2xl font-semibold">Create Refund</h1>
          </div>

          <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
            {success && <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-800">{success}</div>}
            {error && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">{error}</div>}

            <form onSubmit={submit} className="grid grid-cols-1 gap-4">
              {/* Reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Reference Type *</label>
                  <select
                    name="referenceType"
                    value={form.referenceType}
                    onChange={onChange}
                    className="h-11 w-full rounded-lg border border-gray-300 px-3"
                    required
                  >
                    {referenceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Reference ID *</label>
                  <input
                    name="referenceId"
                    value={form.referenceId}
                    onChange={onChange}
                    inputMode="numeric"
                    placeholder="e.g., registration id"
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Original Payment ID (optional)</label>
                  <input
                    name="originalPaymentId"
                    value={form.originalPaymentId}
                    onChange={onChange}
                    inputMode="numeric"
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Requester User ID (optional)</label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    isClearable
                    loadOptions={loadUserOptions}
                    value={requesterUserOption}                 // <- the option object
                    onChange={(opt) => setRequesterUserOption(opt)}  // <- store the option object
                    placeholder="Assign to user..."
                  />

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Amount Requested (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="amountRequested"
                    value={form.amountRequested}
                    onChange={onChange}
                    placeholder="0.00"
                    required
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Reason</label>
                  <input
                    name="reason"
                    value={form.reason}
                    onChange={onChange}
                    placeholder="Optional note"
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => navigate('/admin/refunds')} className="h-10 px-4 rounded-lg border hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60">
                  {saving ? 'Saving…' : 'Create Refund'}
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
