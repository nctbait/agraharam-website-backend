import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  CurrencyDollarIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BuildingStorefrontIcon,
  BanknotesIcon,
  UserPlusIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';

/**
 * Collapsible Admin Sidebar
 * - Groups: Finance, Youth Services, Super Admin, Events, Reports
 * - Persists open/closed state in localStorage
 * - Highlights active link; supports role-based visibility
 * - Drop-in replacement for AdminSidebar.jsx
 */
export default function AdminSidebar({ isOpen = true }) {
  const user = useContext(AuthContext);
  const role = user?.userRole; // 'admin' | 'superAdmin'

  // ------------ Links by group ------------
  const financeLinks = [
    { to: '/event-payment-pending', label: 'Event Registration', icon: CurrencyDollarIcon },
    { to: '/admin/donation-approval', label: 'Donation Approval', icon:   BanknotesIcon },
    { to: '/admin/billapproval', label: 'Bill Approval', icon: ClipboardDocumentListIcon },
    { to: '/membership-upgrade-approval', label: 'Membership Upgrade', icon: UsersIcon },
    { to: '/vendor-list', label: 'Vendor Management', icon: BuildingStorefrontIcon },
    { to: '/vendor-payment-list', label: 'Vendor Payments', icon: UserPlusIcon },
    { to: '/admin/refunds', label: 'Manage Refunds', icon: ReceiptRefundIcon },
  ];

  const youthLinks = [
    { to: '/admin/volunteer-hour-approval', label: 'Volunteer Hours', icon: ClockIcon },
    { to: '/volunteer-search', label: 'Volunteer Search', icon: UsersIcon },
  ];

  const superAdminLinks = [
    { to: '/admin/user-roles', label: 'User Role Management', icon: UsersIcon },
    { to: '/admin/approvals', label: 'Registration Approvals', icon: ClipboardDocumentListIcon },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: DocumentTextIcon },
    { to: '/admin/notification-management', label: 'Notification Templates', icon: BellIcon },
  ];

  const eventLinks = [
   // { to: '/admin/create-event', label: 'Create Event', icon: CalendarIcon },
    { to: '/admin/manage-events', label: 'Manage Events', icon: CalendarIcon },
    { to: '/admin/tasks', label: 'Manage Tasks', icon: ClipboardDocumentListIcon },
  ];

  const reportsLinks = [
    { to: '/admin/reports', label: 'Reports', icon: ChartBarIcon },
  ];

  // Dashboard (always visible)
  const topLinks = [{ to: '/admin/dashboard', label: 'Dashboard', icon: WrenchIcon }];

  // Role filtering: admins get everything except Super Admin group; superAdmins get all
  const canSeeSuper = role === 'superAdmin';

  // ------------ Collapsible state ------------
  const STORAGE_KEY = 'adminSidebar.openGroups.v1';
  const [open, setOpen] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        finance: saved.finance ?? true,
        youth: saved.youth ?? true,
        super: saved.super ?? true,
        events: saved.events ?? true,
        reports: saved.reports ?? false,
      };
    } catch {
      return { finance: true, youth: true, super: true, events: true, reports: false };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(open));
  }, [open]);

  const Section = ({ title, id, children }) => (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((s) => ({ ...s, [id]: !s[id] }))}
        className="w-full flex items-center justify-between text-left px-2 py-2 rounded-md hover:bg-gray-50"
      >
        <span className="text-xs uppercase tracking-wide text-gray-600">{title}</span>
        {open[id] ? (
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRightIcon className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {open[id] && <ul className="mt-1 space-y-1">{children}</ul>}
    </div>
  );

  const LinkItem = ({ to, label, icon: Icon }) => (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-50 ${
            isActive ? 'bg-blue-100 text-blue-700 font-semibold pointer-events-none' : 'text-gray-700'
          }`
        }
      >
        <Icon className="w-5 h-5" />
        <span className="truncate">{label}</span>
      </NavLink>
    </li>
  );

  return (
    <aside className={`border-r border-gray-200 bg-white shadow-sm p-4 transition-all duration-200 ${isOpen ? 'w-64' : 'w-16'} min-h-screen`}>
      <h2 className="text-xl font-bold mb-2 text-[#121416]">Admin Panel</h2>

      {/* Top Links */}
      <ul className="space-y-1">
        {topLinks.map((l) => (
          <LinkItem key={l.to} {...l} />
        ))}
      </ul>

      {/* Finance */}
      <Section title="Finance" id="finance">
        {financeLinks.map((l) => (
          <LinkItem key={l.to} {...l} />
        ))}
      </Section>

      {/* Youth Services */}
      <Section title="Youth Services" id="youth">
        {youthLinks.map((l) => (
          <LinkItem key={l.to} {...l} />
        ))}
      </Section>

      {/* Events */}
      <Section title="Events" id="events">
        {eventLinks.map((l) => (
          <LinkItem key={l.to} {...l} />
        ))}
      </Section>

      {/* Super Admin (only visible to super admins) */}
      {canSeeSuper && (
        <Section title="Super Admin" id="super">
          {superAdminLinks.map((l) => (
            <LinkItem key={l.to} {...l} />
          ))}
        </Section>
      )}

      {/* Reports */}
      <Section title="Reports" id="reports">
        {reportsLinks.map((l) => (
          <LinkItem key={l.to} {...l} />
        ))}
      </Section>

      {/* Footer tiny text */}
      <div className="mt-6 text-[11px] text-gray-400 px-2">
        <span>Agraharam NC</span>
      </div>
    </aside>
  );
}
