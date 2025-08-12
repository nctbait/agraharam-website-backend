import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import api from '../api/authAxios';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditSpouse() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    api.get('/api/family/spouse')
      .then(data => setFormData(data))
      .catch(err => console.error('Failed to load spouse data:', err));
  }, []);
  

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/family/spouse', formData);
      navigate('/user-family');
    } catch (err) {
      console.error('Failed to update spouse:', err);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} showDashboardLink={true} />
        <div className="flex-1 p-6 space-y-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {sidebarOpen ? <ArrowLeftIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        <div className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl my-6">
          <h2 className="text-2xl font-bold mb-4">Edit Spouse</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="form-input h-12 rounded-lg border px-4" />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="form-input h-12 rounded-lg border px-4" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="form-input h-12 rounded-lg border px-4" />
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone" className="form-input h-12 rounded-lg border px-4" />

            <div className="flex justify-between">
              <button type="button" onClick={() => navigate('/user-family')} className="h-10 px-4 bg-gray-200 text-sm rounded-lg">Cancel</button>
              <button type="submit" className="h-10 px-6 bg-blue-600 text-white text-sm font-bold rounded-lg">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
