import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/authAxios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditEventRegistration() {
  const { registrationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [family, setFamily] = useState([]);
  const [membership, setMembership] = useState('');
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [guests, setGuests] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [zelleConfirmation, setZelleConfirmation] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    async function fetchData() {
      const regData = await api.get(`/api/event-registrations/${registrationId}`);
      const eventData = await api.get(`/api/events/get/${regData.eventId}`);
      const membershipRes = await api.get('/api/memberships/current');

      const [primary, spouse, children] = await Promise.all([
        api.get('/api/family/primary'),
        api.get('/api/family/spouse'),
        api.get('/api/family/current_members')
      ]);

      const familyList = [
        { ...primary, relation: 'Primary' },
        { ...spouse, relation: 'Spouse' },
        ...children.map(c => ({ ...c, relation: c.relation }))
      ];

      setEvent(eventData);
      setMembership(membershipRes.membershipName);
      setZelleConfirmation(regData.zelleConfirmation);
      setSelectedFamily(regData.familyMembers.map(f => f.id));
      setGuests(regData.guests);

      const updatedOfferings = eventData.offerings.map(o => {
        const match = regData.offerings.find(ro => ro.id === o.id);
        return { ...o, selectedQuantity: match ? match.quantity : 0 };
      });

      setOfferings(updatedOfferings);
      setFamily(familyList);
      setLoading(false);
    }
    fetchData();
  }, [registrationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      eventId: event.id,
      familyMembers: family
        .filter(m => selectedFamily.includes(m.id))
        .map(m => ({ id: m.id, relation: m.relation })),
      guests: guests.map(g => ({ name: g.name, age: g.age, relation: 'Guest' })),
      offerings: offerings.filter(o => o.selectedQuantity > 0).map(o => ({ id: o.id, quantity: o.selectedQuantity })),
      zelleConfirmation,
      totalAmount: calculateFee()
    };

    try {
      await api.put(`/api/event-registrations/${registrationId}`, payload);
      navigate('/user-events');
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleGuestChange = (index, field, value) => {
    const updated = [...guests];
    updated[index][field] = value;
    setGuests(updated);
  };

  const addGuest = () => setGuests([...guests, { name: '', age: '' }]);
  const removeGuest = (i) => setGuests(guests.filter((_, idx) => idx !== i));

  const calculateFee = () => {
    if (!event || !membership) return 0;
    const pricing = event.pricing.find(p => p.membershipTier === membership);
    if (!pricing) return 0;

    const totalAttendees = selectedFamily.length + guests.length;
    const included = pricing.includedGuests;
    const extraGuests = Math.max(0, totalAttendees - included);
    const guestFee = extraGuests * pricing.additionalGuestPrice;
    const offeringFee = offerings.reduce((sum, o) => sum + (o.selectedQuantity || 0) * o.price, 0);

    return pricing.basePrice + guestFee + offeringFee;
  };

  if (loading) return <p>Loading...</p>;

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
            <h1 className="text-xl font-bold mb-2">Edit Event Registration for {event.title}</h1>
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
