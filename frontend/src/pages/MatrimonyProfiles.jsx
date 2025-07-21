import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';


const profiles = [
  {
    id: 1,
    name: 'Priya Sharma',
    age: 28,
    occupation: 'Software Engineer',
    education: 'Masters in Computer Science',
    image: '...',
    status: 'approved'
  }
];


export default function MatrimonyProfiles() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();


  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} showDashboardLink={true} />
        <main className="flex-1 px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold">Matrimony Profiles</h1>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="form-input px-4 h-10 rounded-xl border border-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            <select className="form-select h-10 rounded-lg border border-gray-300 px-3">
              <option>All Gothrams</option>
              <option>Vasishta</option>
              <option>Kashyapa</option>
            </select>
            <select className="form-select h-10 rounded-lg border border-gray-300 px-3">
              <option>All Vedas</option>
              <option>Rig Veda</option>
              <option>Yajur Veda</option>
              <option>Sama Veda</option>
            </select>
            <select className="form-select h-10 rounded-lg border border-gray-300 px-3">
              <option>All Locations</option>
              <option>North Carolina</option>
              <option>Texas</option>
              <option>California</option>
            </select>
            <select className="form-select h-10 rounded-lg border border-gray-300 px-3">
              <option>All Education Levels</option>
              <option>Bachelors</option>
              <option>Masters</option>
              <option>PhD</option>
            </select>
            <select className="form-select h-10 rounded-lg border border-gray-300 px-3">
              <option>All Genders</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select className="form-select h-10 rounded-lg border border-gray-300 px-3">
              <option>All Age Groups</option>
              <option>18–25</option>
              <option>26–30</option>
              <option>31–35</option>
              <option>36+</option>
            </select>
          </div>

          <div className="grid gap-4">
            {profiles.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(profile => (
              <div key={profile.id} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow">
                <div className="flex-[2_2_0px]">
                  <p className="text-lg font-bold">{profile.name}, {profile.age}</p>
                  <p className="text-sm text-gray-600">{profile.occupation}, {profile.education}</p>
                  <button
  onClick={() => navigate(`/matrimony-profile/${profile.id}`)}
  className="mt-2 h-8 px-4 rounded-xl bg-gray-100 text-sm font-medium"
>
  View Profile
</button>

                </div>
                <div className="w-full md:w-48 aspect-video bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url(${profile.image})` }}
                ></div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
