import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import api from '../api/authAxios';

export default function NotificationTemplateManagement() {
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        api.get('/api/admin/notification-templates').then(setTemplates);
    }, []);


    return (
        <>
            <Navbar />
            <div className="flex">
                <AdminSidebar isOpen={true} />
                <main className="flex-1 px-4 lg:px-40 py-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Notification Templates</h1>
                        <p className="text-sm text-[#60748a]">
                            Customize the email and message notifications sent to members.
                        </p>
                    </div>

                    <div className="mb-4 text-right">
                        <button
                            onClick={() => navigate('/edit-notification-template/new')}
                            className="rounded-full h-10 px-6 bg-[#f1f2f4] text-[#121416] text-sm font-bold"
                        >
                            + Add New Template
                        </button>
                    </div>


                    <div className="overflow-x-auto border border-[#dde0e3] rounded-xl bg-white mb-6">
                        <table className="min-w-[500px] w-full text-sm">
                            <thead className="bg-[#f9fafb]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[#121416] font-medium">Notification Type</th>
                                    <th className="px-4 py-3 text-left text-[#121416] font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map(tpl => (
                                    <tr key={tpl.id} className="border-t border-[#dde0e3]">
                                        <td className="px-4 py-2 text-[#121416]">
                                            <div className="font-semibold">{tpl.title}</div>
                                            <div className="text-xs text-gray-500">{tpl.type} • {tpl.channel}</div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => navigate(`/edit-notification-template/${tpl.id}`)}
                                                className="text-[#0c77f2] font-medium"
                                            >
                                                View/Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between flex-wrap gap-4 mt-6">
                        <button
                            onClick={() => navigate('/notification-schedule')}
                            className="rounded-full h-10 px-6 bg-[#f1f2f4] text-[#121416] text-sm font-bold"
                        >
                            Manage Schedule
                        </button>

                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
