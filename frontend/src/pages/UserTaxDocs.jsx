import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../api/authAxios';

export default function UserTaxDocs() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [taxData, setTaxData] = useState([]);
  const [downloadingYear, setDownloadingYear] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/user/tax-summary')
      .then(setTaxData)
      .catch(() => setTaxData([]));
  }, []);

  const downloadPdf = async (year) => {
    setError('');
    setDownloadingYear(year);
    try {
      const res = await api.instance.get(`/api/user/tax-summary/${year}/pdf`, {
        responseType: 'blob',
        headers: { Accept: 'application/pdf' }
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NCTBA_Tax_Receipt_${year}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError('Failed to download the PDF. Please try again.');
    } finally {
      setDownloadingYear(null);
    }
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

          <main className="flex-1 max-w-4xl mx-auto bg-white shadow p-6 rounded-xl my-6">
            <h2 className="text-2xl font-bold mb-6">Tax Documents</h2>

            {error && <div className="mb-4 text-red-600">{error}</div>}

            <div className="space-y-4">
              {taxData.map((entry) => (
                <div key={entry.year} className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Tax Year {entry.year}</h3>
                      <p className="text-sm text-gray-600">
                        Donations: ${entry.donations?.toFixed?.(2) ?? entry.donations} · Membership: ${entry.membership?.toFixed?.(2) ?? entry.membership}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadPdf(entry.year)}
                      className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
                      disabled={downloadingYear === entry.year}
                    >
                      {downloadingYear === entry.year ? 'Preparing…' : 'Download PDF'}
                    </button>
                  </div>
                </div>
              ))}

              {taxData.length === 0 && (
                <div className="text-gray-600">No tax records found.</div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
