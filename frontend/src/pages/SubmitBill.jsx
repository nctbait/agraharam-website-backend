import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const familyMembers = ['Sita Ram', 'Rama S.', 'Sita R.'];
const eventOptions = ['Ugadi Celebrations', 'Summer Picnic', 'Annual Meeting'];

export default function SubmitBill() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    member: '',
    amount: '',
    description: '',
    event: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Bill submitted:', formData);
    navigate('/user-payments');
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} showDashboardLink={true} />
        <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl my-6">
          <h2 className="text-2xl font-bold mb-4">Submit New Bill</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <select
              name="member"
              value={formData.member}
              onChange={handleChange}
              required
              className="form-select h-12 rounded-lg border border-gray-300 px-4"
            >
              <option value="" disabled>Select Family Member</option>
              {familyMembers.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Bill Amount"
              className="form-input h-12 rounded-lg border border-gray-300 px-4"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description of the expense"
              rows={4}
              className="form-textarea rounded-lg border border-gray-300 px-4 py-2"
              required
            />

            <select
              name="event"
              value={formData.event}
              onChange={handleChange}
              className="form-select h-12 rounded-lg border border-gray-300 px-4"
            >
              <option value="">Select Associated Event (optional)</option>
              {eventOptions.map((ev, idx) => (
                <option key={idx} value={ev}>{ev}</option>
              ))}
            </select>

            <div className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-300 px-4 py-10 my-6 rounded-xl">
            <p className="text-lg font-bold">Upload Related Documents</p>
            <p className="text-sm text-gray-500 text-center">Click to upload or drag and drop</p>
            <button type="button" className="rounded-xl h-10 px-4 bg-gray-100 text-black text-sm font-bold">Upload</button>
          </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold"
              >
                Submit Bill
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}
