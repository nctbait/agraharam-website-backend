import React from 'react';

const events = [
  {
    id: 1,
    title: 'Ugadi Celebrations',
    date: 'April 5, 2025',
    location: 'Cary Hindu Temple',
    isRegistered: false,
  },
  {
    id: 2,
    title: 'Summer Picnic',
    date: 'June 22, 2025',
    location: 'Lake Crabtree Park',
    isRegistered: true,
  },
];

export default function UpcomingEvents() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.date} · {event.location}</p>
              <button
                className={`mt-3 w-full h-10 rounded-lg font-semibold text-sm ${
                  event.isRegistered
                    ? 'bg-yellow-100 text-yellow-800 cursor-pointer'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {event.isRegistered ? 'Edit Registration' : 'Register Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
