import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import AdminSidebar from '../components/AdminSidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const fetchTasks = () => {
    const params = new URLSearchParams({
      page,
      size: 10,
      ...(statusFilter && { status: statusFilter }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    });

    api.get(`/api/tasks/page?${params.toString()}`)
      .then(res => {
        setTasks(res.content);
        setTotalPages(res.totalPages);
      });
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    await api.delete(`/api/tasks/${taskId}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, startDate, endDate]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isOpen={true} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Manage Tasks</h2>
            <button
              className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
              onClick={() => navigate('/create-task')}
            >
              Create New Task
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <select
              className="border px-2 py-1 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start date"
            />

            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End date"
            />
          </div>

          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Assignee</th>
                <th className="border px-2 py-1">Deadline</th>
                <th className="border px-2 py-1">Event</th>
                <th className="border px-2 py-1">Created At</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="border px-2 py-1">{task.name}</td>
                  <td className="border px-2 py-1">{task.status}</td>
                  <td className="border px-2 py-1">{task.assignedToName}</td>
                  <td className="border px-2 py-1">{task.deadline}</td>
                  <td className="border px-2 py-1">{task.eventTitle || '—'}</td>
                  <td className="border px-2 py-1">{task.createDateTime?.split('T')[0]}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => navigate(`/edit-task/${task.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/create-subtask/${task.id}`)}
                      className="text-green-700 hover:underline"
                      title="Create subtask"
                    >
                      + Subtask
                    </button>
                    <button
                      onClick={() => navigate(`/manage-subtasks/${task.id}`)}
                      className="text-indigo-700 hover:underline"
                      title="Manage subtasks"
                    >
                      Manage Subtasks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </button>
            <span>Page {page + 1} of {totalPages}</span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page + 1 >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ManageTasks;
