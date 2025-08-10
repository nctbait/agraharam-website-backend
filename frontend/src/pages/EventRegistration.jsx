import { useEffect, useMemo, useState } from 'react';
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
  const [membership, setMembership] = useState(null);

  const [selectedFamily, setSelectedFamily] = useState([]);
  const [guests, setGuests] = useState([]); // editable rows
  const [offerings, setOfferings] = useState([]); // [{ id, name, price, maxQuantity, selectedQuantity }]

  const [quote, setQuote] = useState(null); // server breakdown
  const [zelleConfirmation, setZelleConfirmation] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formError, setFormError] = useState('');

  // fetch event, membership, family
  useEffect(() => {
    api.get(`/api/events/get/${id}`).then(data => {
      setEvent(data);
      setOfferings((data.offerings || []).map(o => ({
        ...o,
        selectedQuantity: 0
      })));
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
      const kids = (childrenRes || []).map(c => ({
        id: c.id,
        name: c.name,
        relation: c.relation
      }));
      const combined = [primary, ...(spouse ? [spouse] : []), ...kids].filter(Boolean);
      setFamily(combined);
      setMembership(membershipRes);
    });
  }, [id]);

  // find the pricing row for this user's membership tier
  const tierPricing = useMemo(() => {
    if (!event || !membership) return null;
    return (event.pricing || []).find(p => p.membershipTier === membership.membershipName) || null;
  }, [event, membership]);

  // helpers
  const cleanedGuests = useMemo(
    () => guests.filter(g => (g.name?.trim() || '') && (g.age?.toString() || '').length),
    [guests]
  );
  const selectedOfferings = useMemo(
    () => offerings.filter(o => (o.selectedQuantity || 0) > 0).map(o => ({ id: o.id, quantity: o.selectedQuantity })),
    [offerings]
  );

  // enforce maxGuests (tier-based)
  const totalSelectedMembers = selectedFamily.length;
  //const currentGuestCount = cleanedGuests.length;
  const includedGuests = tierPricing?.includedGuests ?? 0;
  const maxGuests = tierPricing?.maxGuests ?? Number.MAX_SAFE_INTEGER;

  //const totalPeople = totalSelectedMembers + currentGuestCount;
  //const remainingGuestSlots = Math.max(0, maxGuests - totalSelectedMembers); // how many guest rows allowed given family selected

  const remainingGuestSlots = Math.max(0, maxGuests - totalSelectedMembers);
  const allowedGuestAdds = Math.max(0, remainingGuestSlots - cleanedGuests.length);
  const totalPeople = totalSelectedMembers + cleanedGuests.length;

  const addGuest = () => {
    if (allowedGuestAdds > 0) {
      setGuests(prev => [...prev, { name: '', age: '' }]);
    }
  };
  const removeGuest = (i) => setGuests(guests.filter((_, idx) => idx !== i));
  const handleGuestChange = (i, field, value) => {
    const next = [...guests];
    next[i] = { ...next[i], [field]: value };
    setGuests(next);
  };

  const handleToggleMember = (memberId) => {
    setSelectedFamily(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const handleOfferingQty = (idx, raw) => {
    const maxQ = offerings[idx].maxQuantity ?? Number.MAX_SAFE_INTEGER;
    let q = parseInt(raw || '0', 10);
    if (Number.isNaN(q) || q < 0) q = 0;
    if (q > maxQ) q = maxQ;
    const next = [...offerings];
    next[idx] = { ...next[idx], selectedQuantity: q };
    setOfferings(next);
  };

  // ask backend for the authoritative quote whenever inputs change
  useEffect(() => {
    if (!event || !membership) return;

    const controller = new AbortController();
    const payload = {
      eventId: event.id,
      membershipTier: membership.membershipName,
      familyMemberIds: selectedFamily,
      guests: cleanedGuests, // [{ name, age }]
      offerings: selectedOfferings // [{ id, quantity }]
    };

    // only call if at least 1 family member is selected
    if (selectedFamily.length > 0) {
      api.post('/api/event-registrations/quote', payload)
        .then(setQuote)
        .catch(() => setQuote(null));
    } else {
      setQuote(null);
    }

    return () => controller.abort();
  }, [event, membership, selectedFamily, cleanedGuests, selectedOfferings]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFamily.length === 0) {
      setFormError('Please select at least one family member to register.');
      return;
    }
    if (totalPeople > maxGuests) {
      setFormError(`You cannot register more than ${maxGuests} people (including family).`);
      return;
    }
    setFormError('');

    const payload = {
      eventId: event.id,
      familyMembers: family
        .filter(m => selectedFamily.includes(m.id))
        .map(m => ({ id: m.id, relation: m.relation })),
      guests: cleanedGuests.map(g => ({ name: g.name.trim(), age: parseInt(g.age, 10), relation: 'Guest' })),
      zelleConfirmation,
      offerings: selectedOfferings
    };

    try {
      await api.post('/api/event-registrations', payload);
      navigate('/user-events');
    } catch (err) {
      console.error('Registration failed', err);
      setFormError(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (!event || !membership || family.length === 0) return <p>Loading…</p>;

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

          <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow">
            <h1 className="text-xl font-bold mb-4">Register for {event.title}</h1>

            {/* Family selection */}
            <div className="mb-6">
              <h2 className="font-semibold mb-1">Select Family Members</h2>
              <p className="text-xs text-gray-500 mb-2">
                Membership tier: <strong>{membership.membershipName}</strong> · Included guests: {includedGuests} · Max guests: {maxGuests}
              </p>
              {family.map(m => (
                <label key={m.id} className="block">
                  <input
                    type="checkbox"
                    checked={selectedFamily.includes(m.id)}
                    onChange={() => handleToggleMember(m.id)}
                  />{' '}
                  {m.name} ({m.relation})
                </label>
              ))}
            </div>

            {/* Guests */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Add Guests</h2>
                <span className="text-xs text-gray-500">
                  Remaining guest slots: {allowedGuestAdds}
                </span>
              </div>
              {guests.map((g, i) => (
                <div key={i} className="flex gap-2 items-center mb-2">
                  <input
                    type="text"
                    value={g.name}
                    placeholder="Guest Name"
                    onChange={e => handleGuestChange(i, 'name', e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <input
                    type="number"
                    value={g.age}
                    placeholder="Age"
                    onChange={e => handleGuestChange(i, 'age', e.target.value)}
                    className="border rounded px-2 py-1 w-24"
                  />
                  <button type="button" onClick={() => removeGuest(i)} className="text-red-600 text-sm">Remove</button>
                </div>
              ))}
              <button
                type="button"
                onClick={addGuest}
                className={`text-sm ${allowedGuestAdds <= 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-700'}`}
                disabled={allowedGuestAdds <= 0}
              >
                + Add Guest
              </button>
              {totalPeople > maxGuests && (
                <div className="text-red-600 text-sm mt-1">
                  You’ve exceeded the maximum number of allowed attendees for your tier.
                </div>
              )}
            </div>

            {/* Offerings */}
            <div className="mb-6">
              <h2 className="font-semibold">Optional Offerings</h2>
              {(offerings || []).length === 0 && <div className="text-sm text-gray-500">No add-ons available.</div>}
              {offerings.map((o, i) => (
                <div key={o.id} className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-medium">{o.name}</div>
                    <div className="text-xs text-gray-500">
                      ${o.price} · Max: {o.maxQuantity ?? '—'}
                    </div>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={o.maxQuantity ?? undefined}
                    value={o.selectedQuantity}
                    onChange={e => handleOfferingQty(i, e.target.value)}
                    className="w-20 border rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>

            {/* Payment */}
            <div className="mb-6">
              <label className="block font-semibold">Zelle/PayPal Confirmation #</label>
              <input
                type="text"
                value={zelleConfirmation}
                onChange={e => setZelleConfirmation(e.target.value)}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            {/* Quote / breakdown */}
            <div className="p-3 rounded border bg-gray-50 mb-4">
              <h3 className="font-semibold text-sm mb-1">Fee Breakdown</h3>
              {!quote ? (
                <div className="text-sm text-gray-500">Select at least one family member to see the quote.</div>
              ) : (
                <>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Base Price: ${quote.basePrice?.toFixed(2)}</li>
                    <li>Included Guests: {quote.includedGuests}</li>
                    <li>Additional Guests: {quote.additionalGuestCount} × ${quote.additionalGuestPrice?.toFixed(2)} = ${quote.additionalGuestFee?.toFixed(2)}</li>
                    <li>Offerings Total: ${quote.offeringsTotal?.toFixed(2)}</li>
                  </ul>
                  <div className="font-bold mt-2">Total: ${quote.total?.toFixed(2)}</div>
                  {quote.message && <div className="text-xs text-gray-500 mt-1">{quote.message}</div>}
                </>
              )}
            </div>

            {formError && (
              <div className="text-red-600 font-semibold bg-red-100 border border-red-300 p-2 rounded mb-4">
                {formError}
              </div>
            )}

            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit Registration
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
