import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import Footer from '../components/Footer';

const NotificationScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/api/admin/notification-schedules');
      setSchedules(res || []);
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Notification Schedule Management</h1>
            <button
              onClick={() => navigate('/edit-notification-schedule/new')}
              className="rounded-full h-10 px-6 bg-[#f1f2f4] text-[#121416] text-sm font-bold"
            >
              + Create New Schedule
            </button>
          </div>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Template</th>
                <th className="border px-4 py-2 text-left">Trigger</th>
                <th className="border px-4 py-2 text-left">Timing</th>
                <th className="border px-4 py-2 text-left">Condition</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td className="border px-4 py-2">{s.template?.title || '—'}</td>
                  <td className="border px-4 py-2">{s.triggerType}</td>
                  <td className="border px-4 py-2">{s.timingOffset}</td>
                  <td className="border px-4 py-2 text-gray-600">
                    {s.targetCondition?.substring(0, 50) || '—'}
                    {s.targetCondition?.length > 50 && '...'}
                  </td>
                  <td className="border px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${s.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => navigate(`/edit-notification-schedule/${s.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {schedules.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No schedules found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between flex-wrap gap-4 mt-6">
                        <button
                            onClick={() => navigate('/admin/notification-management')}
                            className="rounded-full h-10 px-6 bg-[#f1f2f4] text-[#121416] text-sm font-bold"
                        >
                            Manage Notification Templates
                        </button>

                    </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default NotificationScheduleManagement;
