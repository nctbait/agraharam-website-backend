import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const familyLookup = {
  1: 'Sita Ram',
  2: 'Rama S.',
  3: 'Sita R.',
};

export default function AddVolunteerHours() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const memberName = familyLookup[memberId] || 'Unknown Member';

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    hours: '',
    event: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitted for member ${memberId}:`, formData);
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} />
        <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl my-6">
          <h2 className="text-2xl font-bold mb-4">Add Volunteer Hours for {memberName}</h2>
          <div className="flex justify-between mb-4">
            <button
              onClick={() => navigate('/volunteer-hours')}
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Volunteer Summary
            </button>
          </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              aria-label="Date of Service"
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
              required
            />
            <span className="text-sm text-gray-500">Date of Service</span>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              aria-label="Start Time of Service"
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
              required
            />
            <span className="text-sm text-gray-500">Start Time of Service</span>
            <input
              type="number"
              name="hours"
              placeholder="Hours of Service"
              value={formData.hours}
              onChange={handleChange}
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
              required
            />
            <input
              type="text"
              name="event"
              placeholder="Linked Event (optional)"
              value={formData.event}
              onChange={handleChange}
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
            />
            <textarea
              name="description"
              placeholder="Description of the service"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="form-textarea rounded-lg border border-gray-300 px-4 py-2"
              required
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}
