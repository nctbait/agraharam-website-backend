// src/pages/SubmitBill.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import api from '../api/authAxios';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import AttachmentsPanel from '../components/AttachmentsPanel'; // <-- import it

export default function SubmitBill() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    memberId: '',
    memberRelation: '',
    amount: '',
    description: '',
    eventId: '',
    zelleId: '',
    zelleName: '',
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createdBillId, setCreatedBillId] = useState(null); // <-- store bill id after create

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const [primary, spouse] = await Promise.all([
          api.get('/api/family/primary'),
          api.get('/api/family/spouse'),
        ]);
        const members = [];
        if (primary?.id && primary?.firstName) {
          members.push({ id: String(primary.id), name: `${primary.firstName} ${primary.lastName}`, relation: 'Primary' });
        }
        if (spouse?.id && spouse?.firstName) {
          members.push({ id: String(spouse.id), name: `${spouse.firstName} ${spouse.lastName}`, relation: 'Spouse' });
        }
        setFamilyMembers(members);
      } catch (err) {
        console.error("Error loading family members", err);
      }
    };

    const fetchEvents = async () => {
      try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const date = oneYearAgo.toISOString().split("T")[0];
        const events = await api.get(`/api/events/list/${date}`);
        setEventOptions(events || []);
      } catch (err) {
        console.error("Error loading events", err);
      }
    };

    fetchFamilyMembers();
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // STEP 1: create bill (no files)
  const handleCreateBill = async (e) => {
    e.preventDefault();

    if (!formData.memberId || !formData.amount || !formData.description || !formData.zelleId || !formData.zelleName) {
      alert('Please complete all required fields.');
      return;
    }

    try {
      const payload = {
        memberId: Number(formData.memberId),
        memberRelation: formData.memberRelation,
        amount: Number(formData.amount),
        description: formData.description,
        eventId: formData.eventId ? Number(formData.eventId) : null,
        zelleId: formData.zelleId,
        zelleName: formData.zelleName,
      };

      // Prefer a JSON endpoint that returns the bill ID
      // If you added /api/bills/submit-json as discussed:
      const res = await api.post('/api/bills/submit-json', payload);

      // Expect { id: <newBillId>, ... }
      const billId = res?.id ?? res?.billId;
      if (!billId) {
        alert('Bill created, but ID not returned. Please contact support.');
        return;
      }
      setCreatedBillId(billId);
    } catch (err) {
      console.error("Bill submission failed", err);
      alert('Bill submission failed. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} showDashboardLink={true} />
        <div className="flex-1 p-6 space-y-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {sidebarOpen ? <ArrowLeftIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>

          <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl my-6">
            <h2 className="text-2xl font-bold mb-4">Submit New Bill</h2>

            {!createdBillId ? (
              // STEP 1: Create bill (no file input)
              <form onSubmit={handleCreateBill} className="grid grid-cols-1 gap-4">
                <select
                  name="memberId"
                  value={formData.memberId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedMember = familyMembers.find(m => m.id === selectedId);
                    setFormData(prev => ({
                      ...prev,
                      memberId: selectedId,
                      memberRelation: selectedMember?.relation || '',
                    }));
                  }}
                  required
                  className="form-select h-12 rounded-lg border border-gray-300 px-4"
                >
                  <option value="" disabled>Select Family Member</option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relation})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Bill Amount"
                  className="form-input h-12 rounded-lg border border-gray-300 px-4"
                  required
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description of the expense"
                  rows={4}
                  className="form-textarea rounded-lg border border-gray-300 px-4 py-2"
                  required
                />

                <select
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleChange}
                  className="form-select h-12 rounded-lg border border-gray-300 px-4"
                >
                  <option value="">Select Associated Event (optional)</option>
                  {eventOptions.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>

                <input
                  type="text"
                  name="zelleId"
                  value={formData.zelleId}
                  onChange={handleChange}
                  placeholder="Zelle ID (Email or Phone)"
                  className="form-input h-12 rounded-lg border border-gray-300 px-4"
                  required
                />

                <input
                  type="text"
                  name="zelleName"
                  value={formData.zelleName}
                  onChange={handleChange}
                  placeholder="Name on Zelle Account"
                  className="form-input h-12 rounded-lg border border-gray-300 px-4"
                  required
                />

                {/* No file input here anymore */}
                <div className="flex justify-end">
                  <button type="submit" className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold">
                    Create Bill
                  </button>
                </div>
              </form>
            ) : (
              // STEP 2: After bill is created, attach files via the panel
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 p-3">
                  Bill created successfully (ID: {createdBillId}). Attach your receipt/invoice below.
                </div>

                {/* Attachments belong to the BILL */}
                <AttachmentsPanel ownerType="BILL" ownerId={createdBillId} canEdit />

                <div className="flex justify-end gap-2">
                  <button
                    className="h-10 px-6 rounded-lg bg-gray-100 text-gray-900 font-semibold"
                    onClick={() => navigate('/user-payments')}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
