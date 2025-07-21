import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with API fetch
    const mockTasks = [
      {
        id: 'task1',
        name: 'Organize community meetup',
        assignedTo: 'Ethan Carter',
        status: 'In Progress',
        deadline: '2024-08-15',
        subtasks: 2,
        event: 'Ugadi 2024'
      },
      {
        id: 'task2',
        name: 'Plan tech conference',
        assignedTo: 'Olivia Bennett',
        status: 'Completed',
        deadline: '2024-07-20',
        subtasks: 0,
        event: ''
      }
    ];
    setTasks(mockTasks);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Tasks</h1>
            <button
              onClick={() => navigate('/create-task')}
              className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
            >
              + New Task
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#dde0e3] bg-white">
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="bg-white">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Task</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Assigned To</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Deadline</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Event</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-t border-[#dde0e3]">
                    <td className="px-4 py-2 text-sm text-[#121416]">{task.name}</td>
                    <td className="px-4 py-2 text-sm text-[#6a7581]">{task.assignedTo || '-'}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className="rounded-full px-3 py-1 bg-[#f1f2f4] text-sm font-medium">{task.status}</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-[#6a7581]">{task.deadline || '-'}</td>
                    <td className="px-4 py-2 text-sm text-[#6a7581]">{task.event || '—'}</td>
                    <td className="px-4 py-2 text-sm font-medium text-[#0c77f2] space-x-2">
                      <button onClick={() => navigate(`/edit-task/${task.id}`)}>Edit</button>
                      <button onClick={() => navigate(`/manage-subtasks/${task.id}`)}>Subtasks</button>
                      <button onClick={() => handleDelete(task.id)} className="text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
