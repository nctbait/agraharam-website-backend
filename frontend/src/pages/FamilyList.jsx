import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../api/authAxios';


export default function UserFamily() {
  const [spouse, setSpouse] = useState(null);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    api.get('/api/family/spouse')
      .then(data => setSpouse(data))
      .catch(() => setSpouse(null));
  
    api.get('/api/family/current_members')
      .then(data => setChildren(data))
      .catch(() => setChildren([]));
  }, []);

  const handleSpouseEdit = () => navigate(`/family-spouse/edit`);
  const handleChildEdit = (id) =>  {
    console.log('Navigating to edit child:', id); // debug line
    navigate(`/user-family/edit/${id}`);
  }
  const handleAddChild = () => navigate(`/user-family/edit/new`);

  const handleDeleteChild = async (id) => {
    await api.delete(`/api/family/delete/${id}`);
    setChildren(prev => prev.filter(m => m.id !== id));
  };
  

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} showDashboardLink={true} />
        <main className="flex-1 max-w-4xl mx-auto bg-white shadow p-6 rounded-xl my-6 space-y-6">
          <h2 className="text-2xl font-bold">My Family</h2>

          {/* Spouse */}
          {spouse && (
            <div className="bg-gray-100 border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{spouse.firstName} {spouse.lastName}</h3>
                  <p className="text-sm text-gray-600">Email: {spouse.email}</p>
                </div>
                <button
                  onClick={handleSpouseEdit}
                  className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold"
                >
                  Edit Spouse
                </button>
              </div>
            </div>
          )}

          {/* Children */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Children</h3>
            <button onClick={handleAddChild} className="h-10 px-4 bg-green-600 text-white rounded-lg text-sm font-semibold">
              + Add Family Member
            </button>
          </div>

          <div className="space-y-4">
            {children.map((member) => (
              <div key={member.id} className="flex justify-between items-center bg-gray-50 border rounded-lg p-4">
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">
                    Age: {member.age} · Relation: {member.relation} · School: {member.school}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleChildEdit(member.id)}
                    className="h-10 px-4 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteChild(member.id)}
                    className="h-10 px-4 bg-red-600 text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
