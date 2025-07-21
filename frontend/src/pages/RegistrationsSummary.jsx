import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';


export default function RegistrationSummary() {
    const navigate = useNavigate();

  const [summary, setSummary] = useState({
    total: 1250,
    monthly: 320,
    averagePerEvent: 45,
  });

  const [eventStats, setEventStats] = useState([]);

  useEffect(() => {
    // Replace with API calls
    const mockEventStats = [
      { id: 1, name: 'Community Picnic', date: '2024-07-15', total: 150, available: 50, status: 'Open' },
      { id: 2, name: 'Tech Talk: AI in Business', date: '2024-07-20', total: 200, available: 0, status: 'Closed' },
      { id: 3, name: 'Summer Book Club Meeting', date: '2024-07-25', total: 80, available: 20, status: 'Open' },
      { id: 4, name: 'Charity Run', date: '2024-08-05', total: 300, available: 100, status: 'Open' },
      { id: 5, name: 'Photography Workshop', date: '2024-08-10', total: 120, available: 30, status: 'Open' },
    ];
    setEventStats(mockEventStats);
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <h1 className="text-2xl font-bold mb-4">Event Registration Summary</h1>

          {/* Summary cards */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
            <SummaryCard label="Total Registrations" value={summary.total} />
            <SummaryCard label="Registrations This Month" value={summary.monthly} />
            <SummaryCard label="Average Registrations Per Event" value={summary.averagePerEvent} />
          </div>

          {/* Event table */}
          <h2 className="text-xl font-semibold mb-3">Registrations by Event</h2>
          <div className="overflow-x-auto border border-[#dde0e3] rounded-xl bg-white mb-6">
            <table className="min-w-[600px] w-full text-sm">
              <thead>
                <tr className="bg-[#f9fafb]">
                  <th className="px-4 py-3 text-left">Event Name</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Available</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {eventStats.map(event => (
                  <tr
                  key={event.id}
                  className="border-t border-[#dde0e3] cursor-pointer hover:bg-[#f9fafb] transition"
                  onClick={() => navigate(`/event-registrations/${event.id}`)}
                >                
                    <td className="px-4 py-2">{event.name}</td>
                    <td className="px-4 py-2 text-[#6a7581]">{event.date}</td>
                    <td className="px-4 py-2 text-[#6a7581]">{event.total}</td>
                    <td className="px-4 py-2 text-[#6a7581]">{event.available}</td>
                    <td className="px-4 py-2">
                      <span className="rounded-full px-3 py-1 bg-[#f1f2f4] text-[#121416]">{event.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Placeholder for future chart */}
          <h2 className="text-xl font-semibold mb-3">Registrations Over Time</h2>
          <div className="rounded-xl border border-[#dde0e3] p-6 text-[#6a7581] text-sm mb-6">
            <p className="text-base font-medium mb-2">Monthly Registrations</p>
            <p className="text-3xl font-bold text-[#121416]">+15%</p>
            <p className="mt-1">Last 12 months</p>
            <div className="h-40 bg-[#f1f2f4] rounded-lg mt-4 flex items-center justify-center text-sm italic">
              Chart placeholder
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex justify-end gap-3">
            <button className="rounded-full h-10 px-6 bg-[#f1f2f4] text-[#121416] text-sm font-bold">Export CSV</button>
            <button className="rounded-full h-10 px-6 bg-[#dce7f3] text-[#121416] text-sm font-bold">Export Excel</button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="flex-1 min-w-[180px] rounded-xl border border-[#dde0e3] p-6">
      <p className="text-[#121416] text-base font-medium">{label}</p>
      <p className="text-[#121416] text-2xl font-bold">{value}</p>
    </div>
  );
}
