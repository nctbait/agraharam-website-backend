import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ManageEvents() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const API_BASE = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
      
        axios.get(`${API_BASE}/api/events/list`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => setEvents(res.data))
        .catch(err => console.error("Failed to fetch events", err));
      }, []);
      

    const handleEdit = (eventId) => {
        navigate(`/edit-event/${eventId}`);
    };
    const handleDelete = (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
      
        const token = localStorage.getItem("jwtToken");
      
        axios.delete(`${API_BASE}/api/events/delete/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => setEvents((prev) => prev.filter((e) => e.id !== eventId)))
        .catch(err => console.error("Failed to delete event", err));
      };
      

    return (
        <>
            <Navbar />
            <div className="flex">
                <AdminSidebar isOpen={true} />
                <main className="flex-1 px-4 lg:px-20 py-6">
                    <h1 className="text-2xl font-bold mb-6">Manage Events</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow border border-[#dbe0e6] p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h2 className="text-xl font-semibold text-[#111418]">{event.title}</h2>
                                <p className="text-sm text-[#60748a]">{event.date} @ {event.time}</p>
                                <p className="text-sm text-[#60748a] mt-1">{event.location}</p>
                                <p className="text-sm mt-2 text-[#111418] font-medium">Capacity: {event.capacity}</p>
                          
                                {/* Pricing Section */}
                                <div className="mt-2">
                                  <h4 className="text-sm font-semibold mb-1">Pricing:</h4>
                                  <ul className="text-sm text-[#111418] list-disc pl-5 space-y-1">
                                    {event.pricing.map((p, idx) => (
                                      <li key={idx}>
                                        {p.membershipTier}: ${p.basePrice} (includes {p.includedGuests} guests, extra: ${p.additionalGuestPrice}/guest)
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                          
                                {/* Offerings Section */}
                                {event.offerings && event.offerings.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-semibold mb-1">Offerings:</h4>
                                    <ul className="text-sm text-[#111418] list-disc pl-5 space-y-1">
                                      {event.offerings.map((o, idx) => (
                                        <li key={idx}>
                                          <span className="font-medium">{o.name}</span> - ${o.price} (Max Qty: {o.maxQuantity})<br />
                                          <span className="text-[#60748a]">{o.description}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                          
                              <div className="flex flex-col gap-2 items-end">
                                <button
                                  onClick={() => handleEdit(event.id)}
                                  className="h-9 px-4 rounded-full text-white bg-[#0c77f2] text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(event.id)}
                                  className="h-9 px-4 rounded-full text-white bg-red-600 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                          
                        ))}
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
