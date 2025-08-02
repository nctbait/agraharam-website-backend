// UpcomingEvents.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/authAxios';

const UpcomingEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [my, available] = await Promise.all([
        api.get('/api/event-registrations/my'),
        api.get('/api/event-registrations/available')
      ]);
      setMyEvents(my);
      setAvailableEvents(available);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>

      <div className="mb-6">
        <h3 className="text-md font-bold mb-2">My Event Registrations</h3>
        {myEvents.length === 0 ? (
          <p className="text-sm text-gray-500">You have no upcoming registrations.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {myEvents.map((e) => (
              <div key={e.registrationId} className="border rounded p-4 shadow-sm">
                <h4 className="font-semibold text-blue-700">{e.eventName}</h4>
                <p className="text-sm text-gray-600">Date: {e.date}</p>
                <p className="text-xs text-gray-500 mt-1">Status: {e.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-md font-bold mb-2">Available Events</h3>
        {availableEvents.length === 0 ? (
          <p className="text-sm text-gray-500">No new events available for registration.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {availableEvents.map((e) => (
              <div key={e.id} className="border rounded p-4 shadow-sm">
                <h4 className="font-semibold text-green-700">{e.title}</h4>
                <p className="text-sm text-gray-600">Date: {e.date}</p>
                <p className="text-sm text-gray-600">Venue: {e.venue}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
