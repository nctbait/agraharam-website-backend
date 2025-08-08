import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function ManageSubtasks() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);

  const load = async () => {
    const t = await api.get(`/api/tasks/task/${taskId}`);     // TaskDTO
    const s = await api.get(`/api/subtasks/task/${taskId}`); // List<SubtaskDTO>
    setTask(t);
    setSubtasks(s || []);
  };

  useEffect(() => { load(); }, [taskId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subtask?')) return;
    await api.delete(`/api/subtasks/${id}`);
    load();
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Subtasks for: {task?.name || ''}</h1>
            <button
              onClick={() => navigate(`/admin/tasks`)}
              className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
            >
              Manage Tasks
            </button>
            
            <button
              onClick={() => navigate(`/create-subtask/${taskId}`)}
              className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
            >
              + New Subtask
            </button>
          </div>

          {subtasks.length === 0 ? (
            <p className="text-[#6a7581]">No subtasks yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#dde0e3] bg-white">
              <table className="min-w-[700px] w-full">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-3 text-left text-sm font-medium">Subtask</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Assigned To</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Deadline</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subtasks.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="px-4 py-2 text-sm">{s.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{s.assignedToName || '—'}</td>
                      <td className="px-4 py-2 text-sm">{s.status}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{s.deadline || '—'}</td>
                      <td className="px-4 py-2 text-sm space-x-3">
                        <button
                          onClick={() => navigate(`/task/${s.parentTaskId}/edit-subtask/${s.id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
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
