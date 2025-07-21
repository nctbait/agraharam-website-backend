import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

export default function NotificationTemplateManagement() {
    const navigate = useNavigate();

    const templates = [
        { id: 'registration-confirmation', label: 'Registration Confirmation' },
        { id: 'event-reminder', label: 'Event Reminder' },
        { id: 'membership-renewal', label: 'Membership Renewal' },
        { id: 'transaction-receipt', label: 'Financial Transaction Receipt' },
        { id: 'general-announcement', label: 'General Announcement' }
    ];

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

                    <div className="overflow-x-auto border border-[#dde0e3] rounded-xl bg-white mb-6">
                        <table className="min-w-[500px] w-full text-sm">
                            <thead className="bg-[#f9fafb]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[#121416] font-medium">Notification Type</th>
                                    <th className="px-4 py-3 text-left text-[#121416] font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map((tpl) => (
                                    <tr key={tpl.id} className="border-t border-[#dde0e3]">
                                        <td className="px-4 py-2 text-[#121416]">{tpl.label}</td>
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
