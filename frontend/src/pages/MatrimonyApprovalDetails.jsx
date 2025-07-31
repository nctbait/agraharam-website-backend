// MatrimonyApprovalDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import Footer from '../components/Footer';

const MatrimonyApprovalDetails = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [familyId, setFamilyId] = useState('');
  const [search, setSearch] = useState('');
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/matrimony/${id}`).then(setProfile);
  }, [id]);

  const handleSearch = async () => {
    if (!search) return;
    const result = await api.get(`/api/family/user-search?query=${search}`);
    setMatches(result);
  };

  const handleApprove = async () => {
    if(!familyId){
        await api.post(`/api/matrimony/${id}/approve`, {});    
    }
    else{
        await api.post(`/api/matrimony/${id}/approve`, { familyId });
    }
    navigate('/matrimony-approval');
  };

  const handleReject = async () => {
    await api.post(`/api/admin/matrimony/${id}/reject`);
    navigate('/admin/matrimony');
  };

  if (!profile) return null;

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="max-w-4xl mx-auto p-6">
          <h2 className="text-xl font-bold mb-4">Matrimony Profile Review</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div><strong>Name:</strong> {profile.name}</div>
            <div><strong>Gender:</strong> {profile.gender}</div>
            <div><strong>Date of Birth:</strong> {profile.dob}</div>
            <div><strong>Gothram:</strong> {profile.gothram}</div>
            <div><strong>Vedam:</strong> {profile.vedam}</div>
            <div><strong>Father Name:</strong> {profile.fatherName}</div>
            <div><strong>Mother Name:</strong> {profile.motherName}</div>
            <div><strong>Mother Maiden Name:</strong> {profile.motherMaidenName}</div>
            <div><strong>Contact Email:</strong> {profile.contactEmail}</div>
            <div><strong>Contact Phone:</strong> {profile.contactPhone}</div>
            <div><strong>Education:</strong> {profile.education}</div>
            <div><strong>Occupation:</strong> {profile.occupation}</div>
            <div><strong>About:</strong> {profile.about}</div>
          </div>

          {profile.profilePictureUrl && (
            <div className="mb-6">
              <img src={profile.profilePictureUrl} alt="Profile" className="h-40 rounded border" />
            </div>
          )}

          <div className="mb-6">
            <label className="block font-semibold mb-1">Search Primary Member to Link (optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="form-input border px-3 py-2"
              />
              <button onClick={handleSearch} className="bg-gray-300 px-4 py-2 rounded">Search</button>
            </div>

            {matches.length > 0 && (
              <div className="mt-2">
                <label className="block mb-1">Select Family</label>
                <select
                  className="form-select border px-3 py-2"
                  value={familyId}
                  onChange={e => setFamilyId(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {matches.map(user => (
                    <option key={user.id} value={user.familyId}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded">
              Approve
            </button>
            <button onClick={handleReject} className="bg-red-600 text-white px-4 py-2 rounded">
              Reject
            </button>
            <button onClick={() => navigate('/matrimony-approval')} className="bg-gray-300 px-4 py-2 rounded">
              Back
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default MatrimonyApprovalDetails;
