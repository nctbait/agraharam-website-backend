import { useEffect, useState } from 'react';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminMembershipApprovals() {
    const [requests, setRequests] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/api/admin/memberships/pending').then(data => {
            setRequests(data);
            setFiltered(data);
        });
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFiltered(
            requests.filter(r =>
                r.userName.toLowerCase().includes(value) ||
                r.userEmail.toLowerCase().includes(value) ||
                r.membershipTypeName.toLowerCase().includes(value)
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
        await api.post(`/api/admin/memberships/${action}`,  {ids: selected });
        const remaining = filtered.filter(r => !selected.includes(r.id));
        setRequests(remaining);
        setFiltered(remaining);
        setSelected([]);
    };

    const handleSingleAction = async (id, action) => {
        await api.post(`/api/admin/memberships/${action}`,  {ids: [id] });
        const remaining = filtered.filter(r => r.id !== id);
        setRequests(remaining);
        setFiltered(remaining);
    };


    return (
        <>
            <Navbar />
            <div className="flex">
                <AdminSidebar isOpen={true} />
                <div className="max-w-6xl mx-auto p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Pending Membership Approvals</h2>
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search by name, email, membership..."
                            className="border border-gray-300 px-3 py-2 rounded w-80"
                        />
                    </div>

                    <div className="overflow-x-auto rounded shadow border">
                        <table className="min-w-full text-sm text-left table-auto">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <th className="p-2"><input type="checkbox" /></th>
                                    <th className="p-2">User</th>
                                    <th className="p-2">Membership</th>
                                    <th className="p-2">Confirmation #</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2">Method</th>
                                    <th className="p-2">Dates</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map(req => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="p-2">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(req.id)}
                                                onChange={() => toggleSelect(req.id)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <div className="font-medium">{req.userName}</div>
                                            <div className="text-xs text-gray-500">{req.userEmail}</div>
                                        </td>
                                        <td className="p-2">{req.membershipTypeName}</td>
                                        <td className="p-2">{req.confirmation}</td>
                                        <td className="p-2">${req.amount}</td>
                                        <td className="p-2 capitalize">{req.paymentMethod}</td>
                                        <td className="p-2 text-xs">
                                            {req.startDate} <br />→ {req.endDate}
                                        </td>
                                        <td className="p-2 space-x-2">
                                            <button
                                                onClick={() => handleSingleAction(req.id, 'approve')}
                                                className="text-green-600 hover:underline text-sm"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleSingleAction(req.id, 'reject')}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-4 text-center text-gray-500">
                                            No pending approvals found.
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
