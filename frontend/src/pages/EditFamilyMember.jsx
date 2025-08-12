import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import api from '../api/authAxios';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditFamilyMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    relation: '',
    school: '',
    skills: '',
    preferences: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log("isNew:"+isNew +", id:"+id);
    if (!isNew) {
      api.get(`/api/family/${id}`)
        .then(data => setFormData(data))
        .catch(() => navigate('/user-family'));
    }
  }, [id, isNew, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isNew ? '/api/family/add' : `/api/family/update/${id}`;
    console.log("isNew:"+isNew +", url:"+ url); 
    try {
      isNew
        ? await api.post(url, formData)
        : await api.put(url, formData);
  
      navigate('/user-family');
    } catch (err) {
      console.error('Failed to save family member:', err);
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
        <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl my-6">
          <h2 className="text-2xl font-bold mb-4">
            {isNew ? 'Add Family Member' : 'Edit Family Member'}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="form-input h-12 rounded-lg border px-4" />
            <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" required className="form-input h-12 rounded-lg border px-4" />
            <select name="relation" value={formData.relation} onChange={handleChange} required className="form-input h-12 rounded-lg border px-4">
              <option value="">Select Relation</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Other">Other</option>
            </select>
            <input name="school" value={formData.school} onChange={handleChange} placeholder="School" className="form-input h-12 rounded-lg border px-4" />
            <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills (e.g. Drawing)" className="form-input h-12 rounded-lg border px-4" />
            <input name="preferences" value={formData.preferences} onChange={handleChange} placeholder="Volunteer Preferences" className="form-input h-12 rounded-lg border px-4" />
            
            <div className="flex justify-between">
              <button type="button" onClick={() => navigate('/user-family')} className="h-10 px-4 bg-gray-200 text-sm rounded-lg">Cancel</button>
              <button type="submit" className="h-10 px-6 bg-blue-600 text-white text-sm font-bold rounded-lg">
                Save
              </button>
            </div>
          </form>
        </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
