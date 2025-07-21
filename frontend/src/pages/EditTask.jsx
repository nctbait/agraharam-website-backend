import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    // Simulate fetching task by ID
    const mockTask = {
      id,
      name: 'Plan tech conference',
      description: 'Coordinate vendors, speakers, and volunteers',
      assignedTo: 'admin1',
      status: 'inprogress',
      event: 'Tech Fest 2025',
      deadline: '2025-01-15'
    };

    // Replace this with actual fetch logic
    setForm(mockTask);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated task:', form);
    // TODO: Update task in backend
    navigate('/manage-tasks');
  };

  if (!form) return <div className="text-center py-20">Loading task...</div>;

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 flex flex-col items-center px-4 lg:px-20 py-6">
          <div className="w-full max-w-xl bg-white rounded-xl shadow p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label>
                <span className="text-base font-medium">Task Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] px-4 h-12"
                />
              </label>
              <label>
                <span className="text-base font-medium">Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] px-4 min-h-24"
                />
              </label>
              <label>
                <span className="text-base font-medium">Assigned User</span>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] px-4 h-12"
                >
                  <option value="">Select user</option>
                  <option value="volunteer1">Volunteer 1</option>
                  <option value="admin1">Admin 1</option>
                  <option value="superadmin1">Super Admin 1</option>
                </select>
              </label>
              <label>
                <span className="text-base font-medium">Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] px-4 h-12"
                >
                  <option value="">Select status</option>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label>
                <span className="text-base font-medium">Event (Optional)</span>
                <input
                  name="event"
                  value={form.event}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] px-4 h-12"
                />
              </label>
              <label>
                <span className="text-base font-medium">Deadline (Optional)</span>
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] px-4 h-12"
                />
              </label>
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/manage-tasks')}
                  className="rounded-full h-10 px-6 bg-gray-300 text-[#111418] text-sm font-medium"
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
