import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function CreateSubtask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    assignedTo: null,
    status: 'PENDING',
    deadline: ''
  });
  const [error, setError] = useState('');

  const loadUserOptions = (inputValue, callback) => {
    const q = (inputValue || '').trim() || 'a';
    api.get(`/api/family/user-search?query=${q}`).then(res => {
      const opts = (res || []).map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName} (${u.email})` }));
      callback(opts);
    }).catch(() => callback([]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/api/subtasks`, {
        name: form.name,
        description: form.description,
        status: form.status,
        deadline: form.deadline || null,
        assignedToId: form.assignedTo?.value || null,
        parentTaskId:`${taskId}`
      });
      navigate(`/manage-subtasks/${taskId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to create subtask.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Create Subtask</h2>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Subtask name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <select
              className="w-full border rounded px-3 py-2"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
            />
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadUserOptions}
              value={form.assignedTo}
              onChange={(v) => setForm({ ...form, assignedTo: v })}
              placeholder="Assign to user (optional)"
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(`/manage-subtasks/${taskId}`)} className="px-4 py-2 rounded bg-gray-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
                Create
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}
