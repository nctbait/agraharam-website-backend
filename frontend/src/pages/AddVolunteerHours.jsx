// AddVolunteerHours.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import api from '../api/authAxios';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const AddVolunteerHours = () => {
  const { memberId } = useParams();
  const [searchParams] = useSearchParams();
  const relationship = searchParams.get('relationship');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [member, setMember] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    hours: '',
    eventId: '',
    committeeId: '',
    description: ''
  });
  const [events, setEvents] = useState([]);
  const [committees, setCommittees] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const [primary, spouse, children, eventsRes, committeesRes] = await Promise.all([
        api.get('/api/family/primary'),
        api.get('/api/family/spouse'),
        api.get('/api/family/current_members'),
        api.get('/api/events/upcoming'),
        api.get('/api/committees/active')
      ]);

      const familyList = [];
      if (primary?.id && primary?.firstName) {
        familyList.push({ id: primary.id, name: primary.firstName + ' ' + primary.lastName, relationship: 'Primary' });
      }

      if (spouse?.id && spouse?.firstName) {
        familyList.push({ id: spouse.id, name: spouse.firstName + ' ' + spouse.lastName, relationship: 'Spouse' });
      }

      if (Array.isArray(children)) {
        children.forEach(c => {
          familyList.push({ id: c.id, name: c.name, relationship: c.relation });
        });
      }

      const target = familyList.find(f => f.id.toString() === memberId && f.relationship === relationship);
      setMember(target);
      setEvents(eventsRes);
      setCommittees(committeesRes);
    };
    fetchAll();
  }, [memberId, relationship]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      memberId,
      relationship,
      ...formData,
      eventId: formData.eventId || null,
      committeeId: formData.committeeId || null
    };

    await api.post('/api/volunteer-hours', payload);
    navigate('/volunteer-hours');
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex-1 p-6 space-y-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {sidebarOpen ? <ArrowLeftIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        <main className="flex-1 max-w-3xl mx-auto px-6 py-10">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit Volunteer Hours</h1>

            {member ? (
              <div className="space-y-6">
                <div className="text-lg font-medium text-gray-700">{member.name} <span className="text-sm text-gray-500">({member.relationship})</span></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date of Volunteering</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start Time of Volunteering</label>
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
                  </div>
                  <input type="number" name="hours" placeholder="Number of Hours" value={formData.hours} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

                  <select name="eventId" value={formData.eventId} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
                    <option value="">-- Select Event (optional) --</option>
                    {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                  </select>

                  <select name="committeeId" value={formData.committeeId} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
                    <option value="">-- Select Committee --</option>
                    {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description of work..."
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />

                <button
                  onClick={handleSubmit}
                  className="h-10 px-6 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
                >
                  Submit Hours
                </button>
              </div>
            ) : (
              <p className="text-gray-600">Loading member info...</p>
            )}
          </div>
        </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddVolunteerHours;
