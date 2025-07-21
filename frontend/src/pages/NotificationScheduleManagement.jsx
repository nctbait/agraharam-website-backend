import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

export default function NotificationScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Replace with real fetch
    const mockSchedules = [
      {
        id: 'event-reminder',
        label: 'Event Reminder',
        trigger: 'eventStartDate',
        timing: '-1 day',
        channels: ['email'],
        active: true
      },
      {
        id: 'membership-renewal',
        label: 'Membership Renewal Reminder',
        trigger: 'membershipEndDate',
        timing: '-7 days',
        channels: ['email', 'sms'],
        active: true
      },
      {
        id: 'registration-confirmation',
        label: 'Registration Confirmation',
        trigger: 'onRegistration',
        timing: 'immediate',
        channels: ['email'],
        active: true
      }
    ];
    setSchedules(mockSchedules);
  }, []);

  const handleToggle = (id) => {
    setSchedules(prev =>
      prev.map(s =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
  };

  const handleEdit = (id) => {
    alert(`Edit schedule config for ${id} (coming soon)`);
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-40 py-6">
          <h1 className="text-2xl font-bold mb-4">Notification Schedule Management</h1>
          <p className="text-sm text-[#60748a] mb-6">
            Configure when each notification type is sent and via which channels.
          </p>

          <div className="overflow-x-auto border border-[#dde0e3] rounded-xl bg-white">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-[#121416]">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-[#121416]">Trigger Field</th>
                  <th className="px-4 py-3 text-left font-medium text-[#121416]">Timing</th>
                  <th className="px-4 py-3 text-left font-medium text-[#121416]">Channels</th>
                  <th className="px-4 py-3 text-left font-medium text-[#121416]">Active</th>
                  <th className="px-4 py-3 text-left font-medium text-[#121416]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id} className="border-t border-[#dde0e3]">
                    <td className="px-4 py-2">{s.label}</td>
                    <td className="px-4 py-2">{s.trigger}</td>
                    <td className="px-4 py-2">{s.timing}</td>
                    <td className="px-4 py-2">{s.channels.join(', ')}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggle(s.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${s.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        {s.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => navigate(`/edit-notification-schedule/${s.id}`)}
                        className="text-[#0c77f2] font-medium text-sm"
                      >
                        Edit
                      </button>

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
