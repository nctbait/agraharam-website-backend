import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';

/**
 * VendorPaymentCreate.jsx
 * Admin creates a vendor payment request (PENDING). Another admin will approve & mark paid.
 *
 * POST /api/vendor-payments
 * body: {
 *   vendorId, eventId?, invoiceNumber?, description?, amount, paymentMethod
 * }
 */
export default function VendorPaymentCreate() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    vendorId: '',
    eventId: '', // optional
    invoiceNumber: '',
    description: '',
    amount: '',
    paymentMethod: 'ZELLE',
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // grab first page with large size for dropdown; adjust if you need server-side search later
        const res = await api.instance.get('/api/vendors', { params: { page: 0, size: 100 } });
        setVendors(res?.data?.content || []);
      } catch (err) {
        console.error('Failed to load vendors', err);
        setError(err?.response?.data?.message || err.message || 'Failed to load vendors');
      }
    };

    const fetchEvents = async () => {
      try {
        // reuse the pattern from SubmitBill.jsx (events in the last year to future)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const date = oneYearAgo.toISOString().split('T')[0];
        const evs = await api.get(`/api/events/list/${date}`);
        setEvents(evs || []);
      } catch (err) {
        console.error('Failed to load events', err);
        // events are optional; don't hard fail
      }
    };

    fetchVendors();
    fetchEvents();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.vendorId) return 'Please select a vendor';
    const amt = Number(form.amount);
    if (!amt || isNaN(amt) || amt <= 0) return 'Amount must be greater than 0';
    if (!form.paymentMethod) return 'Select a payment method';
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
      const payload = {
        vendorId: Number(form.vendorId),
        eventId: form.eventId ? Number(form.eventId) : null,
        invoiceNumber: form.invoiceNumber || null,
        description: form.description || null,
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
      };
      const res = await api.instance.post('/api/vendor-payments', payload);
      setSuccess(`Vendor payment created (ID: ${res?.data?.id ?? ''}).`);
      // reset form
      setForm({ vendorId: '', eventId: '', invoiceNumber: '', description: '', amount: '', paymentMethod: 'ZELLE' });
      // navigate to list (adjust route if your list lives elsewhere)
      setTimeout(() => navigate('/vendor-payment-list'), 600);
    } catch (err) {
      console.error('Create vendor payment failed', err);
      setError(err?.response?.data?.message || err.message || 'Create vendor payment failed');
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
            <h1 className="text-2xl font-semibold">Create Vendor Payment</h1>
          </div>

          <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
            {success && (
              <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-800">{success}</div>
            )}
            {error && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">{error}</div>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 gap-4">
              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium">Vendor *</label>
                <select
                  name="vendorId"
                  value={form.vendorId}
                  onChange={onChange}
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 px-3"
                >
                  <option value="" disabled>Select vendor</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              {/* Event (optional) */}
              <div>
                <label className="block text-sm font-medium">Event (optional)</label>
                <select
                  name="eventId"
                  value={form.eventId}
                  onChange={onChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3"
                >
                  <option value="">No event</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              {/* Invoice */}
              <div>
                <label className="block text-sm font-medium">Invoice #</label>
                <input
                  name="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={onChange}
                  placeholder="INV-2025-001"
                  maxLength={80}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="What is this payment for?"
                  rows={3}
                  maxLength={600}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Amount + Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Amount (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="amount"
                    value={form.amount}
                    onChange={onChange}
                    placeholder="0.00"
                    required
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Payment Method *</label>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={onChange}
                    required
                    className="h-11 w-full rounded-lg border border-gray-300 px-3"
                  >
                    {['ZELLE','PAYPAL','CHECK','BANK_TRANSFER','CASH'].map(m => (
                      <option key={m} value={m}>{m.replace('_',' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => navigate('/vendor-payment-list')} className="h-10 px-4 rounded-lg border hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60">
                  {saving ? 'Saving…' : 'Create Payment'}
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
