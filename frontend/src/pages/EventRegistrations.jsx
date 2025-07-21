import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function EventRegistrations() {
  const { eventId } = useParams();

  // TODO: Replace with fetch for actual event & registrant data
  const eventName = 'Tech Talk: AI in Business';
  const registrants = [
    { id: 1, name: 'Sita Rao', email: 'sita@example.com', type: 'Family', guests: 3 },
    { id: 2, name: 'Arjun Patel', email: 'arjun@example.com', type: 'Regular', guests: 1 },
    { id: 3, name: 'Priya Shah', email: 'priya@example.com', type: 'Non-member', guests: 0 },
  ];

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <h1 className="text-2xl font-bold mb-4">Registrants for: {eventName}</h1>
          <div className="overflow-x-auto border border-[#dde0e3] rounded-xl bg-white">
            <table className="min-w-[600px] w-full text-sm">
              <thead>
                <tr className="bg-[#f9fafb]">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Membership</th>
                  <th className="px-4 py-3 text-left">Guests</th>
                </tr>
              </thead>
              <tbody>
                {registrants.map((r) => (
                  <tr key={r.id} className="border-t border-[#dde0e3]">
                    <td className="px-4 py-2">{r.name}</td>
                    <td className="px-4 py-2 text-[#6a7581]">{r.email}</td>
                    <td className="px-4 py-2">{r.type}</td>
                    <td className="px-4 py-2 text-center">{r.guests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
