import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const family = [
  { id: 1, name: 'Rama S.', age: 12, relation: 'Son', school: 'Green Hope Elementary' },
  { id: 2, name: 'Sita R.', age: 9, relation: 'Daughter', school: 'Green Hope Elementary' },
];

export default function UserFamily() {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/user-family/edit/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} showDashboardLink={true} />
        <main className="flex-1 max-w-4xl mx-auto bg-white shadow p-6 rounded-xl my-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Family</h2>
            <button
              onClick={() => navigate('/user-family/edit/new')}
              className="h-10 px-4 rounded-lg bg-green-600 text-white text-sm font-semibold"
            >
              + Add Family Member
            </button>
          </div>
          <div className="space-y-4">
            {family.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center bg-gray-50 border rounded-lg p-4"
              >
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">
                    Age: {member.age} · Relation: {member.relation} · School: {member.school}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(member.id)}
                  className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
