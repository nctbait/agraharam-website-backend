import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/authAxios';

export default function AdminReports() {
  const [events, setEvents] = useState([]);
  const [busyKey, setBusyKey] = useState(null);
  const [error, setError] = useState('');

  // Prefetch events for event-specific report dropdown
  useEffect(() => {
    api.get('/api/events/upcoming')
      .then(res => setEvents(res || []))
      .catch(() => setEvents([]));
  }, []);

  // --- helpers ---
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Always use raw axios instance for blob downloads (csv)
  const fetchCsvBlob = async (endpoint, params) => {
    const res = await api.instance.get(endpoint, {
      params,
      responseType: 'blob',
      headers: { Accept: 'text/csv' }
    });
    return res.data; // this is already a Blob
  };

  // Use api.get for JSON, then stringify to blob for download
  const fetchJsonBlob = async (endpoint, params) => {
    const data = await api.get(endpoint + buildQuery(params)); // api.get returns res.data
    const json = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    return json;
  };

  const buildQuery = (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, v);
    });
    const s = q.toString();
    return s ? `?${s}` : '';
  };

  // configs
  const reportConfigs = useMemo(() => ({
    financial: [
      {
        key: 'txn-summary',
        title: 'Transaction Summary Report',
        description: 'Summary of all approved financial transactions within a date range.',
        fields: [
          { type: 'dateRange' },
          { type: 'select', name: 'format', label: 'Format', options: ['csv', 'json'], defaultValue: 'csv' }
        ],
        run: async ({ startDate, endDate, format = 'csv' }) => {
          const params = { startDate, endDate, format };
          const fname = `transactions_${startDate || 'all'}_${endDate || 'all'}.${format}`;
          if (format === 'csv') {
            const blob = await fetchCsvBlob('/api/admin/reports/transactions', params);
            downloadBlob(blob, fname);
          } else {
            const blob = await fetchJsonBlob('/api/admin/reports/transactions', params);
            downloadBlob(blob, fname);
          }
        }
      },
      {
        key: 'event-financial',
        title: 'Event Financial Report',
        description: 'Income vs expenses for a selected event.',
        fields: [
          { type: 'eventSelect', name: 'eventId', label: 'Event', required: true },
          { type: 'select', name: 'format', label: 'Format', options: ['csv', 'json'], defaultValue: 'csv' }
        ],
        run: async ({ eventId, format = 'csv' }) => {
          const params = { format };
          const fname = `event_${eventId}_financial.${format}`;
          if (format === 'csv') {
            const blob = await fetchCsvBlob(`/api/admin/reports/events/${eventId}/financial`, params);
            downloadBlob(blob, fname);
          } else {
            const blob = await fetchJsonBlob(`/api/admin/reports/events/${eventId}/financial`, params);
            downloadBlob(blob, fname);
          }
        }
      }
    ],
    membership: [
      {
        key: 'active-members',
        title: 'Active Member List',
        description: 'All active members with contact information.',
        fields: [{ type: 'select', name: 'format', label: 'Format', options: ['csv', 'json'], defaultValue: 'csv' }],
        run: async ({ format = 'csv' }) => {
          const params = { format };
          const fname = `active_members.${format}`;
          if (format === 'csv') {
            const blob = await fetchCsvBlob('/api/admin/reports/members/active', params);
            downloadBlob(blob, fname);
          } else {
            const blob = await fetchJsonBlob('/api/admin/reports/members/active', params);
            downloadBlob(blob, fname);
          }
        }
      },
      {
        key: 'new-members',
        title: 'New Member Report',
        description: 'Members who joined within a date range.',
        fields: [
          { type: 'dateRange' },
          { type: 'select', name: 'format', label: 'Format', options: ['csv', 'json'], defaultValue: 'csv' }
        ],
        run: async ({ startDate, endDate, format = 'csv' }) => {
          const params = { startDate, endDate, format };
          const fname = `new_members_${startDate || 'all'}_${endDate || 'all'}.${format}`;
          if (format === 'csv') {
            const blob = await fetchCsvBlob('/api/admin/reports/members/new', params);
            downloadBlob(blob, fname);
          } else {
            const blob = await fetchJsonBlob('/api/admin/reports/members/new', params);
            downloadBlob(blob, fname);
          }
        }
      }
    ],
    task: [
      {
        key: 'task-completion',
        title: 'Task Completion Report',
        description: 'Tasks completed in a date range (with assignees).',
        fields: [
          { type: 'dateRange' },
          { type: 'select', name: 'format', label: 'Format', options: ['csv', 'json'], defaultValue: 'csv' }
        ],
        run: async ({ startDate, endDate, format = 'csv' }) => {
          const params = { startDate, endDate, format };
          const fname = `tasks_completed_${startDate || 'all'}_${endDate || 'all'}.${format}`;
          if (format === 'csv') {
            const blob = await fetchCsvBlob('/api/admin/reports/tasks/completed', params);
            downloadBlob(blob, fname);
          } else {
            const blob = await fetchJsonBlob('/api/admin/reports/tasks/completed', params);
            downloadBlob(blob, fname);
          }
        }
      },
      {
        key: 'task-summary',
        title: 'Task Summary Report',
        description: 'All tasks grouped by status with counts.',
        fields: [{ type: 'select', name: 'format', label: 'Format', options: ['csv', 'json'], defaultValue: 'csv' }],
        run: async ({ format = 'csv' }) => {
          const params = { format };
          const fname = `tasks_summary.${format}`;
          if (format === 'csv') {
            const blob = await fetchCsvBlob('/api/admin/reports/tasks/summary', params);
            downloadBlob(blob, fname);
          } else {
            const blob = await fetchJsonBlob('/api/admin/reports/tasks/summary', params);
            downloadBlob(blob, fname);
          }
        }
      }
    ]
  }), []);

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 px-4 lg:px-20 py-6">
          <h1 className="text-2xl font-bold mb-6">Reports</h1>

          {error && <div className="mb-4 text-red-600">{error}</div>}

          <ReportSection
            title="Financial Reports"
            reports={reportConfigs.financial}
            busyKey={busyKey}
            setBusyKey={setBusyKey}
            setError={setError}
            events={events}
          />

          <ReportSection
            title="Membership Reports"
            reports={reportConfigs.membership}
            busyKey={busyKey}
            setBusyKey={setBusyKey}
            setError={setError}
          />

          <ReportSection
            title="Task Reports"
            reports={reportConfigs.task}
            busyKey={busyKey}
            setBusyKey={setBusyKey}
            setError={setError}
          />
        </main>
      </div>
      <Footer />
    </>
  );
}

function ReportSection({ title, reports, busyKey, setBusyKey, setError, events = [] }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex flex-col gap-4">
        {reports.map((r) => (
          <ReportRow
            key={r.key}
            report={r}
            busyKey={busyKey}
            setBusyKey={setBusyKey}
            setError={setError}
            events={events}
          />
        ))}
      </div>
    </section>
  );
}

function ReportRow({ report, busyKey, setBusyKey, setError, events }) {
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState(initParams(report.fields));
  const isBusy = busyKey === report.key;

  const handleRun = async () => {
    setError('');
    setBusyKey(report.key);
    try {
      await report.run(params);
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError('Failed to generate report.');
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#dde0e3]">
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3">
        <div className="flex flex-col gap-1 flex-1">
          <p className="text-base font-medium text-[#121416]">{report.title}</p>
          <p className="text-sm text-[#6a7581]">{report.description}</p>
        </div>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <button
            onClick={() => setOpen(o => !o)}
            className="rounded-full h-8 px-4 bg-[#f1f2f4] text-sm font-medium text-[#121416]"
          >
            {open ? 'Hide Filters' : 'Filters'}
          </button>
          <button
            onClick={handleRun}
            disabled={isBusy}
            className={`rounded-full h-8 px-4 text-sm font-medium ${isBusy ? 'bg-gray-300' : 'bg-[#0c77f2] text-white'}`}
          >
            {isBusy ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-[#eef1f4]">
          <FilterFields fields={report.fields} params={params} setParams={setParams} events={events} />
        </div>
      )}
    </div>
  );
}

function initParams(fields = []) {
  const base = {};
  fields.forEach(f => {
    if (f.type === 'select' && f.defaultValue) base[f.name] = f.defaultValue;
  });
  return base;
}

function FilterFields({ fields = [], params, setParams, events = [] }) {
  const set = (name, value) => setParams(p => ({ ...p, [name]: value }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
      {fields.map((f, idx) => {
        if (f.type === 'dateRange') {
          return (
            <React.Fragment key={`dr-${idx}`}>
              <div>
                <label className="block text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={params.startDate || ''}
                  onChange={e => set('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={params.endDate || ''}
                  onChange={e => set('endDate', e.target.value)}
                />
              </div>
            </React.Fragment>
          );
        }
        if (f.type === 'select') {
          return (
            <div key={`sel-${idx}`}>
              <label className="block text-sm text-gray-600">{f.label || f.name}</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={params[f.name] ?? f.defaultValue ?? ''}
                onChange={e => set(f.name, e.target.value)}
              >
                {(f.options || []).map(opt => (
                  <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                ))}
              </select>
            </div>
          );
        }
        if (f.type === 'eventSelect') {
          return (
            <div key={`evt-${idx}`}>
              <label className="block text-sm text-gray-600">{f.label || 'Event'}</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={params.eventId || ''}
                onChange={e => set('eventId', e.target.value)}
                required={f.required}
              >
                <option value="">-- Select Event --</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} — {ev.date}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
