import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  UsersIcon,
  ShieldCheckIcon,
  WrenchIcon,
  BellIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,ClockIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';

export default function AdminSidebar() {
  const  user  = useContext(AuthContext);
  const role = user?.userRole;

  const superAdminLinks = [
    //{ to: '/admin/roles', label: 'Roles & Permissions', icon: ShieldCheckIcon },
    { to: '/admin/user-roles', label: 'User Role Management', icon: UsersIcon },
    { to: '/admin/approvals', label: 'Registration Approvals', icon: ClipboardDocumentListIcon },
    //{ to: '/admin/audit-logs', label: 'Audit Logs', icon: DocumentTextIcon },
    { to: '/admin/settings', label: 'Website Settings', icon: Cog6ToothIcon },
    { to: '/admin/notification-management', label: 'Notification Templates', icon: BellIcon },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: WrenchIcon },
    { to: '/membership-upgrade-approval' , label: 'Membership Upgrade Approval', icon: UsersIcon},
    { to: '/event-payment-pending', label: 'Event Registration Payments', icon: CurrencyDollarIcon },
    { to: '/admin/billapproval', label: 'Bill Approval', icon: CurrencyDollarIcon },
    { to: '/admin/create-event', label: 'Create Event', icon: CalendarIcon },
    { to: '/admin/manage-events', label: 'Manage Events', icon: CalendarIcon },
    { to: '/admin/tasks', label: 'Manage Tasks', icon: ClipboardDocumentListIcon },
    { to: '/admin/volunteer-hour-approval', label: 'Volunteer Hours Approval', icon: ClockIcon },
    { to: '/matrimony-approval', label: 'Matrimony Approval', icon: UsersIcon },
    { to: '/admin/registrations', label: 'Event Registrations', icon: UsersIcon },
    { to: '/admin/reports', label: 'Reports', icon: ChartBarIcon },
    { to: '/notification-center', label: 'Notification Center', icon: BellIcon }
  ];

  const linksToShow = role === 'superAdmin' ? [...adminLinks, ...superAdminLinks] : adminLinks;
  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 bg-white shadow-sm p-4">
      <h2 className="text-xl font-bold mb-4 text-[#121416]">Admin Panel</h2>
      <ul className="space-y-2">
        {linksToShow.map(({ to, label, icon: Icon }) => (
          <li key={label}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 ${
                  isActive ? 'bg-blue-100 text-blue-700 font-semibold pointer-events-none' : 'text-gray-700'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
