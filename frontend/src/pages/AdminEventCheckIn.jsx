import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import {
  Bars3Icon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

function rowKey(r) {
  return `${r.registrationId}:${r.personType}:${r.sourceId}`;
}

export default function AdminEventCheckIn() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // data
  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // edits
  const [dirty, setDirty] = useState(() => new Map());
  const hasDirty = dirty.size > 0;

  // submitted query (debounce-ish via explicit submit)
  const [submittedQ, setSubmittedQ] = useState('');

  // keep page from jumping when counts change
  const [unsavedCountTextWidth, setUnsavedCountTextWidth] = useState(0);
  const measureRef = useRef(null);

  // compute simple stats
  const stats = useMemo(() => {
    const visibleChecked = rows.filter(r => r.checkedIn).length;
    return { visibleChecked, pendingChanges: dirty.size };
  }, [rows, dirty]);

  // beforeunload protection
  useEffect(() => {
    const handler = (e) => {
      if (!hasDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasDirty]);

  const fetchPage = async (currPage = page, currQ = submittedQ) => {
    if (!eventId) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/admin/events/${eventId}/attendees/search`, {
        params: { q: currQ, page: currPage, size },
      });
      const data = res || {};
      setRows(Array.isArray(data.content) ? data.content : []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPage(data.number ?? currPage);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || 'Failed to load attendees.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const nextQ = q.trim();
    const proceed = !hasDirty || window.confirm('You have unsaved check-in changes. Discard and search?');
    if (!proceed) return;
    setDirty(new Map());
    setSubmittedQ(nextQ);
    setPage(0);
  };

  useEffect(() => {
    fetchPage(0, submittedQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQ, size]);

  const goToPage = (p) => {
    const proceed = !hasDirty || window.confirm('You have unsaved check-in changes. Discard and change page?');
    if (!proceed) return;
    setDirty(new Map());
    setPage(p);
  };

  useEffect(() => {
    if (page > 0 || submittedQ !== '') {
      fetchPage(page, submittedQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const markDirty = (row) => {
    const key = rowKey(row);
    setDirty(prev => {
      const next = new Map(prev);
      next.set(key, row);
      return next;
    });
  };

  const handleToggleOne = (idx) => {
    setRows(prev => {
      const next = [...prev];
      const row = { ...next[idx] };
      row.checkedIn = !row.checkedIn;
      next[idx] = row;
      markDirty(row);
      return next;
    });
  };

  const handleToggleAllVisible = (checked) => {
    setRows(prev => {
      const next = prev.map(r => {
        if (r.checkedIn !== checked) {
          const updated = { ...r, checkedIn: checked };
          markDirty(updated);
          return updated;
        }
        return r;
      });
      return next;
    });
  };

  const handleSave = async () => {
    if (dirty.size === 0) return;
    setSaving(true);
    setError('');
    try {
      const payload = Array.from(dirty.values()).map(r => ({
        registrationId: r.registrationId,
        personType: r.personType,
        sourceId: r.sourceId,
        name: r.name,
        relation: r.relation,
        checkedIn: !!r.checkedIn,
        attendeeId: r.attendeeId ?? null,
      }));
      await api.post(`/api/admin/events/${eventId}/attendees/toggle`, payload);
      setDirty(new Map());
      await fetchPage(page, submittedQ);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  // measure unsaved text once so the bar doesn't jump when the number changes
  useEffect(() => {
    if (!measureRef.current) return;
    setUnsavedCountTextWidth(measureRef.current.getBoundingClientRect().width);
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} showDashboardLink={true} />
        <div className="flex-1 p-6 space-y-6">
          {/* Sticky header row with stable controls */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Event Check‑In</h1>
                <span className="text-xs text-gray-500 ml-2">Event ID: {eventId}</span>
              </div>

              <div className="flex items-center gap-2">
              <button
                  type="button"
                  onClick={() => navigate('/admin/manage-events')}
                  className="h-9 w-40 px-4 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
                >
                  Manage Events
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllVisible(true)}
                  className="h-9 w-50 px-3 rounded-lg border hover:bg-gray-50 disabled:opacity-60"
                  disabled={rows.length === 0 || loading}
                  title="Mark all visible as checked‑in (not yet saved)"
                >
                  Check‑in all (visible)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllVisible(false)}
                  className="h-9 w-50 px-3 rounded-lg border hover:bg-gray-50 disabled:opacity-60"
                  disabled={rows.length === 0 || loading}
                  title="Mark all visible as not checked‑in (not yet saved)"
                >
                  Uncheck all (visible)
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="h-9 w-36 px-4 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
                  disabled={dirty.size === 0 || saving}
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>

            {/* Search row */}
            <form
              onSubmit={handleSearchSubmit}
              className="py-2"
            >
              <div className="bg-white p-3 rounded-xl shadow flex items-center gap-3">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-2 top-2.5" />
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by name (Primary, Spouse, Family, or Guest)…"
                    className="w-full border rounded pl-9 pr-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 w-28 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
                  disabled={loading}
                >
                  Search
                </button>

                <select
                  className="h-10 w-28 rounded-lg border px-2"
                  value={size}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value, 10);
                    const proceed = !hasDirty || window.confirm('You have unsaved changes. Discard and change page size?');
                    if (!proceed) return;
                    setDirty(new Map());
                    setSize(newSize);
                    setPage(0);
                  }}
                >
                  {[25, 50, 100, 150, 200].map(n => (
                    <option key={n} value={n}>{n}/page</option>
                  ))}
                </select>
              </div>
            </form>

            {/* Stable stats + reserved space for unsaved text to stop shifting */}
            <div className="flex items-center justify-between py-2">
              <div className="text-sm text-gray-600">
                Showing page <b>{page + 1}</b> of <b>{Math.max(totalPages, 1)}</b> ·
                &nbsp;Total matches: <b>{totalElements}</b> ·
                &nbsp;Checked (visible): <b>{stats.visibleChecked}</b>
              </div>
              <div className="text-sm font-medium" style={{ minWidth: unsavedCountTextWidth || undefined }}>
                {hasDirty ? (
                  <span className="text-amber-700">Unsaved changes: {dirty.size}</span>
                ) : (
                  // invisible placeholder to reserve width after first measure
                  <span ref={measureRef} className="invisible">Unsaved changes: 000</span>
                )}
              </div>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="max-w-5xl mx-auto text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Results */}
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed text-sm">
                <colgroup>
                  <col style={{ width: '34%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '8%' }} />
                </colgroup>
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Relation</th>
                    <th className="text-left px-4 py-2">Type</th>
                    <th className="text-left px-4 py-2">Registration</th>
                    <th className="text-left px-4 py-2">Edited</th>
                    <th className="text-left px-4 py-2">Checked‑In</th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Loading…</td>
                    </tr>
                  )}
                  {!loading && rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                        {submittedQ ? 'No matches for your search.' : 'Type a name above and press Search.'}
                      </td>
                    </tr>
                  )}
                  {!loading && rows.map((r, idx) => {
                    const k = rowKey(r);
                    const isDirty = dirty.has(k);
                    return (
                      <tr key={k} className={idx % 2 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2">
                          <div className="font-medium truncate">{r.name}</div>
                          <div className="text-[10px] text-gray-500">
                            srcId:{r.sourceId} · attendeeId:{r.attendeeId ?? '—'}
                          </div>
                        </td>
                        <td className="px-4 py-2">{r.relation || '—'}</td>
                        <td className="px-4 py-2">{r.personType}</td>
                        <td className="px-4 py-2">{r.registrationId}</td>
                        <td className="px-4 py-2">
                          <div className="h-5 w-5 rounded-full border flex items-center justify-center">
                            {isDirty ? <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> : null}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 align-middle"
                            checked={!!r.checkedIn}
                            onChange={() => handleToggleOne(idx)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination (fixed button widths prevent wiggle) */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => goToPage(Math.max(0, page - 1))}
                className="h-9 w-28 px-3 rounded-lg border hover:bg-gray-100 disabled:opacity-60"
                disabled={!canPrev || loading}
              >
                Previous
              </button>
              <div className="text-xs text-gray-600">
                Page <b>{page + 1}</b> / <b>{Math.max(1, totalPages)}</b>
              </div>
              <button
                type="button"
                onClick={() => canNext && goToPage(page + 1)}
                className="h-9 w-28 px-3 rounded-lg border hover:bg-gray-100 disabled:opacity-60"
                disabled={!canNext || loading}
              >
                Next
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto text-xs text-gray-500">
            Tip: Save frequently. Only changed rows are sent to the server.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
