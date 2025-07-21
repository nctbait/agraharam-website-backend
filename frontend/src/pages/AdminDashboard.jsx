import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  const user  = useContext(AuthContext);

  // Helpers to check role categories
  const isSuperAdmin = user?.userRole?.startsWith('superAdmin');
  const isAdmin = user?.userRole?.startsWith('admin');

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          {/* Admin Tools */}
          {(isAdmin || isSuperAdmin) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AdminCard title="Create Event" href="/create-event" />
              <AdminCard title="Manage Events" href="/manage-events" />
              <AdminCard title="Manage Tasks" href="/manage-tasks" />
              <AdminCard title="Check Registrations" href="/registration-summary" />
              <AdminCard title="Reports" href="/admin-reports" />
              <AdminCard title="Matrimony Approval" href="/matrimony-approval" />
              <AdminCard title="Notification Center" href="/notification-center" />
            </div>
          )}

          {/* Super Admin Tools */}
          {isSuperAdmin && (
            <>
              <h2 className="text-xl font-semibold mt-10 mb-4">Super Admin Controls</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AdminCard title="User Role Management" href="/user-roles" />
                <AdminCard title="User Registration Approvals" href="/admin-approval" />
                <AdminCard title="Website Settings" href="/website-settings" />
                <AdminCard title="Manage Notification Templates" href="/notification-template-management" />
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

function AdminCard({ title, href }) {
  return (
    <div className="flex gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 items-center">
      <div className="text-[#111418]">
        {/* Placeholder icon — can be enhanced */}
        <svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
      </div>
      <h2 className="text-[#111418] text-base font-bold leading-tight">
        <a href={href}>{title}</a>
      </h2>
    </div>
  );
}
