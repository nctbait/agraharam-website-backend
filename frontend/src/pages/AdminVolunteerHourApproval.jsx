// AdminVolunteerHourApprovals.jsx
import { useEffect, useState } from 'react';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminVolunteerHourApprovals() {
  const [entries, setEntries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/admin/volunteer-hours/pending').then(response => {
      const data = response || [];
      setEntries(data);
      setFiltered(data);
    });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      entries.filter(entry =>
        (entry.name || '').toLowerCase().includes(value) ||
        (entry.relationship || '').toLowerCase().includes(value) ||
        (entry.description || '').toLowerCase().includes(value) ||
        (entry.eventName || '').toLowerCase().includes(value) ||
        (entry.committeeName || '').toLowerCase().includes(value)
      )
    );
  };

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selected.length === 0) return;
    await api.post(`/api/admin/volunteer-hours/bulk/${action}`, selected);
    const remaining = filtered.filter(e => !selected.includes(e.id));
    setEntries(remaining);
    setFiltered(remaining);
    setSelected([]);
  };

  const handleSingleAction = async (id, action) => {
    await api.post(`/api/admin/volunteer-hours/${id}/${action}`);
    const remaining = filtered.filter(e => e.id !== id);
    setEntries(remaining);
    setFiltered(remaining);
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Pending Volunteer Hour Approvals</h2>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name, relationship, event, committee, description..."
              className="border border-gray-300 px-3 py-2 rounded w-96"
            />
          </div>

          <div className="overflow-x-auto rounded shadow border">
            <table className="min-w-full text-sm text-left table-auto">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <th className="p-2">
                    <input
                      type="checkbox"
                      onChange={e =>
                        setSelected(e.target.checked ? filtered.map(e => e.id) : [])
                      }
                      checked={selected.length === filtered.length && filtered.length > 0}
                    />
                  </th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Member</th>
                  <th className="p-2">Relationship</th>
                  <th className="p-2">Hours</th>
                  <th className="p-2">Event</th>
                  <th className="p-2">Committee</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((e, idx) => (
                  <tr key={`vh-${e.id || idx}`} className="hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(e.id)}
                        onChange={() => toggleSelect(e.id)}
                      />
                    </td>
                    <td className="p-2">{e.date}</td>
                    <td className="p-2">{e.name}</td>
                    <td className="p-2">{e.relationship}</td>
                    <td className="p-2">{e.hours}</td>
                    <td className="p-2">{e.eventName || '-'}</td>
                    <td className="p-2">{e.committeeName}</td>
                    <td className="p-2">{e.description}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleSingleAction(e.id, 'approve')}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleSingleAction(e.id, 'reject')}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-500">
                      No pending volunteer hour entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selected.length > 0 && (
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => handleBulkAction('approve')}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve Selected
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject Selected
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
