import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';
import { MagnifyingGlassIcon, PlusIcon, PencilSquareIcon, ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';

/**
 * VendorList.jsx
 * - Search vendors by name (debounced)
 * - Table view with Name, Contact, Phone, Email, Actions
 * - Pagination controls (server-side) using /api/vendors?q=&page=&size=
 * - Buttons: Create New, Edit
 */
export default function VendorList() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Debounce search input
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const fetchVendors = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await api.instance.get('/api/vendors', {
          params: { q: debouncedQ || undefined, page, size }
        });
        const data = res?.data || {};
        setRows(data.content || []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? (data.content?.length || 0));
      } catch (err) {
        console.error('Failed to load vendors', err);
        setError(err?.response?.data?.message || err.message || 'Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [debouncedQ, page, size]);

  const gotoCreate = () => navigate('/vendor-create');
  const gotoEdit = (id) => navigate(`/vendor-edit/${id}`);

  const canPrev = useMemo(() => page > 0, [page]);
  const canNext = useMemo(() => page + 1 < totalPages, [page, totalPages]);

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} />
        <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">Vendors</h1>
            </div>
            <button
              onClick={gotoCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5"/> Create New
            </button>
          </div>

          <section className="bg-white shadow rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="relative w-full md:w-96">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                <input
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(0); }}
                  placeholder="Search by vendor name…"
                  className="w-full pl-10 pr-3 h-11 rounded-lg border border-gray-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Rows</label>
                <select
                  value={size}
                  onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
                  className="h-11 rounded-lg border border-gray-300 px-3"
                >
                  {[10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 border-b">Name</th>
                    <th className="text-left px-4 py-3 border-b">Contact</th>
                    <th className="text-left px-4 py-3 border-b">Phone</th>
                    <th className="text-left px-4 py-3 border-b">Email</th>
                    <th className="text-right px-4 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">Loading…</td>
                    </tr>
                  )}

                  {!loading && rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No vendors found</td>
                    </tr>
                  )}

                  {!loading && rows.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b font-medium">{v.name}</td>
                      <td className="px-4 py-3 border-b">{v.contactName || '-'}</td>
                      <td className="px-4 py-3 border-b">{v.phone || '-'}</td>
                      <td className="px-4 py-3 border-b">{v.email || '-'}</td>
                      <td className="px-4 py-3 border-b text-right">
                        <button
                          onClick={() => gotoEdit(v.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                        >
                          <PencilSquareIcon className="h-5 w-5"/> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing page <span className="font-medium">{totalPages === 0 ? 0 : page + 1}</span> of <span className="font-medium">{totalPages}</span>
                {totalElements ? ` • ${totalElements} total` : ''}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => canPrev && setPage((p) => Math.max(0, p - 1))}
                  disabled={!canPrev}
                  className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
                >Prev</button>
                <button
                  onClick={() => canNext && setPage((p) => p + 1)}
                  disabled={!canNext}
                  className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
                >Next</button>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                {error}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
