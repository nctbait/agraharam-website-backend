import { useEffect, useState } from 'react';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminBillApprovals() {
  const [bills, setBills] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/bills/admin/pending').then(response => {
      const data = response || [];
      setBills(data);
      setFiltered(data);
    });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      bills.filter(b =>
        (b.description || '').toLowerCase().includes(value) ||
        (b.memberName || '').toLowerCase().includes(value) ||
        (b.eventName || '').toLowerCase().includes(value) ||
        (b.zelleId || '').toLowerCase().includes(value)
      )
    );
  };

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selected.length === 0) return;
    await api.post(`/api/bills/admin/bulk/${action}`, selected);
    const remaining = filtered.filter(b => !selected.includes(b.id));
    setBills(remaining);
    setFiltered(remaining);
    setSelected([]);
  };

  const handleSingleAction = async (id, action) => {
    await api.post(`/api/bills/admin/${id}/${action}`);
    const remaining = filtered.filter(b => b.id !== id);
    setBills(remaining);
    setFiltered(remaining);
  };

  async function fetchBillAttachments(billId) {
    return await api.get('/api/attachments', { params: { ownerType: 'BILL', ownerId: billId } }) || [];
  }

  
  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Pending Bill Approvals</h2>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by description, member, event, Zelle..."
              className="border border-gray-300 px-3 py-2 rounded w-80"
            />
          </div>

          <div className="overflow-x-auto rounded shadow border">
            <table className="min-w-full text-sm text-left table-auto">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <th className="p-2"><input type="checkbox" onChange={e =>
                    setSelected(e.target.checked ? filtered.map(b => b.id) : [])
                  } checked={selected.length === filtered.length && filtered.length > 0} /></th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Member</th>
                  <th className="p-2">Zelle Info</th>
                  <th className="p-2">File</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((b, idx) => (
                  <tr key={`bill-${b.id || idx}`} className="hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(b.id)}
                        onChange={() => toggleSelect(b.id)}
                      />
                    </td>
                    <td className="p-2">{b.submittedDate}</td>
                    <td className="p-2">${b.amount}</td>
                    <td className="p-2">
                      <div>{b.eventName}</div>
                      <div className="text-xs text-gray-500">{b.description}</div>
                    </td>
                    <td className="p-2">{b.memberName || b.memberId}</td>
                    <td className="p-2">
                      <div>{b.zelleId}</div>
                      <div className="text-xs text-gray-500">{b.zelleName}</div>
                    </td>
                    <td className="p-2">
                      <BillDownloadCell billId={b.id} />
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleSingleAction(b.id, 'approve')}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleSingleAction(b.id, 'reject')}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      No pending bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selected.length > 0 && (
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => handleBulkAction('approve')}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve Selected
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject Selected
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

// --- Helpers for downloading bill attachments (inline component) ---

async function fetchBillAttachments(billId) {
  // Uses the centralized attachments API
  // ownerType must match your AttachmentOwnerType enum value
  return await api.get('/api/attachments', {
    params: { ownerType: 'BILL', ownerId: billId }
  }) || [];
}

function BillDownloadCell({ billId }) {
  const [atts, setAtts] = useState(null); // null means "loading"
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchBillAttachments(billId);
        if (mounted) setAtts(list);
      } catch (e) {
        console.error('attachments load', e);
        if (mounted) setAtts([]);
      }
    })();
    return () => { mounted = false; };
  }, [billId]);

  async function downloadAttachmentById(id, filename = 'file') {
    // Use your axios instance and make sure it includes auth headers
    const res = await api.instance.get(`/api/attachments/${id}?download=true`, {
      responseType: 'blob',
    });
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  if (atts === null) return <span className="text-xs text-gray-500">Loading…</span>;
  if (!atts.length) return <span className="text-xs text-gray-500">No file</span>;

  // If only one attachment, show a simple “Download” link
  if (atts.length === 1) {
    const a = atts[0];
    return (
      <button
        className="text-blue-600 underline"
        onClick={() => downloadAttachmentById(a.id, a.filename)}
      >
        Download
      </button>
    );
  }

  // Multiple attachments: compact dropdown list of download links
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className="text-blue-600 underline"
      >
        {atts.length} files
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 bg-white border rounded shadow min-w-[220px]">
          {atts.map(a => (
            <li key={a.id} className="px-3 py-2 hover:bg-gray-50">
            <button
              className="text-blue-600 hover:underline break-all"
              onClick={() => downloadAttachmentById(a.id, a.filename)}
            >
              {a.filename}
            </button>
          </li>
          ))}
        </ul>
      )}
    </div>
  );
}

