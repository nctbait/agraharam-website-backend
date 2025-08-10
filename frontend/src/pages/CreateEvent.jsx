import React, { useEffect,useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    locationUrl: '',
    capacity: '',
    pricing: [],
    offerings: [],
    waitlist: false,
    registrationDeadline: ''
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [membershipTypes, setMembershipTypes] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    axios.get(`${API_BASE}/api/memberships/available`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMembershipTypes(res.data))
      .catch(err => console.error("Failed to load membership types", err));
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    axios.post(`${API_BASE}/api/events/create`, form, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setSuccessMessage("Event updated successfully!");
        setTimeout(() => navigate('/admin/manage-events'), 3000);
      })
      .catch(err => console.error("Failed to create event", err));

  };

  const updateTier = (idx, key, value) => {
    const updated = [...form.pricing];
    updated[idx][key] = value;
    setForm((prev) => ({ ...prev, pricing: updated }));
  };

  const addTier = () => {
    setForm((prev) => ({
      ...prev,
      pricing: [
        ...prev.pricing,
        { membershipTier: '', basePrice: '', includedGuests: '', additionalGuestPrice: '', maxGuests: '' }
      ]
    }));
  };

  const removeTier = (idx) => {
    setForm((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== idx)
    }));
  };

  const addOffering = () => {
    setForm((prev) => ({
      ...prev,
      offerings: [...prev.offerings, { name: '', description: '', price: '', maxQuantity: '' }]
    }));
  };

  const updateOffering = (idx, key, value) => {
    const updated = [...form.offerings];
    updated[idx][key] = value;
    setForm((prev) => ({ ...prev, offerings: updated }));
  };

  const removeOffering = (idx) => {
    setForm((prev) => ({
      ...prev,
      offerings: prev.offerings.filter((_, i) => i !== idx)
    }));
  };


  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 flex flex-col items-center px-4 lg:px-20 py-6">
          <div className="w-full max-w-xl bg-white rounded-xl shadow p-4">
            <div className="mb-4">
              <h1 className="text-[#111418] text-2xl font-bold">Create New Event</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter event title"
                className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
              />


              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter event description"
                className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] min-h-24 px-4"
              />
              <div className="flex gap-2 flex-col sm:flex-row">
                <label className="flex-1">
                  <span className="text-[#111418] text-base font-medium">Date</span>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
                  />
                </label>
                <label className="flex-1">
                  <span className="text-[#111418] text-base font-medium">Time</span>
                  <input
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                    className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
                  />
                </label>
              </div>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter event location"
                className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
              />
              <input
                name="locationUrl"
                value={form.locationUrl}
                onChange={handleChange}
                placeholder="Enter event location URL"
                className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
              />

              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                placeholder="Enter event capacity"
                className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
              />

              <h3 className="text-[#111418] text-lg font-bold pt-2">Pricing</h3>
              {form.pricing.map((tier, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#dbe0e6] rounded-lg p-4 mb-4">
                  <label>
                    <span className="text-base font-medium">Membership Tier</span>
                    <select
                      name="membershipTier"
                      value={tier.membershipTier}
                      onChange={(e) => updateTier(idx, 'membershipTier', e.target.value)}
                      className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
                    >
                      <option value="">Select</option>
                      {membershipTypes.map((type, i) => (
                        <option key={i} value={type.name}>{type.name}</option>
                      ))}
                    </select>

                  </label>
                  <label>
                    <span className="text-base font-medium">Base Price</span>
                    <input
                      type="number"
                      value={tier.basePrice}
                      onChange={(e) => updateTier(idx, 'basePrice', e.target.value)}
                      className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
                    />
                  </label>
                  <label>
                    <span className="text-base font-medium">Included Guests</span>
                    <input
                      type="number"
                      value={tier.includedGuests}
                      onChange={(e) => updateTier(idx, 'includedGuests', e.target.value)}
                      className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
                    />
                  </label>
                  <label>
                    <span className="text-base font-medium">Additional Guest Price</span>
                    <input
                      type="number"
                      value={tier.additionalGuestPrice}
                      onChange={(e) => updateTier(idx, 'additionalGuestPrice', e.target.value)}
                      className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="text-base font-medium">Max Guests (optional)</span>
                    <input
                      type="number"
                      value={tier.maxGuests}
                      onChange={(e) => updateTier(idx, 'maxGuests', e.target.value)}
                      className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
                    />
                  </label>
                  <button
                    type="button"
                    className="text-sm text-red-600 font-medium mt-2"
                    onClick={() => removeTier(idx)}
                  >
                    Remove Tier
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTier}
                className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
              >
                Add Membership Tier
              </button>

              <h3 className="text-[#111418] text-lg font-bold pt-2">Offerings</h3>
              {form.offerings.map((offering, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#dbe0e6] rounded-lg p-4 mb-4">
                  <input
                    type="text"
                    placeholder="Offering Name"
                    value={offering.name}
                    onChange={(e) => updateOffering(idx, 'name', e.target.value)}
                    className="form-input border px-4 py-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={offering.description}
                    onChange={(e) => updateOffering(idx, 'description', e.target.value)}
                    className="form-input border px-4 py-2 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={offering.price}
                    onChange={(e) => updateOffering(idx, 'price', e.target.value)}
                    className="form-input border px-4 py-2 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max Quantity"
                    value={offering.maxQuantity}
                    onChange={(e) => updateOffering(idx, 'maxQuantity', e.target.value)}
                    className="form-input border px-4 py-2 rounded-lg"
                  />
                  <button
                    type="button"
                    className="text-sm text-red-600 font-medium mt-2"
                    onClick={() => removeOffering(idx)}
                  >
                    Remove Offering
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOffering}
                className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
              >
                Add Offering
              </button>


              <h3 className="text-[#111418] text-lg font-bold pt-2">Additional Settings</h3>
              <div className="flex items-center justify-between bg-white px-0 min-h-[56px] py-2 rounded-lg border border-[#dbe0e6]">
                <div>
                  <span className="text-[#111418] text-base font-medium">Waitlist Management</span>
                  <p className="text-[#60748a] text-sm">Enable waitlist for this event</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-2">
                  <input
                    name="waitlist"
                    type="checkbox"
                    checked={form.waitlist}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#0c77f2]"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
                </label>
              </div>
              <label>
                <span className="text-[#111418] text-base font-medium">Registration Deadline</span>
                <input
                  name="registrationDeadline"
                  type="date"
                  value={form.registrationDeadline}
                  onChange={handleChange}
                  className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
                />
              </label>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold">
                  Create Event
                </button>
              </div>
            </form>
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                {successMessage}
              </div>
            )}

          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
