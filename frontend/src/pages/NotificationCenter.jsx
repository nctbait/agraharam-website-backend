import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar'; // use AdminSidebar if needed

const sampleNotifications = [
  {
    id: 1,
    type: 'task',
    date: 'today',
    title: 'Assigned Task: Event Details Update',
    body: 'Task: Update event details for the upcoming community picnic.',
    icon: 'circle'
  },
  {
    id: 2,
    type: 'subtask',
    date: 'yesterday',
    title: 'Assigned Subtask: Vendor Confirmation',
    body: 'Subtask: Confirm vendor for the community picnic.',
    icon: 'square'
  },
  {
    id: 3,
    type: 'deadline',
    date: 'yesterday',
    title: 'Upcoming Deadline: Event Budget',
    body: 'Deadline: Submit event budget by end of day.',
    icon: 'triangle'
  },
  {
    id: 4,
    type: 'general',
    date: 'general',
    title: 'General Announcement',
    body: 'Reminder: Community meeting scheduled for next week.',
    icon: 'line'
  },
  {
    id: 5,
    type: 'feedback',
    date: 'general',
    title: 'Feedback Notification',
    body: 'Feedback received on the recent community event.',
    icon: 'dot'
  }
];

export default function NotificationCenter() {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  const getIcon = (icon) => {
    switch (icon) {
      case 'circle': return <svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="currentColor" /></svg>;
      case 'square': return <svg width="24" height="24"><rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" /></svg>;
      case 'triangle': return <svg width="24" height="24"><polygon points="12,2 22,22 2,22" fill="currentColor" /></svg>;
      case 'line': return <svg width="24" height="24"><path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
      case 'dot': return <svg width="24" height="24"><circle cx="12" cy="12" r="6" fill="currentColor" /></svg>;
      default: return null;
    }
  };

  const grouped = {
    today: [],
    yesterday: [],
    general: []
  };

  sampleNotifications.forEach((n) => {
    if (filter === 'all' || n.type === filter.toLowerCase()) {
      grouped[n.date]?.push(n);
    }
  });

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={true} showDashboardLink={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <div className="mb-4 flex flex-wrap justify-between gap-3">
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mb-6">
            <select
              className="form-input rounded-xl border border-[#dde0e3] h-12 px-4"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Filter by type</option>
              <option value="task">Task</option>
              <option value="subtask">Subtask</option>
              <option value="deadline">Deadline</option>
              <option value="general">General</option>
              <option value="feedback">Feedback</option>
            </select>
            <select
              className="form-input rounded-xl border border-[#dde0e3] h-12 px-4"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Sort by: Newest First</option>
              <option value="oldest">Sort by: Oldest First</option>
            </select>
          </div>

          {/* Notification Sections */}
          {['today', 'yesterday', 'general'].map((section) =>
            grouped[section].length > 0 && (
              <div key={section}>
                <h3 className="text-lg font-bold capitalize py-2">{section}</h3>
                <div className="flex flex-col gap-2 mb-4">
                  {grouped[section].map((n) => (
                    <div key={n.id} className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm min-h-[72px]">
                      <div className="flex items-center justify-center rounded-lg bg-[#f1f2f4] shrink-0 size-12">
                        {getIcon(n.icon)}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[#121416] text-base font-medium">{n.title}</p>
                        <p className="text-[#6a7581] text-sm">{n.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
