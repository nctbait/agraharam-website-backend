import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';
import { Link, useNavigate } from 'react-router-dom';

const STATUS = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' }
];

const COMMITTEES = [
  { value: '', label: 'All Committees' },
  { value: 'food', label: 'Food' },
  { value: 'events', label: 'Events' },
  { value: 'youth', label: 'Youth' },
  { value: 'matrimony', label: 'Matrimony' },
  { value: 'finance', label: 'Finance' },
  { value: 'religious', label: 'Religious' },
  { value: 'it', label: 'IT' },
  { value: 'president', label: 'President' },
  { value: 'trustees', label: 'Trustees' },
  { value: 'general', label: 'General' }
];

export default function AdminContactInbox() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('');
  const [committee, setCommittee] = useState('');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.get('/api/admin/contacts', { params: { page, size, status, committee, query } });
    setRows(res.content || []);
    setTotalPages(res.totalPages || 0);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, status, committee]);

  const badge = (s) => {
    const map = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-green-100 text-green-800'
    };
    return <span className={`px-2 py-1 rounded text-xs ${map[s] || 'bg-gray-100 text-gray-700'}`}>{s || '-'}</span>;
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-4 lg:px-10 py-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold mr-auto">Contact Inbox</h1>
            <input
              className="border rounded-lg h-10 px-3"
              placeholder="Search name or email"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
            />
            <button onClick={()=>{ setPage(0); load(); }} className="rounded-lg h-10 px-4 bg-[#f1f2f4] font-bold">Search</button>
          </div>

          <div className="flex gap-3 mb-4">
            <select className="border rounded-lg h-10 px-3" value={status} onChange={e=>{setStatus(e.target.value); setPage(0);}}>
              {STATUS.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select className="border rounded-lg h-10 px-3" value={committee} onChange={e=>{setCommittee(e.target.value); setPage(0);}}>
              {COMMITTEES.map(c=> <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto border rounded-xl bg-white">
            <table className="min-w-[800px] w-full text-sm">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="text-left px-4 py-3">Submitted</th>
                  <th className="text-left px-4 py-3">From</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Committee</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2">{r.name}</td>
                    <td className="px-4 py-2">{r.email}</td>
                    <td className="px-4 py-2 capitalize">{r.committee}</td>
                    <td className="px-4 py-2">{badge(r.status)}</td>
                    <td className="px-4 py-2">
                      <button onClick={()=>navigate(`/admin/contacts/${r.id}`)} className="text-blue-600 hover:underline">Open</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-gray-500 py-6">No messages found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">Page {page + 1} of {Math.max(totalPages, 1)}</span>
            <div className="flex gap-2">
              <button onClick={()=>setPage(p=>Math.max(p-1,0))} disabled={page===0} className="rounded-lg h-9 px-3 bg-[#f1f2f4] disabled:opacity-60">Prev</button>
              <button onClick={()=>setPage(p=>p+1)} disabled={page+1>=totalPages} className="rounded-lg h-9 px-3 bg-[#f1f2f4] disabled:opacity-60">Next</button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
