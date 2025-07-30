import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [family, setFamily] = useState([]);
  const [membership, setMembership] = useState('');
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [guests, setGuests] = useState([{ name: '', age: '' }]);
  const [offerings, setOfferings] = useState([]);
  const [zelleConfirmation, setZelleConfirmation] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formError, setFormError] = useState('');


  useEffect(() => {
    api.get(`/api/events/get/${id}`).then(data => {
      console.log("Raw offerings from backend:", data.offerings); // 👈
      setEvent(data);
      setOfferings(data.offerings?.map(o => ({ ...o, selectedQuantity: 0 })) || []);
    });


    Promise.all([
      api.get('/api/family/primary'),
      api.get('/api/family/spouse'),
      api.get('/api/family/current_members'),
      api.get('/api/memberships/current')
    ]).then(([primaryRes, spouseRes, childrenRes, membershipRes]) => {
      const primary = primaryRes?.id ? {
        id: primaryRes.id,
        name: `${primaryRes.firstName} ${primaryRes.lastName}`.trim(),
        relation: 'Primary'
      } : null;
      const spouse = spouseRes?.id ? {
        id: spouseRes.id,
        name: `${spouseRes.firstName} ${spouseRes.lastName}`.trim(),
        relation: 'Spouse'
      } : null;
      const children = childrenRes.map(c => ({
        id: c.id,
        name: c.name,
        relation: c.relation
      }));
      //const combined = //spouse ? [spouse, ...children] : [...children];
      const combined = [primary, ...(spouse ? [spouse] : []), ...children];
      setFamily(combined);
      setMembership(membershipRes);
    });
  }, [id]);

  const handleGuestChange = (index, field, value) => {
    const updated = [...guests];
    updated[index][field] = value;
    setGuests(updated);
  };

  const addGuest = () => setGuests([...guests, { name: '', age: '' }]);
  const removeGuest = (i) => setGuests(guests.filter((_, idx) => idx !== i));

  const calculateFee = () => {
    if (!event || !membership || !event.pricing) return 0;
    const pricing = event.pricing.find(
      (p) => p.membershipTier === membership.membershipName
    );

    if (!pricing) return 0;

    const included = pricing.includedGuests;
    const totalPeople = selectedFamily.length + guests.length;
    const additionalGuests = Math.max(0, totalPeople - included);
    const guestCost = additionalGuests * pricing.additionalGuestPrice;


    const offeringCost = offerings.reduce(
      (sum, o) => sum + (o.selectedQuantity || 0) * o.price,
      0
    );

    return pricing.basePrice + guestCost + offeringCost;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedGuests = guests.filter(g => g.name && g.age);
    const totalAttendees = selectedFamily.length + selectedGuests.length;

    if (selectedFamily.length === 0) {
      setFormError('Please select at least one family member to register.');
      return;
    }
    setFormError('');

    const payload = {
      eventId: event.id,
      familyMembers: family
        .filter(member => selectedFamily.includes(member.id))
        .map(member => ({
          id: member.id,
          relation: member.relation
        })),
        guests: guests.filter(g => g.name && g.age).map(g => ({
          name: g.name,
          age: g.age,
          relation: 'Guest'
        })),      
      zelleConfirmation,
      totalAmount: calculateFee(), // ✅ this line
      offerings: offerings.filter(o => o.selectedQuantity > 0).map(o => ({ id: o.id, quantity: o.selectedQuantity }))
    };
    console.log(payload);
    try {
      await api.post('/api/event-registrations', payload);
      navigate('/user-events');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  if (!event || family.length === 0) return <p>Loading...</p>;

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
          <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-2">Register for {event.title}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="font-semibold">Select Family Members</h2>
                {family.map(member => (
                  <label key={member.id} className="block">
                    <input
                      type="checkbox"
                      checked={selectedFamily.includes(member.id)}
                      onChange={() => {
                        setSelectedFamily(prev => prev.includes(member.id)
                          ? prev.filter(id => id !== member.id)
                          : [...prev, member.id]);
                      }}
                    />{' '}{member.name} ({member.relation})
                  </label>
                ))}
              </div>

              <div>
                <h2 className="font-semibold">Add Guests</h2>
                {guests.map((g, i) => (
                  <div key={`${g.name}-${i}`} className="flex gap-2 items-center mb-2">
                  <input
                      type="text"
                      value={g.name}
                      placeholder="Guest Name"
                      onChange={e => handleGuestChange(i, 'name', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="number"
                      value={g.age}
                      placeholder="Age"
                      onChange={e => handleGuestChange(i, 'age', e.target.value)}
                      className="border rounded px-2 py-1 w-20"
                    />
                    <button type="button" onClick={() => removeGuest(i)} className="text-red-600">x</button>
                  </div>
                ))}
                <button type="button" onClick={addGuest} className="text-sm text-blue-700">+ Add Guest</button>
              </div>

              <div>
                <h2 className="font-semibold">Optional Offerings</h2>
                {offerings.map((o, i) => (
                  <div key={o.id} className="flex justify-between items-center mb-2">
                    <span>{o.name} (${o.price})</span>
                    <input
                      type="number"
                      min={0}
                      max={o.maxQuantity}
                      value={o.selectedQuantity}
                      onChange={e => {
                        const updated = [...offerings];
                        updated[i].selectedQuantity = parseInt(e.target.value || '0');
                        setOfferings(updated);
                      }}
                      className="w-16 border rounded px-2 py-1"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold">Zelle Confirmation #</label>
                <input
                  type="text"
                  value={zelleConfirmation}
                  onChange={e => setZelleConfirmation(e.target.value)}
                  required
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              {event && membership && (
                <div className="p-3 rounded border bg-gray-50">
                  <h3 className="font-semibold text-sm mb-1">Fee Breakdown</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      Base Price for <strong>{membership.membershipName}</strong>: $
                      {event.pricing.find(p => p.membershipTier === membership.membershipName)?.basePrice ?? 0}
                    </li>
                    <li>
                      Extra Guests: {Math.max(0, selectedFamily.length + guests.length - (event.pricing.find(p => p.membershipTier === membership?.membershipName)?.includedGuests || 0))} × $
                      {event.pricing.find(p => p.membershipTier === membership?.membershipName)?.additionalGuestPrice ?? 0}
                    </li>
                    <li>
                      Offerings Total: $
                      {offerings.reduce((sum, o) => sum + (o.selectedQuantity || 0) * o.price, 0)}
                    </li>
                  </ul>
                  <div className="font-bold mt-2">Total: ${calculateFee()}</div>
                </div>
              )}



              <div className="font-bold">Total: ${calculateFee()}</div>

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Registration</button>
            </form>
            {formError && (
              <div className="text-red-600 font-semibold bg-red-100 border border-red-300 p-2 rounded mb-4">
                {formError}
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );

}
