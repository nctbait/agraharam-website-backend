import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

export default function MatrimonyApproval() {
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with API fetch for pending profiles
    const mockProfiles = [
      { id: '1', name: 'Sophia Clark', email: 'sophia.clark@email.com', date: '2024-07-26' },
      { id: '2', name: 'Ethan Bennett', email: 'ethan.bennett@email.com', date: '2024-07-25' },
      { id: '3', name: 'Olivia Hayes', email: 'olivia.hayes@email.com', date: '2024-07-24' },
      { id: '4', name: 'Liam Foster', email: 'liam.foster@email.com', date: '2024-07-23' },
      { id: '5', name: 'Ava Morgan', email: 'ava.morgan@email.com', date: '2024-07-22' },
    ];
    setProfiles(mockProfiles);
  }, []);

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (id) => {
    if (window.confirm('Approve this profile?')) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      console.log('Approved:', id);
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Reject this profile?')) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      console.log('Rejected:', id);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-40 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Matrimony Admin Approval</h1>
            <p className="text-sm text-[#60748a]">Review and manage pending matrimony registrations.</p>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input w-full max-w-md h-10 rounded-lg border border-[#dde0e3] px-4"
            />
          </div>

          <div className="overflow-x-auto border border-[#dbe0e6] rounded-xl bg-white">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-[#111418]">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-[#111418]">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-[#111418]">Registration Date</th>
                  <th className="px-4 py-3 text-left font-medium text-[#111418]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-[#6a7581]">No pending profiles.</td>
                  </tr>
                ) : (
                  filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="border-t border-[#dde0e3]">
                      <td className="px-4 py-2">{profile.name}</td>
                      <td className="px-4 py-2 text-[#6a7581]">{profile.email}</td>
                      <td className="px-4 py-2 text-[#6a7581]">{profile.date}</td>
                      <td className="px-4 py-2 space-x-2 text-sm font-medium">
                        <button
                          onClick={() => navigate(`/matrimony-profile/${profile.id}`)}
                          className="text-[#0c77f2]"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleApprove(profile.id)}
                          className="text-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(profile.id)}
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
