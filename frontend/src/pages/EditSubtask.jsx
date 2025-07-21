import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function EditSubtask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subtask, setSubtask] = useState(null);
  const [parentTasks, setParentTasks] = useState([]);

  useEffect(() => {
    // Simulate fetch for subtask data by ID
    const mockSubtask = {
      id,
      name: 'Book venue',
      description: 'Find and confirm tech hall',
      assignedTo: 'volunteer1',
      status: 'todo',
      deadline: '2025-01-05',
      parentTaskId: 'task2'
    };

    // Simulate fetch for parent task list
    const mockParentTasks = [
      { id: 'task1', name: 'Organize Community Meetup' },
      { id: 'task2', name: 'Plan Tech Conference' }
    ];

    setSubtask(mockSubtask);
    setParentTasks(mockParentTasks);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubtask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Subtask:', subtask);
    // TODO: Update via backend
    navigate(`/manage-subtasks/${subtask.parentTaskId}`);
  };

  if (!subtask) return <div className="text-center py-20">Loading subtask...</div>;

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 flex flex-col items-center px-4 lg:px-20 py-6">
          <div className="w-full max-w-xl bg-white rounded-xl shadow p-4">
            <div className="mb-4 text-sm text-[#6a7581]">Edit Subtask</div>
            <h1 className="text-2xl font-bold mb-6">{subtask.name}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label>
                <span className="text-base font-medium">Parent Task</span>
                <select
                  name="parentTaskId"
                  value={subtask.parentTaskId}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] h-12 px-4"
                  disabled // Lock parent selection during edit
                >
                  {parentTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-base font-medium">Subtask Name</span>
                <input
                  name="name"
                  value={subtask.name}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] h-12 px-4"
                />
              </label>
              <label>
                <span className="text-base font-medium">Description</span>
                <textarea
                  name="description"
                  value={subtask.description}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] min-h-24 px-4"
                />
              </label>
              <label>
                <span className="text-base font-medium">Assigned User</span>
                <select
                  name="assignedTo"
                  value={subtask.assignedTo}
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
                  value={subtask.status}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] h-12 px-4"
                >
                  <option value="">Select status</option>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label>
                <span className="text-base font-medium">Deadline</span>
                <input
                  name="deadline"
                  type="date"
                  value={subtask.deadline}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dde0e3] h-12 px-4"
                />
              </label>
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/manage-subtasks/${subtask.parentTaskId}`)}
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
