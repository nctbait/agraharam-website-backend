import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const mockFamily = {
  1: { name: 'Rama S.', age: 12, relation: 'Son', school: 'Green Hope Elementary' },
  2: { name: 'Sita R.', age: 9, relation: 'Daughter', school: 'Green Hope Elementary' },
};

export default function EditFamilyMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const member = isNew ? {} : mockFamily[id];

  const [formData, setFormData] = useState({
    ...member,
    skills: member?.skills || '',
    preferences: member?.preferences || ''
  });

  useEffect(() => {
    if (!isNew && !member) navigate('/user-family');
  }, [member, navigate, isNew]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${isNew ? 'Created new member' : 'Updated member ' + id}:`, formData);
    navigate('/user-family');
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} showDashboardLink={true} />
        <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl my-6">
          <h2 className="text-2xl font-bold mb-4\">{isNew ? 'Add Family Member' : 'Edit Family Member'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
              required
            />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
              required
            />
            <input
              type="text"
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              placeholder="Relation (e.g., Son, Daughter)"
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
              required
            />
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="School"
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
            />
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills (e.g., Singing, Programming)"
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
            />
            <input
              type="text"
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              placeholder="Volunteer Preferences (e.g., Event Planning, Tech Help)"
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
            />

            <div className="flex justify-between\">
              <button
                type="button"
                onClick={() => navigate('/user-family')}
                className="h-10 px-4 rounded-lg bg-gray-200 text-gray-800 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}
