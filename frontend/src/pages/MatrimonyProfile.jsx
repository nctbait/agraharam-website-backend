import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { AuthContext } from '../context/AuthContext';

export default function MatrimonyProfile() {
  const { id } = useParams();
  //const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  const { userRole } = useContext(AuthContext);
const isAdmin = userRole === 'admin' || userRole === 'superAdmin';


  useEffect(() => {
    // Replace with actual fetch logic
    const mockProfile = {
      id,
      name: 'Sophia Clark',
      email: 'sophia.clark@email.com',
      dob: '1990-06-12',
      status: 'pending', // or 'approved', 'rejected'
      bio: 'Software engineer who enjoys classical music and yoga.'
    };
    setProfile(mockProfile);
  }, [id]);

  const handleApprove = () => {
    if (window.confirm('Approve this profile?')) {
      setProfile(prev => ({ ...prev, status: 'approved' }));
      // TODO: update backend
    }
  };

  const handleReject = () => {
    if (window.confirm('Reject this profile?')) {
      setProfile(prev => ({ ...prev, status: 'rejected' }));
      // TODO: update backend
    }
  };

  if (!profile) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-40 py-6">
          <h1 className="text-2xl font-bold mb-4">{profile.name}</h1>

          <div className="bg-white p-6 rounded-xl border border-[#dde0e3]">
            <p className="mb-2"><strong>Email:</strong> {profile.email}</p>
            <p className="mb-2"><strong>Date of Birth:</strong> {profile.dob}</p>
            <p className="mb-2"><strong>Bio:</strong> {profile.bio}</p>
            <p className="mb-2"><strong>Status:</strong> 
              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                profile.status === 'approved' ? 'bg-green-100 text-green-800' :
                profile.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {profile.status}
              </span>
            </p>

            {/* Show Approve/Reject for admins only if status is pending */}
            {isAdmin && profile.status === 'pending' && (
              <div className="mt-4 flex gap-4">
                <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded-lg">Approve</button>
                <button onClick={handleReject} className="bg-red-600 text-white px-4 py-2 rounded-lg">Reject</button>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
