import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';


export default function CreateSubtask() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultParentId = searchParams.get('parent') || '';
  const [parentTasks, setParentTasks] = useState([]);
  const [form, setForm] = useState({
    parentTaskId: defaultParentId,
    name: '',
    description: '',
    assignedTo: '',
    status: '',
    deadline: ''
  });
  
  
  
  useEffect(() => {
    // Replace this mock data with real API fetch
    const mockParentTasks = [
      { id: 'task1', name: 'Organize Community Meetup' },
      { id: 'task2', name: 'Plan Tech Conference' },
    ];
    setParentTasks(mockParentTasks);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Subtask:', form);
    // TODO: Send to backend
    navigate('/manage-tasks');
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 flex flex-col items-center px-4 lg:px-20 py-6">
          <div className="w-full max-w-xl bg-white rounded-xl shadow p-4">
            <div className="mb-4 flex items-center gap-2 text-sm text-[#6a7581]">
              <a href="/manage-tasks" className="underline">Tasks</a>
              <span>/</span>
              <span className="text-[#121416] font-semibold">Create Subtask</span>
            </div>
            <h1 className="text-2xl font-bold mb-6">Create Subtask</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label>
                <span className="text-base font-medium">Parent Task</span>
                <select
                  name="parentTaskId"
                  value={form.parentTaskId}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] h-12 px-4"
                  required
                >
                  <option value="">Select parent task</option>
                  {parentTasks.map((task) => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-base font-medium">Subtask Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter subtask name"
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] h-12 px-4"
                  required
                />
              </label>
              <label>
                <span className="text-base font-medium">Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter subtask description"
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] min-h-24 px-4"
                />
              </label>
              <label>
                <span className="text-base font-medium">Assigned User (Optional)</span>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] h-12 px-4"
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
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] h-12 px-4"
                  required
                >
                  <option value="">Select status</option>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label>
                <span className="text-base font-medium">Deadline (Optional)</span>
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] h-12 px-4"
                />
              </label>
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/manage-tasks')}
                  className="rounded-full h-10 px-6 bg-gray-300 text-[#121416] text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
                >
                  Create Subtask
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
