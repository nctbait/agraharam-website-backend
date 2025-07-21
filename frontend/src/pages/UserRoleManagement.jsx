import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function UserRoleManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Replace with API call
    const mockUsers = [
      { id: 'u1', name: 'Aarav Rao', email: 'aarav@example.com', role: 'user' },
      { id: 'u2', name: 'Meera Iyer', email: 'meera@example.com', role: 'admin' },
      { id: 'u3', name: 'Rahul Nair', email: 'rahul@example.com', role: 'superAdmin' },
      { id: 'u4', name: 'Ishita Verma', email: 'ishita@example.com', role: 'user' }
    ];
    setUsers(mockUsers);
  }, []);

  const handleRoleChange = (id, newRole) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
    console.log(`User ${id} set to ${newRole}`);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <h1 className="text-2xl font-bold mb-4">User Role Management</h1>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="form-input mb-4 w-full max-w-lg h-10 rounded-lg border border-[#dde0e3] px-4"
          />

          <div className="overflow-x-auto border border-[#dde0e3] rounded-xl bg-white">
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
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t border-[#dde0e3]">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2 text-[#6a7581]">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2 space-x-2 text-sm">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleRoleChange(user.id, 'admin')}
                          className="text-blue-600"
                        >
                          Make Admin
                        </button>
                      )}
                      {user.role !== 'superAdmin' && (
                        <button
                          onClick={() => handleRoleChange(user.id, 'superAdmin')}
                          className="text-indigo-600"
                        >
                          Make SuperAdmin
                        </button>
                      )}
                      {(user.role === 'admin' || user.role === 'superAdmin') && (
                        <button
                          onClick={() => handleRoleChange(user.id, 'user')}
                          className="text-red-600"
                        >
                          Revoke Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
