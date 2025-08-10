import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';

/**
 * RefundList.jsx
 * - Filters: status, referenceType, referenceId
 * - Table with actions: Approve (set amountApproved), Reject, Process (method+payoutRef)
 * - Details Drawer with full info and secondary actions
 * - Pagination
 */
export default function RefundList() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const statusOptions = ['REQUESTED','APPROVED','PROCESSED','REJECTED'];
  const referenceTypes = ['VendorPayment','EventRegistration','Membership','Donation','Other'];

  const [filters, setFilters] = useState({ status: '', referenceType: '', referenceId: '' });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // modal state
  const [modal, setModal] = useState({ open: false, type: null, id: null, label: '', amount: '', note: '', method: 'ZELLE', payoutRef: '' });

  // drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const params = {
        page, size,
        status: filters.status || undefined,
        referenceType: filters.referenceType || undefined,
        referenceId: filters.referenceId || undefined,
      };
      const res = await api.instance.get('/api/refunds', { params });
      const data = res?.data || {};
      setRows(data.content || []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? (data.content?.length || 0));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load refunds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, size]);
  useEffect(() => { setPage(0); load(); /* eslint-disable-next-line */ }, [filters.status, filters.referenceType, filters.referenceId]);

  const canPrev = useMemo(() => page > 0, [page]);
  const canNext = useMemo(() => page + 1 < totalPages, [page, totalPages]);

  const openModal = (type, row) => {
    if (type === 'approve') setModal({ open: true, type, id: row.id, label: 'Approved amount', amount: row.amountRequested, note: '', method: 'ZELLE', payoutRef: '' });
    else if (type === 'reject') setModal({ open: true, type, id: row.id, label: 'Reason (required)', amount: '', note: '', method: 'ZELLE', payoutRef: '' });
    else if (type === 'process') setModal({ open: true, type, id: row.id, label: 'Method & Payout Ref', amount: row.amountApproved || row.amountRequested, note: '', method: 'ZELLE', payoutRef: '' });
  };
  const closeModal = () => setModal({ open: false, type: null, id: null, label: '', amount: '', note: '', method: 'ZELLE', payoutRef: '' });

  const doApprove = async () => {
    try {
      const id = modal.id;
      const amt = Number(modal.amount);
      await api.instance.put(`/api/refunds/${id}/approve`, { amountApproved: amt, note: modal.note || null });
      setSuccess('Refund approved.');
      closeModal();
      load();
      if (selected?.id === id) await openDrawer(id);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Approve failed');
    }
  };
  const doReject = async () => {
    try {
      const id = modal.id;
      await api.instance.put(`/api/refunds/${id}/reject`, { reason: modal.note || 'Rejected' });
      setSuccess('Refund rejected.');
      closeModal();
      load();
      if (selected?.id === id) await openDrawer(id);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Reject failed');
    }
  };
  const doProcess = async () => {
    try {
      const id = modal.id;
      await api.instance.put(`/api/refunds/${id}/process`, { method: modal.method, payoutRef: modal.payoutRef || 'PAID' });
      setSuccess('Refund processed.');
      closeModal();
      load();
      if (selected?.id === id) await openDrawer(id);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Process failed');
    }
  };

  const openDrawer = async (id) => {
    setDrawerLoading(true);
    setDrawerOpen(true);
    try {
      const res = await api.instance.get(`/api/refunds/${id}`);
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
      {row.status === 'REQUESTED' && (
        <>
          <button onClick={() => openModal('approve', row)} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Approve</button>
          <button onClick={() => openModal('reject', row)} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Reject</button>
        </>
      )}
      {row.status === 'APPROVED' && (
        <button onClick={() => openModal('process', row)} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Process</button>
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
            <h1 className="text-2xl font-semibold">Refunds</h1>
            <button
              onClick={() => navigate('/admin/refunds/new')}
              className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >Create Refund</button>
          </div>

          {/* filters */}
          <section className="bg-white shadow rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3"
                >
                  <option value="">All</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Reference Type</label>
                <select
                  value={filters.referenceType}
                  onChange={(e) => setFilters((f) => ({ ...f, referenceType: e.target.value }))}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3"
                >
                  <option value="">All</option>
                  {referenceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Reference ID</label>
                <input
                  value={filters.referenceId}
                  onChange={(e) => setFilters((f) => ({ ...f, referenceId: e.target.value }))}
                  placeholder="e.g., registration id"
                  className="h-11 w-full rounded-lg border border-gray-300 px-3"
                />
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
                    <th className="text-left px-4 py-3 border-b">Ref Type</th>
                    <th className="text-left px-4 py-3 border-b">Ref ID</th>
                    <th className="text-right px-4 py-3 border-b">Requested</th>
                    <th className="text-right px-4 py-3 border-b">Approved</th>
                    <th className="text-left px-4 py-3 border-b">Status</th>
                    <th className="text-left px-4 py-3 border-b">Created</th>
                    <th className="text-right px-4 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-500">Loading…</td></tr>
                  )}
                  {!loading && rows.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-500">No results</td></tr>
                  )}

                  {!loading && rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b">
                        <button className="text-blue-700 hover:underline" onClick={() => openDrawer(row.id)}>
                          {row.referenceType}
                        </button>
                      </td>
                      <td className="px-4 py-3 border-b">{row.referenceId}</td>
                      <td className="px-4 py-3 border-b text-right">${Number(row.amountRequested || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 border-b text-right">{row.amountApproved ? `$${Number(row.amountApproved).toFixed(2)}` : '-'}</td>
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

      {/* modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5">
            <h3 className="text-lg font-semibold mb-2 capitalize">{modal.type}</h3>
            {modal.type === 'approve' && (
              <>
                <label className="block text-sm font-medium">Amount Approved *</label>
                <input
                  value={modal.amount}
                  onChange={(e) => setModal(m => ({ ...m, amount: e.target.value }))}
                  type="number" step="0.01" min="0"
                  className="mt-1 w-full rounded-lg border px-3 py-2 mb-3"
                />
                <label className="block text-sm font-medium">Approval Note (optional)</label>
                <textarea
                  value={modal.note}
                  onChange={(e) => setModal(m => ({ ...m, note: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2 mb-4"
                />
              </>
            )}
            {modal.type === 'reject' && (
              <>
                <label className="block text-sm font-medium">Reason *</label>
                <textarea
                  value={modal.note}
                  onChange={(e) => setModal(m => ({ ...m, note: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2 mb-4"
                />
              </>
            )}
            {modal.type === 'process' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium">Method *</label>
                    <select
                      value={modal.method}
                      onChange={(e) => setModal(m => ({ ...m, method: e.target.value }))}
                      className="h-11 w-full rounded-lg border border-gray-300 px-3"
                    >
                      {['ZELLE','PAYPAL','CHECK','BANK_TRANSFER','CASH'].map(m => <option key={m} value={m}>{m.replace('_',' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Payout Ref *</label>
                    <input
                      value={modal.payoutRef}
                      onChange={(e) => setModal(m => ({ ...m, payoutRef: e.target.value }))}
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      placeholder="Check #, Zelle note, etc."
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button className="px-4 py-2 rounded-lg border" onClick={closeModal}>Cancel</button>
              {modal.type === 'approve' && (
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={doApprove}>Approve</button>
              )}
              {modal.type === 'reject' && (
                <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={doReject}>Reject</button>
              )}
              {modal.type === 'process' && (
                <button className="px-4 py-2 rounded-lg bg-green-600 text-white" onClick={doProcess}>Process</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* details drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-40 transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Refund Details</h3>
          <button onClick={closeDrawer} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Close</button>
        </div>
        <div className="p-5 overflow-y-auto h-[calc(100%-56px)]">
          {drawerLoading && <p className="text-gray-600">Loading…</p>}
          {!drawerLoading && !selected && <p className="text-gray-600">No details</p>}
          {!drawerLoading && selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Reference</p>
                  <p className="font-medium">{selected.referenceType} • {selected.referenceId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Original Payment ID</p>
                  <p className="font-medium">{selected.originalPaymentId || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Requested</p>
                  <p className="font-medium">${Number(selected.amountRequested || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Approved</p>
                  <p className="font-medium">{selected.amountApproved ? `$${Number(selected.amountApproved).toFixed(2)}` : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100">{selected.status}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Method</p>
                  <p className="font-medium">{selected.method || '-'}</p>
                </div>
              </div>

              {selected.reason && (
                <div>
                  <p className="text-xs text-gray-500">Reason / Notes</p>
                  <p className="whitespace-pre-wrap">{selected.reason}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                {selected.processedAt && (
                  <div>
                    <p className="text-xs text-gray-500">Processed</p>
                    <p className="font-medium">{new Date(selected.processedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {(selected.approvedByUserId || selected.processedByUserId || selected.payoutRef) && (
                <div className="grid grid-cols-2 gap-3">
                  {selected.approvedByUserId && (
                    <div>
                      <p className="text-xs text-gray-500">Approved By (ID)</p>
                      <p className="font-medium">{selected.approvedByUserId}</p>
                    </div>
                  )}
                  {selected.processedByUserId && (
                    <div>
                      <p className="text-xs text-gray-500">Processed By (ID)</p>
                      <p className="font-medium">{selected.processedByUserId}</p>
                    </div>
                  )}
                  {selected.payoutRef && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Payout Ref</p>
                      <p className="font-medium break-all">{selected.payoutRef}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Secondary actions in drawer */}
              <div className="pt-2 border-t mt-2 flex flex-wrap gap-2">
                {selected.status === 'REQUESTED' && (
                  <>
                    <button onClick={() => openModal('approve', selected)} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Approve</button>
                    <button onClick={() => openModal('reject', selected)} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Reject</button>
                  </>
                )}
                {selected.status === 'APPROVED' && (
                  <button onClick={() => openModal('process', selected)} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Process</button>
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
