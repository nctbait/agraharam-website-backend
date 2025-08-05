import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';

export default function AdminVolunteerSearch() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchVolunteerData = async () => {
            const response = await api.get('/api/volunteer-interest/all');
            setData(response || []);
        };
        fetchVolunteerData();
    }, []);

    const filtered = data.filter(entry => {
        const searchLower = search.toLowerCase();
        return (
            entry.memberName?.toLowerCase().includes(searchLower) ||
            entry.relationship?.toLowerCase().includes(searchLower) ||
            entry.email?.toLowerCase().includes(searchLower) ||
            entry.phone?.toLowerCase().includes(searchLower) ||
            entry.committees?.some(c => c.name.toLowerCase().includes(searchLower)) ||
            entry.events?.some(e =>
                e.title.toLowerCase().includes(searchLower) ||
                e.date?.toLowerCase().includes(searchLower) ||
                e.venue?.toLowerCase().includes(searchLower)
            )
        );
    });


    return (
        <>
            <Navbar />
            <div className="flex">
                <AdminSidebar isOpen={sidebarOpen} />
                <div className="flex-1 p-6">

                    <h2 className="text-2xl font-bold mb-4">Volunteer Interests</h2>

                    <input
                        type="text"
                        placeholder="Search by name, contact, committee, or event..."
                        className="w-full mb-4 p-2 border rounded"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />


                    <div className="border rounded shadow overflow-hidden">
                        <div className="overflow-y-auto max-h-[600px]">
                            <table className="min-w-full text-sm text-left table-auto">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        <th className="p-2">Name</th>
                                        <th className="p-2">Contact</th>
                                        <th className="p-2">Relationship</th>
                                        <th className="p-2">Committees</th>
                                        <th className="p-2">Events</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map((entry, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="p-2">{entry.memberName}</td>
                                            <td className="p-2">
                                                {entry.email && <div>{entry.email}</div>}
                                                {entry.phone && <div className="text-xs text-gray-600">{entry.phone}</div>}
                                            </td>
                                            <td className="p-2">{entry.relationship}</td>
                                            <td className="p-2">{entry.committees.map(c => c.name).join(', ')}</td>
                                            <td className="p-2">
                                                {entry.events.map(e => (
                                                    <div key={e.id} className="mb-1">
                                                        <div className="text-sm font-medium">{e.title}</div>
                                                        <div className="text-xs text-gray-500">{e.date} @ {e.venue}</div>
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-4 text-center text-gray-500">
                                                No matching records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>
            </div>
            <Footer />
        </>
    );
}
