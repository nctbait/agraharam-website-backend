import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import api from '../api/authAxios';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SubmitBill() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    memberId: '',
    memberRelation: '',
    amount: '',
    description: '',
    eventId: '',
    file: null,
    zelleId: '',
    zelleName: '',
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const [primary, spouse, children] = await Promise.all([
          api.get('/api/family/primary'),
          api.get('/api/family/spouse'),
          // api.get('/api/family/current_members'),
        ]);

        const members = [];

        if (primary?.id && primary?.firstName) {
          members.push({ id: primary.id, name: primary.firstName + ' ' + primary.lastName, relation: 'Primary' });
        }

        if (spouse?.id && spouse?.firstName) {
          members.push({ id: spouse.id, name: spouse.firstName + ' ' + spouse.lastName, relation: 'Spouse' });
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
        setEventOptions(events);
      } catch (err) {
        console.error("Error loading events", err);
      }
    };

    fetchFamilyMembers();
    fetchEvents();
  }, []);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", formData.file);
      formDataToSend.append("data", JSON.stringify({
        memberId: formData.memberId,
        memberRelation: formData.memberRelation,
        amount: formData.amount,
        description: formData.description,
        eventId: formData.eventId,
        zelleId: formData.zelleId,
        zelleName: formData.zelleName,
      }));

      await api.instance.post('/api/bills/submit', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/user-payments');
    } catch (err) {
      console.error("Bill submission failed", err);
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
            {sidebarOpen ? (
              <ArrowLeftIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
          <main className="flex-1 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl my-6">
            <h2 className="text-2xl font-bold mb-4">Submit New Bill</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
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


              <div className="flex flex-col gap-2">
                <label className="font-semibold">Upload Related Document</label>
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="form-input border border-gray-300 px-4 py-2 rounded-lg"
                  required
                />
              </div>


              <div className="flex justify-end">
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
                >
                  Submit Bill
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
