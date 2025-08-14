import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import Footer from '../components/Footer';

export default function AdminMatrimonyDirectory() {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const debounceRef = useRef(null);

  // debounced server search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setRows([]); return; }
    debounceRef.current = setTimeout(async () => {
      setBusy(true); setError(''); setSuccess('');
      try {
        const res = await api.get('/api/matrimony/profile-search', { params: { query } });
        setRows(res || []);
      } catch (e) {
        console.error(e);
        setError('Search failed.');
        setRows([]);
      } finally {
        setBusy(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleDisable = async (id, name) => {
    if (!window.confirm(`Disable profile "${name}"? They will no longer be listed.`)) return;
    setBusy(true); setError(''); setSuccess('');
    try {
      await api.post(`/api/matrimony/${id}/disable`);
      setRows(prev => prev.filter(r => r.id !== id));
      setSuccess(`Disabled: ${name}`);
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data || 'Disable failed.';
      setError(typeof msg === 'string' ? msg : 'Disable failed.');
    } finally {
      setBusy(false);
    }
  };

  const columns = useMemo(() => ([
    { key: 'name',         label: 'Name' },
    { key: 'contactPhone', label: 'Phone' },
    { key: 'contactEmail', label: 'Email' },
    { key: 'fatherName',   label: "Father's Name" },
    { key: 'gothram',      label: 'Gothram' },
    { key: 'vedam',        label: 'Vedam' },
  ]), []);

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <h1 className="text-2xl font-bold mb-4">Matrimony Directory (Approved)</h1>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search approved by name or email…"
              className="border border-gray-300 px-3 py-2 rounded w-96"
            />
            {busy && <span className="text-sm text-gray-500">Searching…</span>}
          </div>

          {error && <div className="mb-3 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}
          {success && <div className="mb-3 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">{success}</div>}

          <div className="overflow-x-auto rounded shadow border">
            <table className="min-w-full text-sm text-left table-auto">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {columns.map(c => <th key={c.key} className="p-2">{c.label}</th>)}
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    {columns.map(c => <td key={c.key} className="p-2">{p[c.key] ?? ''}</td>)}
                    <td className="p-2">
                      <button
                        onClick={() => handleDisable(p.id, p.name)}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                        disabled={busy}
                        title="Disable profile"
                      >
                        Disable
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && query.trim() && !busy && (
                  <tr><td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">No results.</td></tr>
                )}
                {!query.trim() && (
                  <tr><td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">Type to search approved profiles…</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
