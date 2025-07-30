import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../api/authAxios';

export default function UserPayments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const userId = JSON.parse(atob(localStorage.getItem("jwtToken").split('.')[1])).userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentData, billData] = await Promise.all([
          api.get(`/api/user/payments?userId=${userId}`),
          api.get(`/api/user/bills?userId=${userId}`)
        ]);
        setPayments(paymentData);
        setBills(billData);
      } catch (err) {
        console.error('Failed to load payments or bills', err);
      }
    };
    fetchData();
  }, [userId]);

  const filterItems = (items) => {
    return items.filter(item =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

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
            {sidebarOpen ? <ArrowLeftIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Payments</h1>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <h2 className="text-xl font-semibold mb-2">Past Payments</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full min-w-[600px] bg-white rounded-xl border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filterItems(payments).map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-600">{item.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">${item.amount}</td>
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
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filterItems(bills).map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-600">{item.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">${item.amount}</td>
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
