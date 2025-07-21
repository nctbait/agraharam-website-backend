import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const familyMembers = [
  { id: 1, name: 'Sita Ram', approved: 12, pending: 2, total: 14 },
  { id: 2, name: 'Rama S.', approved: 5, pending: 1, total: 6 },
  { id: 3, name: 'Sita R.', approved: 3, pending: 0, total: 3 },
];

export default function VolunteerHours() {
  const navigate = useNavigate();

  const handleAddHours = (memberId) => {
    navigate(`/volunteer-hours/add/${memberId}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex">
      <Sidebar isOpen={true} showDashboardLink={true} />
        <main className="flex-1 max-w-4xl mx-auto bg-white shadow p-6 rounded-xl my-6">
        <h2 className="text-2xl font-bold mb-6">Volunteer Hours Summary</h2>
        <div className="space-y-4">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 border rounded-lg p-4"
            >
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">Approved: {member.approved} hrs</p>
                <p className="text-sm text-gray-600">Pending: {member.pending} hrs</p>
                <p className="text-sm text-gray-600">Total: {member.total} hrs</p>
              </div>
              <button
                onClick={() => handleAddHours(member.id)}
                className="mt-3 sm:mt-0 h-10 px-4 rounded-lg bg-blue-600 text-white font-semibold text-sm"
              >
                Add Hours
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
