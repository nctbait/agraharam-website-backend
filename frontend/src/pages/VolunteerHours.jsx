// VolunteerHours.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import api from '../api/authAxios';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const VolunteerHours = () => {
  const [hoursData, setHoursData] = useState([]);
  const [yearlySummary, setYearlySummary] = useState([]);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [summaryRes, yearlyRes] = await Promise.all([
        api.get('/api/volunteer-hours/family-summary'),
        api.get('/api/volunteer-hours/family-yearly-summary')
      ]);
      setHoursData(summaryRes || []);
      setYearlySummary(yearlyRes || []);
    };
    fetchAll();
  }, []);


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
            {sidebarOpen ? (
              <ArrowLeftIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
          <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-xl font-bold mb-6">Volunteer Hours Summary</h1>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Relationship</th>
                  <th className="border px-4 py-2 text-left">Approved Hours</th>
                  <th className="border px-4 py-2 text-left">Pending Hours</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hoursData.map(member => (
                  <tr key={member.memberId + '-' + member.relationship}>
                    <td className="border px-4 py-2">{member.name}</td>
                    <td className="border px-4 py-2">{member.relationship}</td>
                    <td className="border px-4 py-2">{member.approvedHours}</td>
                    <td className="border px-4 py-2">{member.pendingHours}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => navigate(`/add-volunteer-hours/${member.memberId}?relationship=${member.relationship}`)}
                        className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
                      >
                        Add Hours
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-lg font-semibold mt-10 mb-4">Year-wise Approved Hours</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Relationship</th>
                  <th className="border px-4 py-2 text-left">Year</th>
                  <th className="border px-4 py-2 text-left">Approved Hours</th>
                </tr>
              </thead>
              <tbody>
                {yearlySummary.map(row => (
                  <tr key={`${row.memberId}-${row.relationship}-${row.year}`}>
                    <td className="border px-4 py-2">{row.name}</td>
                    <td className="border px-4 py-2">{row.relationship}</td>
                    <td className="border px-4 py-2">{row.year}</td>
                    <td className="border px-4 py-2">{row.approvedHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VolunteerHours;
