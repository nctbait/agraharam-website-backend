// AdminMatrimonyApprovals.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const AdminMatrimonyApprovals = () => {
  const [profiles, setProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  const fetchPendingProfiles = async () => {
    const res = await api.get('/api/matrimony/pending');
    setProfiles(res);
    setFiltered(res);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      profiles.filter(p =>
        (p.name || '').toLowerCase().includes(value) ||
        (p.contactEmail || '').toLowerCase().includes(value) ||
        (p.contactPhone || '').toLowerCase().includes(value) ||
        (p.gothram || '').toLowerCase().includes(value) ||
        (p.vedam || '').toLowerCase().includes(value) ||
        (p.fatherName || '').toLowerCase().includes(value)
      )
    );
  };

  const handleSingleAction = async (id, action) => {
    await api.post(`/api/matrimony/${id}/${action}`);
    const remaining = filtered.filter(p => p.id !== id);
    setProfiles(remaining);
    setFiltered(remaining);
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Pending Matrimony Approvals</h2>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name, contact, gothram, vedam..."
              className="border border-gray-300 px-3 py-2 rounded w-80"
            />
          </div>

          <div className="overflow-x-auto rounded shadow border">
            <table className="min-w-full text-sm text-left table-auto">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <th className="p-2">Name</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Father's Name</th>
                  <th className="p-2">Gothram</th>
                  <th className="p-2">Vedam</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p, idx) => (
                  <tr key={`profile-${p.id || idx}`} className="hover:bg-gray-50">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.contactPhone}</td>
                    <td className="p-2">{p.contactEmail}</td>
                    <td className="p-2">{p.fatherName}</td>
                    <td className="p-2">{p.gothram}</td>
                    <td className="p-2">{p.vedam}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => navigate(`/admin/matrimony/${p.id}`)}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                      >
                        View
                      </button>
                     {/* <button
                        onClick={() => handleSingleAction(p.id, 'approve')}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleSingleAction(p.id, 'reject')}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Reject
                      </button>*/}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No pending profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminMatrimonyApprovals;
