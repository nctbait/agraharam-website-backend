import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../api/authAxios';

export default function UserTaxDocs() {
  const [taxData, setTaxData] = useState([]);

  useEffect(() => {
    api.get('/api/user/tax-summary').then(setTaxData);
  }, []);

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
          <main className="flex-1 max-w-4xl mx-auto bg-white shadow p-6 rounded-xl my-6">
            <h2 className="text-2xl font-bold mb-6">Tax Documents</h2>
            <div className="space-y-4">
              {taxData.map((entry) => (
                <div key={entry.id} className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Tax Year {entry.year}</h3>
                      <p className="text-sm text-gray-600">
                        Donations: ${entry.donations} · Membership: ${entry.membership}
                      </p>
                    </div>
                    <a
                      href={entry.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
