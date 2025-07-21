import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(null);
    const API_BASE = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        axios.get(`${API_BASE}/api/events/get/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setEventData(res.data))
            .catch(err => console.error("Failed to fetch event", err));
    }, [id]);

    const [membershipTypes, setMembershipTypes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        axios.get(`${API_BASE}/api/memberships/available`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setMembershipTypes(res.data))
            .catch(err => console.error("Failed to load membership types", err));
    }, []);

    const updatePricingField = (index, field, value) => {
        const newPricing = [...eventData.pricing];
        newPricing[index][field] = value;
        setEventData((prev) => ({ ...prev, pricing: newPricing }));
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwtToken");

        axios.put(`${API_BASE}/api/events/update/${id}`, eventData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => navigate('/admin/manage-events'))
            .catch(err => console.error("Failed to update event", err));
    };


    const addPricingBlock = () => {
        setEventData((prev) => ({
            ...prev,
            pricing: [
                ...prev.pricing,
                {
                    membershipTier: '',
                    basePrice: '',
                    includedGuests: '',
                    additionalGuestPrice: '',
                    maxGuests: ''
                }
            ]
        }));
    };

    const removePricingBlock = (idx) => {
        setEventData((prev) => ({
            ...prev,
            pricing: prev.pricing.filter((_, i) => i !== idx)
        }));
    };

    const updateOfferingField = (index, field, value) => {
        const newOfferings = [...eventData.offerings];
        newOfferings[index][field] = value;
        setEventData((prev) => ({ ...prev, offerings: newOfferings }));
    };

    const addOffering = () => {
        setEventData((prev) => ({
            ...prev,
            offerings: [...(prev.offerings || []), { name: '', description: '', price: '', maxQuantity: '' }]
        }));
    };

    const removeOffering = (index) => {
        setEventData((prev) => ({
            ...prev,
            offerings: prev.offerings.filter((_, i) => i !== index)
        }));
    };


    if (!eventData) return <div className="text-center py-20">Loading event...</div>;

    return (
        <>
            <Navbar />
            <div className="flex">
                <AdminSidebar isOpen={true} />
                <main className="flex-1 flex flex-col items-center px-4 lg:px-20 py-6">
                    <div className="w-full max-w-xl bg-white rounded-xl shadow p-4">
                        <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input name="title" value={eventData.title} onChange={handleFormChange} className="form-input border px-4 py-2 rounded-lg" placeholder="Event Title" />
                            <textarea name="description" value={eventData.description} onChange={handleFormChange} className="form-input border px-4 py-2 rounded-lg" placeholder="Event Description" />
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input name="date" type="date" value={eventData.date} onChange={handleFormChange} className="form-input border px-4 py-2 rounded-lg flex-1" />
                                <input name="time" type="time" value={eventData.time} onChange={handleFormChange} className="form-input border px-4 py-2 rounded-lg flex-1" />
                            </div>
                            <input name="location" value={eventData.location} onChange={handleFormChange} className="form-input border px-4 py-2 rounded-lg" placeholder="Location" />
                            <input name="capacity" type="number" value={eventData.capacity} onChange={handleFormChange} className="form-input border px-4 py-2 rounded-lg" placeholder="Capacity" />

                            <h3 className="text-lg font-bold pt-2">Pricing</h3>
                            {eventData.pricing.map((tier, idx) => (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#dbe0e6] rounded-lg p-4 mb-4">
                                    <select
                                        name="membershipTier"
                                        value={tier.membershipTier}
                                        onChange={(e) => updatePricingField(idx, 'membershipTier', e.target.value)}
                                        className="form-input mt-2 w-full rounded-lg border border-[#dbe0e6] h-12 px-4"
                                    >
                                        <option value="">Select</option>
                                        {membershipTypes.map((type, i) => (
                                            <option key={i} value={type.name}>{type.name}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        value={tier.basePrice}
                                        onChange={(e) => updatePricingField(idx, 'basePrice', e.target.value)}
                                        className="form-input border px-4 py-2 rounded-lg"
                                        placeholder="Base Price"
                                    />
                                    <input
                                        type="number"
                                        value={tier.includedGuests}
                                        onChange={(e) => updatePricingField(idx, 'includedGuests', e.target.value)}
                                        className="form-input border px-4 py-2 rounded-lg"
                                        placeholder="Included Guests"
                                    />
                                    <input
                                        type="number"
                                        value={tier.additionalGuestPrice}
                                        onChange={(e) => updatePricingField(idx, 'additionalGuestPrice', e.target.value)}
                                        className="form-input border px-4 py-2 rounded-lg"
                                        placeholder="Additional Guest Price"
                                    />
                                    <input
                                        type="number"
                                        value={tier.maxGuests || ''}
                                        onChange={(e) => updatePricingField(idx, 'maxGuests', e.target.value)}
                                        className="form-input border px-4 py-2 rounded-lg"
                                        placeholder="Max Guests"
                                    />
                                    <button
                                        type="button"
                                        className="text-sm text-red-600 font-medium mt-2"
                                        onClick={() => removePricingBlock(idx)}
                                    >
                                        Remove Tier
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addPricingBlock} className="text-sm text-blue-600 font-semibold">
                                + Add Membership Tier
                            </button>

                            <h3 className="text-lg font-bold pt-2">Event Offerings</h3>
                            {(eventData.offerings || []).map((offering, idx) => (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#dbe0e6] rounded-lg p-4 mb-4">
                                    <input
                                        type="text"
                                        value={offering.name}
                                        onChange={(e) => updateOfferingField(idx, 'name', e.target.value)}
                                        className="form-input border px-4 py-2 rounded-lg"
                                        placeholder="Offering Name"
                                    />
                                    <input
                                        type="number"
                                        value={offering.price}
                                        onChange={(e) => updateOfferingField(idx, 'price', e.target.value)}
                                        className="form-input border px-4 py-2 rounded-lg"
                                        placeholder="Price"
                                    />
                                    <textarea
                                        value={offering.description}
                                        onChange={(e) => updateOfferingField(idx, 'description', e.target.value)}
                                        className="form-input border px-4 py-2 rounded-lg sm:col-span-2"
                                        placeholder="Offering Description"
                                    />
                                    <input
                                        type="number"
                                        value={offering.maxQuantity}
                                        onChange={(e) => updateOfferingField(idx, 'maxQuantity', e.target.value)}
                                        className="form-input border px-4 py-2 rounded-lg"
                                        placeholder="Max Quantity"
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
                                className="text-sm text-blue-600 font-semibold"
                            >
                                + Add Event Offering
                            </button>

                            <label className="mt-4">
                                <div className="flex justify-between">
                                    <span className="font-medium">Enable Waitlist</span>
                                    <input type="checkbox" name="waitlist" checked={eventData.waitlist} onChange={handleFormChange} />
                                </div>
                            </label>

                            <label>
                                <span className="font-medium">Registration Deadline</span>
                                <input
                                    name="registrationDeadline"
                                    type="date"
                                    value={eventData.registrationDeadline}
                                    onChange={handleFormChange}
                                    className="form-input border px-4 py-2 rounded-lg"
                                />
                            </label>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/manage-events')}
                                    className="rounded-full h-10 px-6 bg-gray-300 text-[#111418] text-sm font-medium"
                                >
                                    Back
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
                                >
                                    Save Changes
                                </button>
                            </div>

                        </form>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
