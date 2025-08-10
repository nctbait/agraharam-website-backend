import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';

/**
 * VendorPaymentList.jsx
 * - Filters: vendor, event, status
 * - Table with actions: Approve, Reject, Mark Paid
 * - Details Drawer (right side) with full info and secondary actions
 * - Pagination
 */
export default function VendorPaymentList() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // filters & paging
  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);
  const [statusOptions] = useState(['PENDING','APPROVED','PAID','REJECTED']);

  const [filters, setFilters] = useState({ vendorId: '', eventId: '', status: '' });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // data
  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // modal state (approve/reject/paid)
  const [modal, setModal] = useState({ open: false, type: null, id: null, label: '', note: '' });

  // drawer state (details)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [selected, setSelected] = useState(null); // full DTO

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.instance.get('/api/vendors', { params: { page: 0, size: 200 } });
        setVendors(res?.data?.content || []);
      } catch (err) { /* ignore */ }
    };
    const fetchEvents = async () => {
      try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const date = oneYearAgo.toISOString().split('T')[0];
        const evs = await api.get(`/api/events/list/${date}`);
        setEvents(evs || []);
      } catch (err) { /* ignore */ }
    };
    fetchVendors();
    fetchEvents();
  }, []);

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const params = {
        page, size,
        vendorId: filters.vendorId || undefined,
        eventId: filters.eventId || undefined,
        status: filters.status || undefined,
      };
      const res = await api.instance.get('/api/vendor-payments', { params });
      const data = res?.data || {};
      setRows(data.content || []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? (data.content?.length || 0));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load vendor payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, size]);
  useEffect(() => { setPage(0); load(); /* eslint-disable-next-line */ }, [filters.vendorId, filters.eventId, filters.status]);

  const canPrev = useMemo(() => page > 0, [page]);
  const canNext = useMemo(() => page + 1 < totalPages, [page, totalPages]);

  // --- actions (approve/reject/mark-paid) ---
  const doApprove = async () => {
    try {
      const id = modal.id;
      await api.instance.put(`/api/vendor-payments/${id}/approve`, modal.note ? { note: modal.note } : {});
      setSuccess('Payment approved.');
      setModal({ open: false, type: null, id: null, label: '', note: '' });
      load();
      if (selected?.id === id) await openDrawer(id); // refresh drawer
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Approve failed');
    }
  };
  const doReject = async () => {
    try {
      const id = modal.id;
      await api.instance.put(`/api/vendor-payments/${id}/reject`, { reason: modal.note || 'Rejected' });
      setSuccess('Payment rejected.');
      setModal({ open: false, type: null, id: null, label: '', note: '' });
      load();
      if (selected?.id === id) await openDrawer(id);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Reject failed');
    }
  };
  const doMarkPaid = async () => {
    try {
      const id = modal.id;
      await api.instance.put(`/api/vendor-payments/${id}/mark-paid`, { transactionRef: modal.note || 'PAID' });
      setSuccess('Payment marked as paid.');
      setModal({ open: false, type: null, id: null, label: '', note: '' });
      load();
      if (selected?.id === id) await openDrawer(id);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Mark paid failed');
    }
  };

  const openModal = (type, row, label) => setModal({ open: true, type, id: row.id, label, note: '' });
  const closeModal = () => setModal({ open: false, type: null, id: null, label: '', note: '' });

  // --- drawer helpers ---
  const openDrawer = async (id) => {
    setDrawerLoading(true);
    setDrawerOpen(true);
    try {
      const res = await api.instance.get(`/api/vendor-payments/${id}`);
      setSelected(res?.data || null);
    } catch (err) {
      setSelected(null);
    } finally {
      setDrawerLoading(false);
    }
  };
  const closeDrawer = () => { setDrawerOpen(false); setSelected(null); };

  const actionButtons = (row) => (
    <div className="space-x-2">
      {row.status === 'PENDING' && (
        <>
          <button onClick={() => openModal('approve', row, 'Approval note (optional)')}
                  className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Approve</button>
          <button onClick={() => openModal('reject', row, 'Reason (required)')}
                  className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Reject</button>
        </>
      )}
      {row.status === 'APPROVED' && (
        <button onClick={() => openModal('markPaid', row, 'Transaction Ref (required)')}
                className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Mark Paid</button>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} />
        <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Vendor Payments</h1>
            <button
              onClick={() => navigate('/vendor-payment-create')}
              className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >Create Payment</button>
          </div>

          {/* filters */}
          <section className="bg-white shadow rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium">Vendor</label>
                <select
                  value={filters.vendorId}
                  onChange={(e) => setFilters((f) => ({ ...f, vendorId: e.target.value }))}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3"
                >
                  <option value="">All Vendors</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Event</label>
                <select
                  value={filters.eventId}
                  onChange={(e) => setFilters((f) => ({ ...f, eventId: e.target.value }))}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3"
                >
                  <option value="">All Events</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-end justify-end gap-2">
                <label className="text-sm text-gray-600 self-center">Rows</label>
                <select
                  value={size}
                  onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
                  className="h-11 rounded-lg border border-gray-300 px-3"
                >
                  {[10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {/* table */}
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 border-b">Vendor</th>
                    <th className="text-left px-4 py-3 border-b">Event</th>
                    <th className="text-left px-4 py-3 border-b">Invoice</th>
                    <th className="text-left px-4 py-3 border-b">Method</th>
                    <th className="text-right px-4 py-3 border-b">Amount</th>
                    <th className="text-left px-4 py-3 border-b">Status</th>
                    <th className="text-left px-4 py-3 border-b">Created</th>
                    <th className="text-right px-4 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-500">Loading…</td></tr>
                  )}
                  {!loading && rows.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-500">No results</td></tr>
                  )}

                  {!loading && rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b">
                        <button className="text-blue-700 hover:underline" onClick={() => openDrawer(row.id)}>
                          {row.vendorName}
                        </button>
                      </td>
                      <td className="px-4 py-3 border-b">{row.eventTitle || '-'}</td>
                      <td className="px-4 py-3 border-b">{row.invoiceNumber || '-'}</td>
                      <td className="px-4 py-3 border-b">{row.paymentMethod}</td>
                      <td className="px-4 py-3 border-b text-right">${Number(row.amount || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 border-b">{row.status}</td>
                      <td className="px-4 py-3 border-b">{new Date(row.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 border-b text-right">{actionButtons(row)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing page <span className="font-medium">{totalPages === 0 ? 0 : page + 1}</span> of <span className="font-medium">{totalPages}</span>
                {totalElements ? ` • ${totalElements} total` : ''}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => canPrev && setPage(p => Math.max(0, p - 1))}
                        disabled={!canPrev}
                        className="px-3 py-1.5 rounded-lg border disabled:opacity-50">Prev</button>
                <button onClick={() => canNext && setPage(p => p + 1)}
                        disabled={!canNext}
                        className="px-3 py-1.5 rounded-lg border disabled:opacity-50">Next</button>
              </div>
            </div>

            {success && (
              <div className="mt-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-800">{success}</div>
            )}
            {error && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">{error}</div>
            )}
          </section>
        </div>
      </div>

      {/* action modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5">
            <h3 className="text-lg font-semibold mb-2 capitalize">{modal.type === 'markPaid' ? 'Mark as Paid' : modal.type}</h3>
            <p className="text-sm text-gray-600 mb-3">{modal.label}</p>
            <textarea
              className="w-full rounded-lg border px-3 py-2 mb-4"
              rows={3}
              value={modal.note}
              onChange={(e) => setModal(m => ({ ...m, note: e.target.value }))}
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg border" onClick={() => setModal({ open: false, type: null, id: null, label: '', note: '' })}>Cancel</button>
              {modal.type === 'approve' && (
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={doApprove}>Approve</button>
              )}
              {modal.type === 'reject' && (
                <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={doReject}>Reject</button>
              )}
              {modal.type === 'markPaid' && (
                <button className="px-4 py-2 rounded-lg bg-green-600 text-white" onClick={doMarkPaid}>Mark Paid</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* details drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-40 transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          <button onClick={closeDrawer} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Close</button>
        </div>
        <div className="p-5 overflow-y-auto h-[calc(100%-56px)]">
          {drawerLoading && <p className="text-gray-600">Loading…</p>}
          {!drawerLoading && !selected && <p className="text-gray-600">No details</p>}
          {!drawerLoading && selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Vendor</p>
                  <p className="font-medium">{selected.vendorName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Event</p>
                  <p className="font-medium">{selected.eventTitle || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Invoice #</p>
                  <p className="font-medium">{selected.invoiceNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Method</p>
                  <p className="font-medium">{selected.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-medium">${Number(selected.amount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100">{selected.status}</span>
                </div>
              </div>

              {selected.description && (
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="whitespace-pre-wrap">{selected.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                {selected.approvedAt && (
                  <div>
                    <p className="text-xs text-gray-500">Approved</p>
                    <p className="font-medium">{new Date(selected.approvedAt).toLocaleString()}</p>
                  </div>
                )}
                {selected.paidAt && (
                  <div>
                    <p className="text-xs text-gray-500">Paid</p>
                    <p className="font-medium">{new Date(selected.paidAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {(selected.approvedByUserId || selected.paidByUserId || selected.transactionRef) && (
                <div className="grid grid-cols-2 gap-3">
                  {selected.approvedByUserId && (
                    <div>
                      <p className="text-xs text-gray-500">Approved By (ID)</p>
                      <p className="font-medium">{selected.approvedByUserId}</p>
                    </div>
                  )}
                  {selected.paidByUserId && (
                    <div>
                      <p className="text-xs text-gray-500">Paid By (ID)</p>
                      <p className="font-medium">{selected.paidByUserId}</p>
                    </div>
                  )}
                  {selected.transactionRef && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Transaction Ref / Note</p>
                      <p className="font-medium break-all">{selected.transactionRef}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Secondary actions in drawer */}
              <div className="pt-2 border-t mt-2 flex flex-wrap gap-2">
                {selected.status === 'PENDING' && (
                  <>
                    <button onClick={() => openModal('approve', selected, 'Approval note (optional)')} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Approve</button>
                    <button onClick={() => openModal('reject', selected, 'Reason (required)')} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Reject</button>
                  </>
                )}
                {selected.status === 'APPROVED' && (
                  <button onClick={() => openModal('markPaid', selected, 'Transaction Ref (required)')} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Mark Paid</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
