import React from 'react';

export default function AnalyticsPanel() {
  const stats = [
    { label: 'Events Attended', value: 8 },
    { label: 'Family Volunteer Hours', value: 24 },
    { label: 'Total Donations ($)', value: 320 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl shadow p-6 text-center"
        >
          <div className="text-3xl font-bold text-blue-700 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
