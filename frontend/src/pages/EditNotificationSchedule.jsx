import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function EditNotificationSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    label: '',
    trigger: '',
    timing: '',
    channels: [],
    active: true
  });

  useEffect(() => {
    // Replace with API fetch
    const mockSchedules = {
      'event-reminder': {
        label: 'Event Reminder',
        trigger: 'eventStartDate',
        timing: '-1 day',
        channels: ['email'],
        active: true
      },
      'membership-renewal': {
        label: 'Membership Renewal',
        trigger: 'membershipEndDate',
        timing: '-7 days',
        channels: ['email', 'sms'],
        active: true
      }
    };

    if (mockSchedules[id]) {
      setForm(mockSchedules[id]);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChannel = (channel) => {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved schedule config:', { id, ...form });
    // TODO: Save to backend
    navigate('/notification-schedule');
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 flex flex-col items-center px-4 lg:px-40 py-6">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 border border-[#dde0e3]">
            <h1 className="text-2xl font-bold mb-6 capitalize">Edit Schedule: {form.label}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <label>
                <span className="text-base font-medium">Trigger Field</span>
                <select
                  name="trigger"
                  value={form.trigger}
                  onChange={handleChange}
                  className="form-select mt-2 w-full h-12 rounded-lg border border-[#dde0e3] px-4"
                >
                  <option value="">Select</option>
                  <option value="eventStartDate">Event Start Date</option>
                  <option value="membershipEndDate">Membership End Date</option>
                  <option value="onRegistration">On Registration</option>
                  <option value="onPayment">On Payment</option>
                </select>
              </label>

              <label>
                <span className="text-base font-medium">Timing</span>
                <input
                  name="timing"
                  value={form.timing}
                  onChange={handleChange}
                  placeholder="-1 day, -7 days, immediate"
                  className="form-input mt-2 w-full h-12 rounded-lg border border-[#dde0e3] px-4"
                />
              </label>

              <div>
                <p className="text-base font-medium mb-2">Channels</p>
                <div className="flex gap-4">
                  {['email', 'sms'].map((channel) => (
                    <label key={channel} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.channels.includes(channel)}
                        onChange={() => handleToggleChannel(channel)}
                      />
                      {channel.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={() => setForm((prev) => ({ ...prev, active: !prev.active }))}
                />
                <span className="text-base font-medium">Active</span>
              </label>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/notification-schedule')}
                  className="rounded-full h-10 px-6 bg-gray-300 text-[#121416] text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
                >
                  Save Changes
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
