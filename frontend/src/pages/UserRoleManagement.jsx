import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';

export default function UserRoleManagement() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const res = await api.get('/api/admin/users/admins');
      setAdmins(res || []);
    } catch (err) {
      console.error('Failed to load admins', err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await api.get(`/api/admin/users/search?query=${searchTerm}`);
      setSearchResults(res || []);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.post(`/api/admin/users/${userId}/role`, { role: newRole });
      await loadAdmins(); // refresh admin list
      setSearchResults(prev => prev.filter(u => u.id !== userId)); // clean up if from search
    } catch (err) {
      console.error('Failed to change role', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6 space-y-8">
          <h1 className="text-2xl font-bold mb-4">User Role Management</h1>

          {/* Search Section */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search users by name or email"
                className="form-input w-full max-w-lg h-10 rounded-lg border border-[#dde0e3] px-4"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Search
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="overflow-x-auto border border-[#dde0e3] rounded-xl">
                <table className="min-w-[640px] w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map(user => (
                      <tr key={user.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">{user.fullName}</td>
                        <td className="px-4 py-2 text-gray-600">{user.email}</td>
                        <td className="px-4 py-2 space-x-3">
                          <button
                            onClick={() => handleRoleChange(user.id, 'admin')}
                            className="text-blue-600 hover:underline"
                          >
                            Make Admin
                          </button>
                          <button
                            onClick={() => handleRoleChange(user.id, 'superAdmin')}
                            className="text-indigo-600 hover:underline"
                          >
                            Make SuperAdmin
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Admins / SuperAdmins Table */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Current Admins and SuperAdmins</h2>
            <div className="overflow-x-auto border border-[#dde0e3] rounded-xl">
              <table className="min-w-[640px] w-full text-sm">
                <thead className="bg-[#f9fafb]">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Current Role</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(user => (
                    <tr key={user.id} className="border-t border-[#dde0e3]">
                      <td className="px-4 py-2">{user.fullName}</td>
                      <td className="px-4 py-2 text-gray-600">{user.email}</td>
                      <td className="px-4 py-2 capitalize">{user.role}</td>
                      <td className="px-4 py-2 space-x-3">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleRoleChange(user.id, 'admin')}
                            className="text-blue-600 hover:underline"
                          >
                            Make Admin
                          </button>
                        )}
                        {user.role !== 'superAdmin' && (
                          <button
                            onClick={() => handleRoleChange(user.id, 'superAdmin')}
                            className="text-indigo-600 hover:underline"
                          >
                            Make SuperAdmin
                          </button>
                        )}
                        <button
                          onClick={() => handleRoleChange(user.id, 'user')}
                          className="text-red-600 hover:underline"
                        >
                          Revoke Role
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-gray-500">
                        No current admins found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
