import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';

export default function AdminAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');

    const [excludedActions, setExcludedActions] = useState(['LOGIN_ATTEMPT', 'LOGIN_SUCCESS', 'LOGOUT']);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 25;

    useEffect(() => {
        const fetchLogs = async () => {
            const params = new URLSearchParams();
            excludedActions.forEach(action => params.append('exclude', action));
            params.append('page', page);
            params.append('size', pageSize);
            const response = await api.get(`/api/admin/audit/logs?${params.toString()}`);
            setLogs(response.content || []);
            setTotalPages(response.totalPages || 0);
        };
        fetchLogs();
    }, [excludedActions, page]);


    const filtered = logs.filter(l =>
        l.actorEmail?.toLowerCase().includes(search.toLowerCase()) ||
        l.action?.toLowerCase().includes(search.toLowerCase()) ||
        l.targetType?.toLowerCase().includes(search.toLowerCase()) ||
        l.details?.toLowerCase().includes(search.toLowerCase())
    );




    return (
        <>
            <Navbar />
            <div className="flex">
                <AdminSidebar isOpen={true} />
                <div className="max-w-6xl mx-auto p-6">
                    <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by actor, action, target type, or details..."
                        className="mb-4 border px-3 py-2 rounded w-full"
                    />
                    <div className="mb-4">
                        <label className="font-semibold mb-2 block">Exclude Actions:</label>
                        {['LOGIN_ATTEMPT', 'LOGIN_SUCCESS', 'LOGOUT'].map(action => (
                            <label key={action} className="mr-4">
                                <input
                                    type="checkbox"
                                    className="mr-1"
                                    checked={excludedActions.includes(action)}
                                    onChange={() => {
                                        setExcludedActions(prev =>
                                            prev.includes(action)
                                                ? prev.filter(a => a !== action)
                                                : [...prev, action]
                                        );
                                    }}
                                />
                                {action}
                            </label>
                        ))}
                    </div>

                    <div className="overflow-x-auto rounded shadow border">
                        <table className="min-w-full text-sm table-auto">
                            <thead className="bg-gray-100 text-xs text-gray-700 uppercase tracking-wider">
                                <tr>
                                    <th className="p-2">Time</th>
                                    <th className="p-2">Actor</th>
                                    <th className="p-2">Action</th>
                                    <th className="p-2">Target</th>
                                    <th className="p-2">Details</th>
                                    <th className="p-2">IP</th>
                                    <th className="p-2">Agent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="p-2">{log.actorEmail}</td>
                                        <td className="p-2">{log.action}</td>
                                        <td className="p-2">{log.targetType} - {log.targetId}</td>
                                        <td className="p-2 whitespace-pre-wrap">{log.details}</td>
                                        <td className="p-2">{log.ipAddress}</td>
                                        <td className="p-2 text-xs text-gray-600">{log.userAgent?.slice(0, 40)}...</td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center p-4 text-gray-500">No logs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end items-center gap-2 mt-4">
                        <button
                            onClick={() => setPage(p => Math.max(p - 1, 0))}
                            disabled={page === 0}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="text-sm">Page {page + 1} of {totalPages}</span>
                        <button
                            onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                            disabled={page + 1 >= totalPages}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}
