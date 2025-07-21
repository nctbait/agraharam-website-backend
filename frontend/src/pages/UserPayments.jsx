import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const payments = [
  { date: '2024-07-20', amount: '$50.00', description: 'Annual Membership', status: 'Completed' },
  { date: '2024-06-15', amount: '$25.00', description: 'Community Picnic', status: 'Completed' },
  { date: '2024-05-01', amount: '$100.00', description: 'Matrimony Service Fee', status: 'Completed' },
  { date: '2024-04-10', amount: '$50.00', description: 'Annual Membership', status: 'Completed' },
  { date: '2024-03-05', amount: '$20.00', description: 'Community Workshop', status: 'Completed' },
];

const bills = [
  { date: '2024-07-10', amount: '$75.00', description: 'Event Supplies', status: 'Approved' },
  { date: '2024-06-20', amount: '$30.00', description: 'Workshop Materials', status: 'Pending Approval' },
  { date: '2024-05-15', amount: '$120.00', description: 'Community Picnic Expenses', status: 'Rejected' },
];

export default function UserPayments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Payments</h1>
          </div>

          <h2 className="text-xl font-semibold mb-2">Past Payments</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full min-w-[600px] bg-white rounded-xl border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Event/Membership</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-600">{item.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{item.amount}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{item.description}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className="rounded-full px-4 py-1 bg-gray-100 text-sm font-medium text-gray-800 inline-block">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mb-2">Bill Submissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] bg-white rounded-xl border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-600">{item.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{item.amount}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{item.description}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className="rounded-full px-4 py-1 bg-gray-100 text-sm font-medium text-gray-800 inline-block">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
