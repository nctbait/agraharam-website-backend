import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';
import { useParams, useNavigate } from 'react-router-dom';

const StatusBadge = ({ s }) => {
  const map = { new:'bg-blue-100 text-blue-800', in_progress:'bg-yellow-100 text-yellow-800', closed:'bg-green-100 text-green-800' };
  return <span className={`px-2 py-1 rounded text-xs capitalize ${map[s] || 'bg-gray-100 text-gray-700'}`}>{s}</span>;
};

export default function AdminContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [notes, setNotes] = useState([]);
  const [reply, setReply] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    const res = await api.get(`/api/admin/contacts/${id}`);
    setMessage(res.message);
    setNotes(res.notes || []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setUpdating(true);
    try {
      await api.post(`/api/admin/contacts/${id}/reply`, { body: reply });
      setReply('');
      await load();
      alert('Reply sent.');
    } catch (e) {
      console.error(e); alert('Failed to send reply.');
    } finally { setUpdating(false); }
  };

  const setStatus = async (status) => {
    setUpdating(true);
    try {
      await api.put(`/api/admin/contacts/${id}/status`, { status });
      await load();
    } catch (e) {
      console.error(e); alert('Failed to update status.');
    } finally { setUpdating(false); }
  };

  if (!message) return null;

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-4 lg:px-10 py-6">
          <button onClick={()=>navigate(-1)} className="text-blue-600 hover:underline mb-3">← Back</button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">Contact Message</h1>
            <StatusBadge s={message.status}/>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white border rounded-xl p-4">
              <h2 className="font-semibold mb-2">Message</h2>
              <div className="text-sm text-gray-700 mb-2">
                <div><strong>From:</strong> {message.name} &lt;{message.email}&gt;</div>
                {message.phone && <div><strong>Phone:</strong> {message.phone}</div>}
                <div><strong>Committee:</strong> {message.committee}</div>
                <div><strong>Submitted:</strong> {new Date(message.createdAt).toLocaleString()}</div>
                <div className="text-xs text-gray-500"><strong>IP:</strong> {message.ip} • <strong>UA:</strong> {message.userAgent}</div>
              </div>
              <pre className="whitespace-pre-wrap text-sm bg-[#fafafa] p-3 rounded border">{message.message}</pre>
            </section>

            <section className="bg-white border rounded-xl p-4">
              <h2 className="font-semibold mb-2">Update Status</h2>
              <div className="flex gap-2">
                <button onClick={()=>setStatus('new')} className="rounded-lg h-9 px-3 bg-[#f1f2f4]">New</button>
                <button onClick={()=>setStatus('in_progress')} className="rounded-lg h-9 px-3 bg-[#f1f2f4]">In Progress</button>
                <button onClick={()=>setStatus('closed')} className="rounded-lg h-9 px-3 bg-[#f1f2f4]">Closed</button>
              </div>
            </section>
          </div>

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border rounded-xl p-4">
              <h2 className="font-semibold mb-2">Thread</h2>
              {notes.length === 0 && <p className="text-sm text-gray-500">No replies yet.</p>}
              <ul className="space-y-3">
                {notes.map(n => (
                  <li key={n.id} className="border rounded-lg p-3">
                    <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()} • {n.adminEmail} • {n.channel}</div>
                    <pre className="whitespace-pre-wrap text-sm mt-1">{n.body}</pre>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <h2 className="font-semibold mb-2">Reply to Sender</h2>
              <textarea
                className="w-full border rounded-lg p-3 text-sm min-h-[120px]"
                placeholder="Type your reply email..."
                value={reply}
                onChange={(e)=>setReply(e.target.value)}
              />
              <button
                disabled={updating || !reply.trim()}
                onClick={sendReply}
                className="mt-2 rounded-lg h-10 px-4 bg-blue-600 text-white font-bold disabled:opacity-60"
              >
                {updating ? 'Sending…' : 'Send Reply'}
              </button>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
