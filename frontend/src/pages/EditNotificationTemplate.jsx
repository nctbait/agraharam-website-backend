import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';

export default function EditNotificationTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState({ subject: '', body: '' });

  useEffect(() => {
    // Simulate fetch
    const mockTemplates = {
      'registration-confirmation': {
        subject: 'Welcome to NCTBA!',
        body: 'Dear {name},\n\nThank you for registering with us. We are excited to have you onboard.\n\nBest,\nNCTBA Team'
      },
      'event-reminder': {
        subject: 'Reminder: Upcoming Event - {event}',
        body: 'Hi {name},\n\nJust a reminder that {event} is happening on {date}. We look forward to seeing you!\n\nRegards,\nNCTBA Team'
      },
      'membership-renewal': {
        subject: 'Renew Your NCTBA Membership',
        body: 'Hello {name},\n\nYour membership is about to expire. Please renew by {date} to continue enjoying member benefits.\n\nThank you!'
      },
      'transaction-receipt': {
        subject: 'Payment Confirmation - NCTBA',
        body: 'Hi {name},\n\nWe have received your payment of ₹{amount}. Transaction ID: {txnId}.\n\nThank you for supporting NCTBA.'
      },
      'general-announcement': {
        subject: 'Latest Update from NCTBA',
        body: 'Dear Member,\n\n{announcement}\n\nRegards,\nNCTBA Admin'
      }
    };

    if (mockTemplates[id]) {
      setTemplate(mockTemplates[id]);
    } else {
      setTemplate({ subject: '', body: '' });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Saved template:', { id, ...template });
    // TODO: Save to backend
    navigate('/notification-template-management');
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <AdminSidebar isOpen={true} />
        <main className="flex-1 flex flex-col items-center px-4 lg:px-40 py-6">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6 border border-[#dde0e3]">
            <h1 className="text-2xl font-bold mb-6 capitalize">
              Edit Template: {id.replace(/-/g, ' ')}
            </h1>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <label>
                <span className="text-base font-medium">Subject</span>
                <input
                  name="subject"
                  value={template.subject}
                  onChange={handleChange}
                  className="form-input mt-2 w-full h-12 rounded-lg border border-[#dde0e3] px-4"
                  required
                />
              </label>
              <label>
                <span className="text-base font-medium">Body</span>
                <textarea
                  name="body"
                  value={template.body}
                  onChange={handleChange}
                  className="form-input mt-2 w-full min-h-[200px] rounded-lg border border-[#dde0e3] px-4 py-2 font-mono text-sm"
                  required
                />
              </label>
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/notification-template-management')}
                  className="rounded-full h-10 px-6 bg-gray-300 text-[#121416] text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
                >
                  Save Template
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
