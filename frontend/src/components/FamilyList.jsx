import React from 'react';
import { useNavigate } from 'react-router-dom';

const family = [
  { id: 1, name: 'Rama S.', age: 12, interests: 'Carnatic music, Math' },
  { id: 2, name: 'Sita R.', age: 9, interests: 'Dance, Reading' },
];

export default function FamilyList() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Family</h2>
      <button
              onClick={() => navigate('/user-family/edit/new')}
              className="h-10 px-4 rounded-lg bg-green-600 text-white text-sm font-semibold"
            >
              + Add Family Member
            </button>
      <div className="space-y-4">
        {family.map((member) => (
          <div
            key={member.id}
            className="flex justify-between items-center bg-white rounded-xl shadow p-4"
          >
            <div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600">Age: {member.age}</p>
              <p className="text-sm text-gray-600">Interests: {member.interests}</p>
            </div>
            <button
              onClick={() => navigate(`/user-family/edit/${member.id}`)}
              className="h-10 px-4 rounded-lg bg-blue-100 text-blue-700 font-semibold text-sm"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
