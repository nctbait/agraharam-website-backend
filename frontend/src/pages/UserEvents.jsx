import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../api/authAxios';

export default function UserEvents() {
  const [availableEvents, setAvailableEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelRegistrationId, setCancelRegistrationId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const navigate = useNavigate();

  const handleEventReg = (eventId) => {
    navigate(`/event-registration/${eventId}`);
  };

  const fetchAvailable = async () => {
    const res = await api.get('/api/event-registrations/available');
    setAvailableEvents(res || []);
  };

  const fetchRegistered = async () => {
    const res = await api.get('/api/event-registrations/my');
    setRegisteredEvents(res || []);
  };

  const fetchHistory = async () => {
    const res = await api.get('/api/event-registrations/history');
    setAttendedEvents(res || []);
  };

  useEffect(() => {
    // load all sections
    Promise.all([fetchAvailable(), fetchRegistered(), fetchHistory()]).catch(console.error);
  }, []);

  // open modal to ask for reason
  const openCancelModal = (registrationId) => {
    setCancelRegistrationId(registrationId);
    setCancelReason('');
    setCancelError('');
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setCancelRegistrationId(null);
    setCancelReason('');
    setCancelError('');
  };

  const confirmCancel = async () => {
    if (!cancelRegistrationId) return;
    try {
      setCancelLoading(true);
      setCancelError('');

      // Backend expects optional body: { reason: string }
      await api.delete(`/api/event-registrations/${cancelRegistrationId}`, {
        data: cancelReason ? { reason: cancelReason } : {}, // body is optional
      });

      // Optimistically remove from registered list
      setRegisteredEvents((prev) =>
        prev.filter((e) => e.registrationId !== cancelRegistrationId)
      );

      // Refresh lists so if the event date hasn't passed, it shows in Available
      await fetchAvailable();

      closeCancelModal();
    } catch (err) {
      console.error('Cancel failed:', err);
      setCancelError('Cancellation failed. Please try again.');
    } finally {
      setCancelLoading(false);
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

          <h1 className="text-2xl font-bold mb-6">Events</h1>

          {/* Available */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Available Events</h2>
            <div className="flex flex-col gap-4">
              {Array.isArray(availableEvents) && availableEvents.map((event) => (
                <div key={event.id} className="rounded-xl p-4 border border-gray-300 bg-white shadow-sm">
                  <p className="text-base font-bold">{event.title || event.eventName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date || event.dateTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700">{event.venue}</p>
                  <button
                    onClick={() => handleEventReg(event.id)}
                    className="mt-2 rounded-full bg-blue-500 px-4 py-2 text-white text-sm"
                  >
                    Register
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Registered */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Registered Events</h2>
            <div className="flex flex-col gap-4">
              {Array.isArray(registeredEvents) && registeredEvents.map((event) => (
                <div
                  key={event.registrationId}
                  className="rounded-xl p-4 border border-blue-200 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-base font-bold text-blue-800">{event.eventName}</p>
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-800 mt-1">
                        <strong>Members:</strong>{' '}
                        {Array.isArray(event.registeredNames) ? event.registeredNames.join(', ') : 'None'}
                      </p>
                      <p className="text-sm text-gray-800">
                        <strong>Guests:</strong> {Array.isArray(event.guestNames) && event.guestNames.length ? event.guestNames.join(', ') : 'None'}
                      </p>
                      <p className="text-sm mt-1">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            event.status === 'CANCELLED'
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
                        onClick={() => openCancelModal(event.registrationId)}
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

          {/* Attended */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Events Attended</h2>
            <div className="flex flex-col gap-4">
              {Array.isArray(attendedEvents) && attendedEvents.map((event) => (
                <div key={event.id} className="rounded-xl p-4 border border-gray-300 bg-white shadow-sm">
                  <p className="text-base font-bold">{event.title}</p>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700">{event.venue}</p>
                  <p className="text-sm font-medium text-gray-800">Fee: ${event.fee ?? 'Free'}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Cancel Registration</h3>
            <p className="text-sm text-gray-600 mb-3">
              (Optional) Please tell us why you’re cancelling. This helps us improve future events.
            </p>
            <textarea
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              rows={4}
              placeholder="Reason for cancellation (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            {cancelError && <p className="text-sm text-red-600 mt-2">{cancelError}</p>}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={closeCancelModal}
                className="rounded-full px-4 py-2 text-sm font-semibold bg-gray-100"
                disabled={cancelLoading}
              >
                Close
              </button>
              <button
                onClick={confirmCancel}
                className="rounded-full px-4 py-2 text-sm font-semibold bg-red-600 text-white disabled:opacity-60"
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Cancelling…' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
