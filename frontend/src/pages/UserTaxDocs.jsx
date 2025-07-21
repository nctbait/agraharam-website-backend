import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const taxData = [
  {
    id: 1,
    year: 2024,
    donations: 200,
    eventFees: 100,
    membership: 50,
    file: '/docs/receipt-2024.pdf',
  },
  {
    id: 2,
    year: 2023,
    donations: 150,
    eventFees: 75,
    membership: 50,
    file: '/docs/receipt-2023.pdf',
  },
];

export default function UserTaxDocs() {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} showDashboardLink={true} />
        <main className="flex-1 max-w-4xl mx-auto bg-white shadow p-6 rounded-xl my-6">
          <h2 className="text-2xl font-bold mb-6">Tax Documents</h2>
          <div className="space-y-4">
            {taxData.map((entry) => (
              <div key={entry.id} className="bg-gray-50 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Tax Year {entry.year}</h3>
                    <p className="text-sm text-gray-600">
                      Donations: ${entry.donations} · Event Fees: ${entry.eventFees} · Membership: ${entry.membership}
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
      <Footer />
    </>
  );
}
