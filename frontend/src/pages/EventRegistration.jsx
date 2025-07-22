import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import api from '../api/authAxios';

const mockEvent = {
  id: 1,
  title: 'Tech Talk: Future of AI',
  baseFee: 25,
  isFree: false
};

const mockUser = {
  membershipType: 'Annual Member', // can be 'Annual Member', 'Lifetime Member', 'Non-member'
  family: [
    { id: 1, name: 'Rama S.' },
    { id: 2, name: 'Sita R.' }
  ]
};

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedFamily, setSelectedFamily] = useState([]);
  const [guests, setGuests] = useState([{ name: '', age: '' }]);

  const handleFamilyToggle = (fid) => {
    setSelectedFamily((prev) =>
      prev.includes(fid) ? prev.filter((id) => id !== fid) : [...prev, fid]
    );
  };

  const handleGuestChange = (index, field, value) => {
    const updated = [...guests];
    updated[index][field] = value;
    setGuests(updated);
  };

  const addGuest = () => setGuests([...guests, { name: '', age: '' }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registered for event', id, { selectedFamily, guests });
    navigate('/user-events');
  };

  const calculateFee = () => {
    if (mockEvent.isFree) return 0;
    const perPersonFee =
      mockUser.membershipType === 'Lifetime Member' ? 0 : mockEvent.baseFee;
    return (selectedFamily.length + guests.length) * perPersonFee;
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} showDashboardLink={true} />
        <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl my-6">
          <h2 className="text-2xl font-bold mb-4">Register for {mockEvent.title}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Select Family Members Attending:</label>
              {mockUser.family.map((member) => (
                <label key={member.id} className="block">
                  <input
                    type="checkbox"
                    checked={selectedFamily.includes(member.id)}
                    onChange={() => handleFamilyToggle(member.id)}
                    className="mr-2"
                  />
                  {member.name}
                </label>
              ))}
            </div>

            <div>
              <label className="block font-semibold mb-2">Add Guest(s):</label>
              {guests.map((guest, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Guest Name"
                    value={guest.name}
                    onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                    className="form-input flex-1 h-10 px-3 rounded-lg border border-gray-300"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={guest.age}
                    onChange={(e) => handleGuestChange(index, 'age', e.target.value)}
                    className="form-input w-24 h-10 px-3 rounded-lg border border-gray-300"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addGuest}
                className="mt-2 px-4 py-1 rounded bg-blue-50 text-blue-700 text-sm font-medium"
              >
                + Add Another Guest
              </button>

            </div>

            <div>
              <p className="text-sm text-gray-700">
                Membership Type: <strong>{mockUser.membershipType}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Total Fee: <strong>${calculateFee()}</strong>
              </p>
              <input
              type="test"
              name="zellCOnfNum"
              placeholder="Zelle Confirmation# "
              className="form-input flex-1 h-10 px-3 rounded-lg border border-gray-300"
              required
            />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold">
                Submit Registration
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}
