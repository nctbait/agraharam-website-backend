import React from 'react';

export default function UserSummaryCard() {
  const user = {
    name: 'Sita Ram',
    memberId: 'NCTBA1234',
    membershipType: 'Life Member',
    email: 'sitaram@example.com',
    phone: '919-123-4567',
    avatarUrl: 'https://via.placeholder.com/80',
  };

  return (
    <div className="flex items-center gap-6 bg-white shadow rounded-xl p-6">
      <div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-sm text-gray-600">Membership: {user.membershipType}</p>
        <p className="text-sm text-gray-600">Email: {user.email}</p>
        <p className="text-sm text-gray-600">Phone: {user.phone}</p>
      </div>
    </div>
  );
}
