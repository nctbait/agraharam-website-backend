import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import Footer from '../components/Footer';

const EditNotificationSchedule = () => {
  const { id } = useParams(); // id can be 'new' or an actual ID
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    templateId: '',
    trigger: '',
    timing: '',
    typeOfTiming: '',
    targetCondition: '',
    active: true
  });
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const result = await api.get('/api/admin/notification-templates');
      setTemplates(result);
    };

    const fetchData = async () => {
      if (id !== 'new') {
        
        const result = await api.get(`/api/admin/notification-schedules/${id}`);
        console.log(result);
        setFormData({
          templateId: result.template.id,
          trigger: result.triggerType,
          timing: result.timingOffset.replace(/[^0-9-]/g, ''),
          typeOfTiming: result.typeOfTiming,
          targetCondition: result.targetCondition || '',
          active: result.active
        });
      }
    };

    fetchTemplates();
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    const payload = {
      template: { id: formData.templateId },
      triggerType: formData.trigger,
      timingOffset: `${formData.timing}`,
      typeOfTiming: formData.typeOfTiming,
      targetCondition: formData.targetCondition,
      active: formData.active
    };

    if (id === 'new') {
      await api.post('/api/admin/notification-schedules', payload);
    } else {
      await api.put(`/api/admin/notification-schedules/${id}`, payload);
    }
    navigate('/notification-schedule');
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-xl font-bold mb-6">
            {id === 'new' ? 'Create Notification Schedule' : 'Edit Notification Schedule'}
          </h1>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Template</span>
              <select name="templateId" value={formData.templateId} onChange={handleChange} className="form-select w-full">
                <option value="">-- Select Template --</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Trigger</span>
              <select name="trigger" value={formData.trigger} onChange={handleChange} className="form-select w-full">
                <option value="">-- Select Trigger --</option>
                <option value="eventStartDate">Event Start Date</option>
                <option value="membershipRenewal">Membership Renewal</option>
                <option value="onRegistration">On Registration</option>
                <option value="onEventRegistration">On Event Registration</option>
                <option value="paymentReceived">Payment Received</option>
              </select>
            </label>

            <div className="flex gap-4">
              <label className="w-1/2">
                <span className="text-sm font-medium">Offset Value</span>
                <input type="number" name="timing" value={formData.timing} onChange={handleChange} className="form-input w-full" />
              </label>
              <label className="w-1/2">
                <span className="text-sm font-medium">Offset Unit</span>
                <select name="typeOfTiming" value={formData.typeOfTiming} onChange={handleChange} className="form-select w-full">
                  <option value="">-- Select --</option>
                  <option value="days">Days</option>
                  <option value="hours">Hours</option>
                  <option value="minutes">Minutes</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">Target Condition (optional)</span>
              <textarea
                name="targetCondition"
                value={formData.targetCondition}
                onChange={handleChange}
                rows={3}
                className="form-textarea w-full"
                placeholder='e.g., {"membershipType": "life"}'
              />
            </label>

            <label className="inline-flex items-center mt-4">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="mr-2" />
              <span className="text-sm">Active</span>
            </label>

            <div className="mt-6">
              <button onClick={handleSave} className="rounded-full h-10 px-6 bg-[#f1f2f4] text-[#121416] text-sm font-bold">
                Save
              </button>
              <button
                onClick={() => navigate('/notification-schedule')}
                className="rounded-full h-10 px-6 bg-[#f1f2f4] text-[#121416] text-sm font-bold"
              >
                Manage Schedule
              </button>
              <button
                onClick={() => navigate('/admin/notification-management')}
                className="rounded-full h-10 px-6 bg-[#f1f2f4] text-[#121416] text-sm font-bold"
              >
                Manage Notification Templates
              </button>
            </div>
            <div className="flex justify-between flex-wrap gap-4 mt-6">


            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default EditNotificationSchedule;
