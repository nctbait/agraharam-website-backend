import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../api/authAxios';
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
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const links = [
  { label: 'Events', icon: CalendarDaysIcon, to: '/user-events' },
  { label: 'Payments', icon: CreditCardIcon, to: '/user-payments' },
  { label: 'Family', icon: UsersIcon, to: '/user-family' },
  { label: 'Upgrade Membership', icon: ArrowTrendingUpIcon, to: '/membership-upgrade' },
  { label: 'Submit Bill', icon: DocumentCurrencyDollarIcon, to: '/submit-bill' },
  { label: 'Volunteer Signup', icon: UsersIcon, to: '/volunteer-interest' },
  { label: 'Volunteer Hours', icon: ClockIcon, to: '/volunteer-hours' },
  { label: 'Tax Documents', icon: DocumentTextIcon, to: '/user-tax-docs' },
  { label: 'Matrimony Search', icon: HeartIcon, to: '/matrimony-profiles' },
  { label: 'Security', icon: ShieldCheckIcon, to: '/account/security' },
];

export default function Sidebar({ isOpen, showDashboardLink = false }) {
  const [showMatrimonySearch, setShowMatrimonySearch] = useState(false);
  useEffect(() => {
    const checkMatrimonyEligibility = async () => {
      try {
        const eligible = await api.get('/api/matrimony/is-eligible');
        setShowMatrimonySearch(eligible === true);
      } catch (err) {
        console.error('Failed to check matrimony access', err);
      }
    };
    checkMatrimonyEligibility();
  }, []);

  const filteredLinks = links.filter(link => {
    if (link.label === 'Matrimony Search') {
      return showMatrimonySearch;
    }
    return true;
  });


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
        {filteredLinks.map(({ label, icon: Icon, to }) => (
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
