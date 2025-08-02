// UserSummaryCard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/authAxios';

const UserSummaryCard = () => {
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [userRes, membershipRes] = await Promise.all([
        api.get('/api/family/primary'),
        api.get('/api/memberships/current')
      ]);
      setUser(userRes);
      setMembership(membershipRes);
    };
    fetchData();
  }, []);

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <h2 className="text-lg font-bold mb-4">Welcome, {user.firstName} {user.lastName}</h2>
      <div className="text-sm text-gray-700 space-y-1">
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Phone:</strong> {user.phoneNumber}</div>
        {membership && (
          <div>
            <strong>Membership:</strong> {membership.membershipName} 
            {membership.startDate && (
              <span> (from {membership.startDate}{membership.endDate ? ` to ${membership.endDate}` : ''})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSummaryCard;
