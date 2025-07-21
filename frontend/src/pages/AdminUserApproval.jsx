import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminUserApproval() {
  const [search, setSearch] = useState('');
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("jwtToken"); // or sessionStorage, depending on your app
    if (!token) return;
  
    axios.get(`${API_BASE}/api/pending-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(res => setPendingUsers(res.data))
    .catch(err => console.error("Failed to fetch users", err));
  }, []);
  
  const filtered = pendingUsers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async (id) => {
    const token = localStorage.getItem("jwtToken"); // or sessionStorage, depending on your app
      if (!token) return;
    if (window.confirm("Approve this user?")) {
      await axios.post(`${API_BASE}/api/user/${id}/approve`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setPendingUsers(prev => prev.filter(u => u.id !== id));
    }
  };
  

  const handleReject = async (id) => {
    const token = localStorage.getItem("jwtToken"); // or sessionStorage, depending on your app
      if (!token) return;
    if (window.confirm("Reject this user?")) {
      await axios.post(`${API_BASE}/api/user/${id}/reject`, {},{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setPendingUsers(prev => prev.filter(u => u.id !== id));
    }
  };  

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-40 py-6">
          <h1 className="text-2xl font-bold mb-2">Admin Approval</h1>
          <p className="text-sm text-[#60748a] mb-4">Review and manage pending user registrations.</p>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="form-input mb-4 w-full max-w-lg h-10 rounded-lg border border-[#dde0e3] px-4"
          />

          <div className="overflow-x-auto border border-[#dbe0e6] rounded-xl bg-white">
            <table className="min-w-[640px] w-full text-sm">
              <thead>
                <tr className="bg-[#f9fafb]">
                  <th className="px-4 py-3 text-left text-[#111418] font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-[#111418] font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-[#111418] font-medium">Registration Date</th>
                  <th className="px-4 py-3 text-left text-[#111418] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-[#6a7581]">No pending users found.</td>
                  </tr>
                ) : (
                  filtered.map(user => (
                    <tr key={user.id} className="border-t border-[#dde0e3]">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2 text-[#6a7581]">{user.email}</td>
                      <td className="px-4 py-2 text-[#6a7581]">{user.date}</td>
                      <td className="px-4 py-2 space-x-2 text-sm font-medium">
                        <button
                          onClick={() => navigate(`/user-profile/${user.id}`)}
                          className="text-[#0c77f2]"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="text-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          className="text-red-600"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
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
