import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../api/authAxios';


export default function UserEvents() {

    const [availableEvents, setAvailableEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const handleEventReg = (eventId) => {
        navigate(`/event-registration/${eventId}`);
    };
    useEffect(() => {
        api.get('/api/event-registrations/available')
            .then(res => {
                console.log('Available:',res); // ✅ confirm this prints your array
                setAvailableEvents(res)
            })
            .catch(console.error);

        api.get('/api/event-registrations/my')
            .then(res => {
                console.log('My Registrations:', res); // ✅ confirm this prints your array
                setRegisteredEvents(res)
            })
            .catch(console.error);

        api.get('/api/event-registrations/history')
            .then(res => setAttendedEvents(res))
            .catch(console.error);
    }, []);

    const handleCancel = async (registrationId) => {
        try {
            await api.delete(`/api/event-registrations/${registrationId}`);
            setRegisteredEvents(registeredEvents.filter(e => e.registrationId !== registrationId));
        } catch (err) {
            console.error('Cancel failed:', err);
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

                    <h1 className="text-2xl font-bold mb-6">Events</h1>

                    <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Available Events</h2>
                        <div className="flex flex-col gap-4">
                            {Array.isArray(availableEvents) && availableEvents.map(event => (
                                <div key={event.id} className="rounded-xl p-4 border border-gray-300 bg-white shadow-sm">
                                    <p className="text-base font-bold">{event.title || event.eventName}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(event.date || event.dateTime).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-700">{event.venue}</p>
                                    <p className="text-sm font-medium text-green-700">${event.fee ?? 'Free'}</p>
                                    <button
                                        onClick={() => navigate(`/event-registration/${event.id}`)}
                                        className="mt-2 rounded-full bg-blue-500 px-4 py-2 text-white text-sm"
                                    >
                                        Register
                                    </button>
                                </div>
                            ))}

                        </div>
                    </section>


                    <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Registered Events</h2>
                        <div className="flex flex-col gap-4">
                            {Array.isArray(registeredEvents) && registeredEvents.map(event => (
                                <div
                                    key={event.registrationId}
                                    className="rounded-xl p-4 border border-blue-200 bg-white shadow-sm"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-base font-bold text-blue-800">
                                                {event.eventName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(event.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-800 mt-1">
                                            <strong>Members:</strong> {Array.isArray(event.familyMemberNames) ? event.familyMemberNames.join(', ') : 'None'}

                                            </p>
                                            <p className="text-sm text-gray-800">
                                                <strong>Guests:</strong> {event.guestNames.join(', ') || 'None'}
                                            </p>
                                            <p className="text-sm mt-1">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${event.status === 'CANCELLED'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-green-100 text-green-700'
                                                        }`}
                                                >
                                                    {event.status}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <button
                                                onClick={() => navigate(`/event-registration/edit/${event.registrationId}`)}
                                                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleCancel(event.registrationId)}
                                                className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Events Attended</h2>
                        <div className="flex flex-col gap-4">
                            {Array.isArray(attendedEvents) && attendedEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="rounded-xl p-4 border border-gray-300 bg-white shadow-sm"
                                >
                                    <p className="text-base font-bold">{event.title}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-700">{event.venue}</p>
                                    <p className="text-sm font-medium text-gray-800">
                                        Fee: ${event.fee ?? 'Free'}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}
