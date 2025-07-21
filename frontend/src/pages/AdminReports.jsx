import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminReports() {
  const reports = {
    financial: [
      {
        title: 'Transaction Summary Report',
        description: 'Summary of all financial transactions within a specified period.',
        onClick: () => alert('Transaction Summary Report coming soon!')
      },
      {
        title: 'Event Financial Report',
        description: 'Detailed breakdown of income and expenses for a specific event.',
        onClick: () => alert('Event Financial Report coming soon!')
      }
    ],
    membership: [
      {
        title: 'Active Member List',
        description: 'List of all active members with their contact information.',
        onClick: () => alert('Active Member List coming soon!')
      },
      {
        title: 'New Member Report',
        description: 'Report on new members who joined within a specified period.',
        onClick: () => alert('New Member Report coming soon!')
      }
    ],
    task: [
      {
        title: 'Task Completion Report',
        description: 'Report on tasks assigned to members, including status and completion dates.',
        onClick: () => alert('Task Completion Report coming soon!')
      },
      {
        title: 'Task Summary Report',
        description: 'Summary of all tasks, categorized by status (e.g., pending, completed).',
        onClick: () => alert('Task Summary Report coming soon!')
      }
    ]
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <h1 className="text-2xl font-bold mb-6">Reports</h1>

          <ReportSection title="Financial Reports" reports={reports.financial} />
          <ReportSection title="Membership Reports" reports={reports.membership} />
          <ReportSection title="Task Reports" reports={reports.task} />
        </main>
      </div>
      <Footer />
    </>
  );
}

function ReportSection({ title, reports }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex flex-col gap-4">
        {reports.map((r, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl shadow-sm border border-[#dde0e3] px-4 py-3"
          >
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-base font-medium text-[#121416]">{r.title}</p>
              <p className="text-sm text-[#6a7581]">{r.description}</p>
            </div>
            <button
              onClick={r.onClick}
              className="mt-3 sm:mt-0 rounded-full h-8 px-4 bg-[#f1f2f4] text-sm font-medium text-[#121416]"
            >
              Generate
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
