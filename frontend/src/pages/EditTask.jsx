import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState(null);
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/tasks/task/${id}`)
      .then(res => {
        const t = res;
        setTask(t);
        setName(t.name);
        setDescription(t.description);
        setStatus(t.status);
        setDeadline(t.deadline);
        setEventId(t.eventId || '');
        setAssignedTo({ label: t.assignedToName, value: t.assignedToId });
      });

    api.get('/api/events/upcoming')
      .then(res => setEvents(res));
  }, [id]);

  const loadUserOptions = (inputValue, callback) => {
    const query = inputValue.trim() || 'a'; // use a default fallback
    api.get(`/api/family/user-search?query=${query}`)
      .then(res => {
        const options = res.map(u => ({
          label: `${u.firstName} ${u.lastName}`,
          value: u.id
        }));
        callback(options);
      })
      .catch(err => {
        console.error('Failed to load user options:', err);
        callback([]);
      });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.put(`/api/tasks/${id}`, {
        name,
        description,
        status,
        deadline,
        assignedToId: assignedTo?.value,
        eventId: eventId || null
      });
      navigate('/admin/tasks');
    } catch (err) {
      console.error(err);
      setError('Failed to update task.');
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isOpen={true} />
      <div className="flex-1">
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
          {error && <div className="text-red-600 mb-2">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Task Name</label>
              <input
                className="border p-2 w-full rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="border p-2 w-full rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                className="border p-2 w-full rounded"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="TODO">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Deadline</label>
              <input
                type="date"
                className="border p-2 w-full rounded"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Assignee</label>
              <AsyncSelect
                cacheOptions
                defaultOptions // important
                loadOptions={loadUserOptions}
                value={assignedTo}
                onChange={setAssignedTo}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Related Event (optional)</label>
              <select
                className="border p-2 w-full rounded"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
              >
                <option value="">None</option>
                {events.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/tasks')}
                className="rounded-full h-10 px-6 bg-gray-300 text-[#111418] text-sm font-medium"
              >
                Back
              </button>
              <button type="submit" className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold">
                Save Changes
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EditTask;
