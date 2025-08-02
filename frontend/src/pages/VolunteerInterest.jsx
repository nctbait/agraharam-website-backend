import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import api from '../api/authAxios';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function VolunteerInterest() {
    const [family, setFamily] = useState([]);
    const [events, setEvents] = useState([]);
    const [committees, setCommittees] = useState([]);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const makeKey = (id, relationship) => `${id}-${relationship}`;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            const [primaryRes, spouseRes, childrenRes, evRes, comRes, interestRes] = await Promise.all([
                api.get('/api/family/primary'),
                api.get('/api/family/spouse'),
                api.get('/api/family/current_members'),
                api.get('/api/events/upcoming'),
                api.get('/api/committees/active'),
                api.get('/api/volunteer-interest/family')
            ]);

            const primary = primaryRes;
            const spouse = spouseRes;
            const children = childrenRes;
            const familyList = [];

            if (primary?.id && primary?.firstName) {
                familyList.push({ id: primary.id, name: primary.firstName + ' ' + primary.lastName, relationship: 'Primary' });
            }

            if (spouse?.id && spouse?.firstName) {
                familyList.push({ id: spouse.id, name: spouse.firstName + ' ' + spouse.lastName, relationship: 'Spouse' });
            }

            if (Array.isArray(children)) {
                children.forEach(c => {
                    familyList.push({
                        id: c.id,
                        name: c.name,
                        relationship: c.relation
                    });
                });
            }

            setFamily(familyList);
            setEvents(evRes || []);
            setCommittees(comRes || []);

            // Initialize formData for each member
            const initialData = {};
            familyList.forEach(member => {
                const saved = interestRes.find(i =>
                    i.memberId === member.id && i.relationship === member.relationship
                );

                initialData[makeKey(member.id, member.relationship)] = {
                    events: saved?.events || [],
                    committees: saved?.committees || []
                };

            });

            setFormData(initialData);

        };
        fetchAll();
    }, []);

    const toggleCommittee = (memberKey, committeeId) => {
        setFormData(prev => {
            const current = prev[memberKey] || { committees: [] };
            const updated = current.committees.includes(committeeId)
                ? current.committees.filter(c => c !== committeeId)
                : [...current.committees, committeeId];
            return { ...prev, [memberKey]: { ...current, committees: updated } };
        });
    };

    const toggleEvent = (memberKey, eventId) => {
        setFormData(prev => {
            const current = prev[memberKey] || { events: [], committees: [] };
            const updated = current.events.includes(eventId)
                ? current.events.filter(id => id !== eventId)
                : [...current.events, eventId];
            return { ...prev, [memberKey]: { ...current, events: updated } };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = family
            .filter(m => {
                const key = makeKey(m.id, m.relationship);
                const data = formData[key];
                return data?.committees?.length > 0 || data?.events?.length > 0;
            })
            .map(m => {
                const key = makeKey(m.id, m.relationship);
                return {
                    memberId: m.id,
                    relationship: m.relationship,
                    events: formData[key].events || [],
                    committees: formData[key].committees || []
                };
            });


        if (payload.length === 0) {
            setMessage('Please select at least one interest before submitting.');
            return;
        }

        try {
            await api.post('/api/volunteer-interest', payload);
            setMessage('Thank you! Your volunteer interests have been submitted.');
        } catch (err) {
            console.error('Error submitting interest:', err);
            setMessage('Something went wrong. Please try again later.');
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
                    <main className="flex-1 max-w-4xl mx-auto p-6 my-6 bg-white rounded-xl shadow space-y-6">
                        <h2 className="text-2xl font-bold">Volunteer Interest</h2>

                        {message && (
                            <div className="text-blue-600 font-medium">{message}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {family.map(member => (
                                <div key={member.id} className="border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {member.name} <span className="text-sm text-gray-500">({member.relationship})</span>
                                    </h3>

                                    {/* Event selection */}
                                    {/* Events (multiple) */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Events</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                            {events.map(event => (
                                                <label
                                                    key={event.id}
                                                    className="flex items-center space-x-2 border border-gray-200 rounded px-2 py-1"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4"
                                                        checked={
                                                            formData[makeKey(member.id, member.relationship)]?.events?.includes(event.id) || false
                                                        }
                                                        onChange={() => toggleEvent(makeKey(member.id, member.relationship), event.id)}
                                                    />
                                                    <span className="text-sm">{event.title}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>


                                    {/* Committees */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Committees</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                            {committees.map(c => (
                                                <label key={c.id} className="flex items-center space-x-2 border border-gray-200 rounded px-2 py-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData[makeKey(member.id, member.relationship)]?.committees?.includes(c.id) || false}
                                                        onChange={() => toggleCommittee(makeKey(member.id, member.relationship), c.id)}
                                                        className="form-checkbox h-4 w-4"
                                                    />
                                                    <span className="text-sm">{c.name}</span>
                                                </label>
                                            ))}

                                        </div>

                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 h-10 rounded bg-blue-600 text-white font-semibold"
                                >
                                    Submit Interest
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
