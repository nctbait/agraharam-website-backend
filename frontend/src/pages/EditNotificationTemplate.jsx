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
    active: '',
    variables: []  // <-- Add this
  });

  useEffect(() => {
    if (!isNew) {
      api.get(`/api/admin/notification-templates/${id}`).then(setFormData);
    }
  }, [id]);

  const handleVariableChange = (index, field, value) => {
    const updated = [...formData.variables];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, variables: updated }));
  };

  const addVariable = () => {
    setFormData(prev => ({
      ...prev,
      variables: [...prev.variables, { name: '', source: '' }]
    }));
  };

  const removeVariable = (index) => {
    const updated = [...formData.variables];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, variables: updated }));
  };

  const extractPlaceholders = (text) => {
    const matches = text.match(/{(.*?)}/g) || [];
    return matches.map(v => v.replace(/[{}]/g, ''));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const placeholders = extractPlaceholders(formData.body);
    const mappedVars = (formData.variables || []).map(v => v.name);

    const missing = placeholders.filter(p => !mappedVars.includes(p));
    if (missing.length > 0) {
      alert(`Missing variable mapping(s) for: ${missing.join(', ')}`);
      return;
    }

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
                <option value="userRegistration">User Registration</option>
                <option value="userApproval">User Registration Approval</option>
                <option value="matrimonyApproval">Matrimony Registration Approval</option>
                <option value="eventUpcomingAll">Event Reminders for Registration</option>
                <option value="eventUpcomingRegistered">Event Reminder for Registered Users</option>
                <option value="paymentSuccess">Payment Success</option>
                <option value="membershipRenewal">Membership Renewal</option>
                <option value="volunteerHourApproved">Volunteer Hour Approval</option>
                <option value="membershipUpgrade">Membership Upgrade</option>
                <option value="billApproved">Bill Approval</option>
                <option value="taskAssigned">Task Assigned</option>
                <option value="taxDocumentGenerated">Tax Document Generated</option>
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

              <div className="mt-6 border p-4 rounded">
                <h3 className="font-semibold mb-2">Variable Mappings</h3>
                {formData.variables.map((v, index) => (
                  <div key={index} className="flex gap-4 mb-2">
                    <input
                      type="text"
                      className="form-input flex-1"
                      placeholder="Variable name (e.g., eventName)"
                      value={v.name}
                      onChange={e => handleVariableChange(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input flex-1"
                      placeholder="Source (e.g., event.title)"
                      value={v.source}
                      onChange={e => handleVariableChange(index, 'source', e.target.value)}
                    />
                    <button onClick={(e) => { e.preventDefault(); removeVariable(index); }} className="text-red-500 font-bold">
                      ✕
                    </button>
                  </div>
                ))}
                <button onClick={(e) => { e.preventDefault(); addVariable(); }} className="mt-2 text-sm text-blue-600">
                  + Add Variable
                </button>
              </div>

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
