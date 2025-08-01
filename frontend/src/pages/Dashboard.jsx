import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import UserSummaryCard from '../components/UserSummaryCard';
import AnalyticsPanel from '../components/AnalyticsPanel';
import UpcomingEvents from '../components/UpcomingEvents';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content */}
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
          <UserSummaryCard />
          <AnalyticsPanel />
          <UpcomingEvents />
        </div>
      </div>
      <Footer />
    </>
  );
}
