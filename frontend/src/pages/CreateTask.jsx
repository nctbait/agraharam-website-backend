import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import api from '../api/authAxios';
import AdminSidebar from '../components/AdminSidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'PENDING',
    deadline: '',
    assignedTo: null,
    eventId: ''
  });

  const [eventOptions, setEventOptions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/events/upcoming')
      .then(res => {
        const data = res || [];
        const options = data.map(event => ({
          value: event.id,
          label: `${event.title} - ${event.date}`
        }));
        setEventOptions(options);
      })
      .catch(err => {
        console.error('Failed to load event options:', err);
        setEventOptions([]);
      });
  }, []);

  const loadUserOptions = (inputValue, callback) => {
    api.get(`/api/family/user-search?query=${inputValue}`)
      .then(res => {
        const options = res.map(user => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName} (${user.email})`
        }));
        callback(options);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      assignedToId: form.assignedTo?.value || null,
      eventId: form.eventId || null
    };
    try {
      await api.post('/api/tasks', payload);
      navigate('/admin/tasks');
    } catch (err) {
      console.error('Task creation failed:', err);
      setError('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isOpen={true} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Create Task</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Task name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadUserOptions}
              value={form.assignedTo}
              onChange={(selected) => setForm({ ...form, assignedTo: selected })}
              placeholder="Assign to user..."
            />

            <select
              value={form.eventId}
              onChange={(e) => setForm({ ...form, eventId: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">No event</option>
              {eventOptions.map(event => (
                <option key={event.value} value={event.value}>{event.label}</option>
              ))}
            </select>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/tasks')}
                className="rounded-full h-10 px-6 bg-gray-300 text-[#111418] text-sm font-medium"
              >
                Back
              </button>

              <button type="submit" className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold">
                Create Task
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CreateTask;
