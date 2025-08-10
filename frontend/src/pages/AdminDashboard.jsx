// AdminDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import {
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UsersIcon,
  WrenchIcon,
  BellIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const isSuperAdmin = user?.userRole?.startsWith('superAdmin');
  const isAdmin = user?.userRole?.startsWith('admin');

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get('/api/admin/metrics')
      .then(res => {
        if (!mounted) return;
        setMetrics(res);
      })
      .catch(e => {
        console.error(e);
        setErr('Failed to load metrics.');
      })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          {loading && <div className="text-gray-500">Loading metrics…</div>}
          {err && <div className="text-red-600 mb-3">{err}</div>}

          {!loading && metrics && (
            <>
              <h2 className="text-xl font-semibold mb-4">System Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">

                <MetricCard label="Pending Registrations" value={metrics.pendingRegistrations}
                  icon={<ClipboardDocumentListIcon className="w-6 h-6" />} path="/admin/approvals" navigate={navigate} />

                <MetricCard label="Unapproved Donations" value={metrics.unapprovedDonations}
                  icon={<CurrencyDollarIcon className="w-6 h-6" />} path="/admin/donation-approval" navigate={navigate} />

                <MetricCard label="Event Payments (Pending)" value={metrics.pendingEventPayments}
                  icon={<CurrencyDollarIcon className="w-6 h-6" />} path="/event-payment-pending" navigate={navigate} />

                <MetricCard label="Upcoming Events" value={metrics.upcomingEvents}
                  icon={<CalendarIcon className="w-6 h-6" />} path="/admin/manage-events" navigate={navigate} />

                <MetricCard label="Open Tasks" value={metrics.openTasks}
                  icon={<ClipboardDocumentListIcon className="w-6 h-6" />} path="/admin/tasks" navigate={navigate} />

                <MetricCard label="Overdue Tasks" value={metrics.overdueTasks}
                  icon={<ExclamationTriangleIcon className="w-6 h-6" />} path="/admin/tasks" navigate={navigate} />

                <MetricCard label="Pending Bills" value={metrics.pendingBills}
                  icon={<CurrencyDollarIcon className="w-6 h-6" />} path="/admin/billapproval" navigate={navigate} />

                <MetricCard label="Volunteer Hours Pending" value={metrics.pendingVolunteerHours}
                  icon={<ClipboardDocumentListIcon className="w-6 h-6" />} path="/admin/volunteer-hour-approval" navigate={navigate} />

                <MetricCard label="Active Members" value={metrics.activeMembers}
                  icon={<UsersIcon className="w-6 h-6" />} path="/admin/reports" navigate={navigate} />

                <MetricCard label="Donations (YTD)" value={`$${metrics.donationsYTD.toFixed(2)}`}
                  icon={<CurrencyDollarIcon className="w-6 h-6" />} path="/admin/reports" navigate={navigate} />
              </div>
            </>
          )}

          {/*(isAdmin || isSuperAdmin) && (
            <>
              <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AdminCard title="Create Event" path="/admin/create-event" navigate={navigate} />
                <AdminCard title="Manage Events" path="/admin/manage-events" navigate={navigate} />
                <AdminCard title="Manage Tasks" path="/admin/tasks" navigate={navigate} />
                <AdminCard title="Volunteer Hours Approval" path="/admin/volunteer-hour-approval" navigate={navigate} />
                <AdminCard title="Event Registration Payments" path="/event-payment-pending" navigate={navigate} />
                <AdminCard title="Donation Approval" path="/admin/donation-approval" navigate={navigate} />
                <AdminCard title="Bill Approval" path="/admin/billapproval" navigate={navigate} />
                <AdminCard title="Membership Upgrade Approval" path="/membership-upgrade-approval" navigate={navigate} />
                <AdminCard title="Matrimony Approval" path="/matrimony-approval" navigate={navigate} />
                <AdminCard title="Volunteer Search" path="/volunteer-search" navigate={navigate} />
                <AdminCard title="Reports" path="/admin/reports" navigate={navigate} />
              </div>
            </>
          )}

          {isSuperAdmin && (
            <>
              <h2 className="text-xl font-semibold mt-10 mb-4">Super Admin Controls</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AdminCard title="User Role Management" path="/admin/user-roles" navigate={navigate} />
                <AdminCard title="User Registration Approvals" path="/admin/approvals" navigate={navigate} />
                <AdminCard title="Audit Logs" path="/admin/audit-logs" navigate={navigate} />
                <AdminCard title="Notification Templates" path="/admin/notification-management" navigate={navigate} />
              </div>
            </>
          )*/}
        </main>
      </div>
      <Footer />
    </>
  );
}

function MetricCard({ label, value, icon, path, navigate }) {
  return (
    <div
      onClick={() => path && navigate(path)}
      className="cursor-pointer flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm hover:bg-blue-50 transition"
    >
      <div className="bg-blue-100 text-blue-700 rounded-full p-2">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function AdminCard({ title, path, navigate }) {
  return (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer flex gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 items-center hover:bg-blue-50"
    >
      <div className="text-[#111418]">
        <svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
      </div>
      <h2 className="text-[#111418] text-base font-bold leading-tight">{title}</h2>
    </div>
  );
}
