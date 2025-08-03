import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';


export default function EditNotificationTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    channel: '',
    subject: '',
    body: '',
    active: ''
  });

  useEffect(() => {
    if (!isNew) {
      api.get(`/api/admin/notification-templates/${id}`).then(setFormData);
    }
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isNew) {
      await api.post('/api/admin/notification-templates', formData);
    } else {
      await api.put(`/api/admin/notification-templates/${id}`, formData);
    }
    navigate('/admin/notification-management');
  };


  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 flex flex-col items-center px-4 lg:px-40 py-6">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6 border border-[#dde0e3]">
            <h1 className="text-2xl font-bold mb-6 capitalize">
              Edit Template: {id.replace(/-/g, ' ')}
            </h1>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <input
                placeholder="Subject Line"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input mt-2 w-full h-12 rounded-lg border border-[#dde0e3] px-4"
                required
              />
              <input
                placeholder="Title for Admin purpose"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input mt-2 w-full h-12 rounded-lg border border-[#dde0e3] px-4"
                required
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Notification Reason --</option>
                <option value="registration">User Registration</option>
                <option value="registration">User Registration Approval</option>
                <option value="registration">Matrimony Registration Approval</option>
                <option value="eventReminder">Event Reminders for Registration</option>
                <option value="eventReminder">Event Reminder for Registered Users</option>
                <option value="paymentSuccess">Payment Success</option>
                <option value="membershipRenewal">Membership Renewal</option>
                <option value="membershipRenewal">Volunteer Hour Approval</option>
                <option value="membershipRenewal">Membership Upgrade</option>
                <option value="membershipRenewal">Bill Approval</option>
                <option value="membershipRenewal">Task Assigned</option>
                <option value="membershipRenewal">Tax Document Generated</option>
              </select>
              <select
                name="channel"
                value={formData.channel}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Communitcation Channel --</option>
                <option value="inApp">In-App Notification</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
              <textarea
                name="body"
                rows="5"
                placeholder="Notification Body (can include variables like {name})"
                value={formData.body}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <select
                name="active"
                value={formData.active}
                onChange={handleChange}
                className="form-select"
              >
                <option value="true">Activate Template</option>
                <option value="false">Deactivate Template</option>
              </select>
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/notification-management')}
                  className="rounded-full h-10 px-6 bg-gray-300 text-[#121416] text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
