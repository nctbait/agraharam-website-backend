import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CalendarDaysIcon,
  HeartIcon,
  CreditCardIcon,
  UsersIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  HomeIcon,
  DocumentCurrencyDollarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const links = [
  { label: 'Events', icon: CalendarDaysIcon, to: '/user-events' },
  { label: 'Matrimony Search', icon: HeartIcon, to: '/matrimony-profiles' },
  { label: 'Payments', icon: CreditCardIcon, to: '/user-payments' },
  { label: 'Family', icon: UsersIcon, to: '/user-family' },
  { label: 'Tax Documents', icon: DocumentTextIcon, to: '/user-tax-docs' },
  { label: 'Upgrade Membership', icon: ArrowTrendingUpIcon, to: '/membership-upgrade' },
  { label: 'Volunteer Hours', icon: ClockIcon, to: '/volunteer-hours' },
  { label: 'Submit Bill', icon: DocumentCurrencyDollarIcon, to: '/submit-bill' },
  { to: '/notification-center', label: 'Notification Center', icon: BellIcon },
];

export default function Sidebar({ isOpen, showDashboardLink = false }) {
  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } transition-all duration-300 overflow-hidden bg-[#f8fafc] border-r border-gray-200 min-h-screen`}
    >
      <div className="p-4 font-semibold text-lg border-b">Dashboard</div>
      <ul className="p-4 space-y-2">
        {showDashboardLink && (
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded hover:bg-blue-50 ${
                  isActive ? 'text-blue-600 font-semibold pointer-events-none' : 'text-gray-700'
                }`
              }
            >
              <HomeIcon className="h-5 w-5" />
              Dashboard
            </NavLink>
          </li>
        )}
        {links.map(({ label, icon: Icon, to }) => (
          <li key={label}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded hover:bg-blue-50 ${
                  isActive ? 'text-blue-600 font-semibold pointer-events-none' : 'text-gray-700'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
