// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/authAxios';
import ReCAPTCHA from 'react-google-recaptcha';

const COMMITTEES = [
  { value: 'food', label: 'Food Services' },
  { value: 'events', label: 'Events Management' },
  { value: 'youth', label: 'Youth Services' },
  { value: 'matrimony', label: 'Cultural & Matrimony' },
  { value: 'finance', label: 'Membership & Finance' },
  { value: 'religious', label: 'Religious' },
  { value: 'it', label: 'IT & Communication' },
  { value: 'president', label: 'President' },
  { value: 'trustees', label: 'Trustees' },
  { value: 'general', label: 'General' }
];

export default function ContactUs() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', committee:'', message:'' });
  const [captchaToken, setCaptchaToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState('');

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email.';
    if (!form.committee) return 'Please select a committee.';
    if (!form.message.trim()) return 'Please enter your message.';
    if (!captchaToken) return 'Please complete the CAPTCHA.';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setOk(null); setErr('');
    const v = validate(); if (v) { setErr(v); return; }
    setSubmitting(true);
    try {
      await api.post('/api/public/contact', { ...form, captchaToken });
      setOk(true);
      setForm({ name:'', email:'', phone:'', committee:'', message:'' });
      setCaptchaToken('');
    } catch (ex) {
      setOk(false);
      setErr(ex?.response?.data?.message || 'Failed to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-8 bg-white text-gray-800">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

          {ok === true && <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-green-800">Thank you! Your message has been sent.</div>}
          {ok === false && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-800">{err}</div>}

          <p className="mb-4">North Carolina Telugu Brahmin Association (NCTBA) is a registered 501(c)(3) non-profit organization. Our communication address is:</p>
          <p className="mb-6 font-semibold">NCTBA, 2121 CRIGAN BLUFF DR, CARY NC 27513</p>

          <p className="mb-6 text-sm text-gray-600">Please do not share sensitive information. Responses are by volunteers.</p>

          <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={onChange} type="text" placeholder="Your Name" className="form-input h-12 rounded-lg border border-gray-300 px-4" required />
            <input name="email" value={form.email} onChange={onChange} type="email" placeholder="Your Email" className="form-input h-12 rounded-lg border border-gray-300 px-4" required />
            <input name="phone" value={form.phone} onChange={onChange} type="text" placeholder="Phone Number" className="form-input h-12 rounded-lg border border-gray-300 px-4" />
            <select name="committee" value={form.committee} onChange={onChange} className="form-input h-12 rounded-lg border border-gray-300 px-4" required>
              <option value="">Select Committee</option>
              {COMMITTEES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <textarea name="message" value={form.message} onChange={onChange} placeholder="Message" rows={4} className="md:col-span-2 form-textarea w-full rounded-lg border border-gray-300 p-4" required />
            <div className="md:col-span-2">
              <ReCAPTCHA sitekey="6LcstpwrAAAAAPMIX-opU19SQUuKSHspspw12YfA" onChange={t => setCaptchaToken(t || '')} className="mb-2" />
              {err && <p className="text-sm text-red-600">{err}</p>}
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={submitting} className="rounded-lg px-6 h-10 bg-blue-600 text-white font-bold disabled:opacity-60">
                {submitting ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
