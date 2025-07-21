import React from 'react';

const matches = [
  {
    id: 1,
    name: 'Lakshmi V.',
    age: 27,
    profession: 'Software Engineer',
    location: 'Charlotte, NC',
    image: 'https://via.placeholder.com/300x160',
  },
  {
    id: 2,
    name: 'Krishna M.',
    age: 30,
    profession: 'Data Analyst',
    location: 'Raleigh, NC',
    image: 'https://via.placeholder.com/300x160',
  },
];

export default function MatrimonyMatches() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Matrimony Matches</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {matches.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >
            <img
              src={profile.image}
              alt={profile.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <p className="text-sm text-gray-600">{profile.age} yrs · {profile.profession}</p>
              <p className="text-sm text-gray-600">{profile.location}</p>
              <button className="mt-3 w-full h-10 rounded-lg bg-blue-100 text-blue-700 font-semibold text-sm">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
