import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function ManageSubtasks() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);

  useEffect(() => {
    // Simulate fetching parent task and subtasks
    const mockTask = {
      id: taskId,
      name: 'Plan Tech Conference'
    };
    const mockSubtasks = [
      {
        id: 'sub1',
        name: 'Contact speakers',
        assignedTo: 'Olivia',
        status: 'In Progress',
        deadline: '2025-01-10'
      },
      {
        id: 'sub2',
        name: 'Book venue',
        assignedTo: 'Ethan',
        status: 'Done',
        deadline: '2025-01-01'
      }
    ];

    setTask(mockTask);
    setSubtasks(mockSubtasks);
  }, [taskId]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this subtask?')) {
      setSubtasks((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Subtasks for: {task?.name}</h1>
            <button
  onClick={() => navigate(`/create-subtask?parent=${taskId}`)}
  className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
>
  + New Subtask
</button>

          </div>
          {subtasks.length === 0 ? (
            <p className="text-[#6a7581]">No subtasks yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#dde0e3] bg-white">
              <table className="min-w-[600px] w-full">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Subtask</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Assigned To</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Deadline</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#121416]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subtasks.map((subtask) => (
                    <tr key={subtask.id} className="border-t border-[#dde0e3]">
                      <td className="px-4 py-2 text-sm text-[#121416]">{subtask.name}</td>
                      <td className="px-4 py-2 text-sm text-[#6a7581]">{subtask.assignedTo}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className="rounded-full px-3 py-1 bg-[#f1f2f4] text-sm font-medium">{subtask.status}</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-[#6a7581]">{subtask.deadline}</td>
                      <td className="px-4 py-2 text-sm font-medium text-[#0c77f2] space-x-2">
                        <button onClick={() => navigate(`/edit-subtask/${subtask.id}`)}>Edit</button>
                        <button onClick={() => handleDelete(subtask.id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
