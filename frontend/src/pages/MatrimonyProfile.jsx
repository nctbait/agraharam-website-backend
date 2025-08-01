// MatrimonyProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const MatrimonyProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/matrimony/${id}`).then(setProfile);
  }, [id]);
  if (!profile) return null;

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} />
        <main className="max-w-4xl mx-auto p-6">
          <h2 className="text-xl font-bold mb-4">Matrimony Profile Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div><strong>Name:</strong> {profile.name}</div>
            <div><strong>Gender:</strong> {profile.gender}</div>
            <div><strong>DOB(YYYY-MM-DD):</strong> {profile.dateOfBirth}</div>
            <div><strong>Time of Birth:</strong> {profile.timeOfBirth}</div>
            <div><strong>Place of Birth:</strong> {profile.placeOfBirth}</div>
            <div><strong>Nakshatram:</strong> {profile.nakshatram} {profile.paadam} paadam</div>
            <div><strong>Gothram:</strong> {profile.gothram}</div>
            <div><strong>Sakha:</strong> {profile.sakha}</div>
            <div><strong>Vedam:</strong> {profile.vedam}</div>
            <div><strong>Current Location:</strong> {profile.currentLocation}</div>
            <div><strong>Willing to  Relocate:</strong> {profile.willingToRelocate}</div>
            <div><strong>Education:</strong> {profile.education}</div>
            <div><strong>Occupation:</strong> {profile.occupation}</div>
            <div><strong>Height:</strong> {profile.height}</div>
            <div><strong>Immigration Status:</strong> {profile.immigrationStatus}</div>
            <div><strong>Marital Status:</strong> {profile.maritalStatus}</div>
            <div><strong>About:</strong> {profile.about}</div>
            <div><strong>Requirements:</strong> {profile.requirements}</div>
            <div><strong>Father's Name:</strong> {profile.fatherName}</div>
            <div><strong>Father's Occupation:</strong> {profile.fatherOccupation}</div>
            <div><strong>Mother Name:</strong> {profile.motherName}</div>
            <div><strong>Mother Maiden Name:</strong> {profile.motherMaidenName}</div>
            <div><strong>Mother's Occupation:</strong> {profile.motherOccupation}</div>
            <div><strong>Contact Email:</strong> {profile.contactEmail}</div>
            <div><strong>Contact Phone:</strong> {profile.contactPhone}</div>
          </div>

          {profile.profilePictureUrl && (
            <div className="mb-6">
              <img src={profile.profilePictureUrl} alt="Profile" className="h-40 rounded border" />
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={() => navigate('/matrimony-profiles')} className="bg-gray-300 px-4 py-2 rounded">
              Back
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default MatrimonyProfile;

