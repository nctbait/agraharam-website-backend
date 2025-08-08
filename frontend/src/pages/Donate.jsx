import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/authAxios';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Donate() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [setCaptchaToken] = useState('');
  const [form, setForm] = useState({
    donorName: '',
    phone: '',
    email: '',
    reason: '',
    amount: '',
    paymentMethod: '',
    confirmationCode: ''
  });

  useEffect(() => {
    api.get('/api/family/primary')
      .then(() => {
        setIsLoggedIn(true);
        loadFamilyMembers();
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const loadFamilyMembers = async () => {
    const [primary, spouse] = await Promise.all([
      api.get('/api/family/primary'),
      api.get('/api/family/spouse'),
    ]);

    const membersList = [];
    if (primary?.id) {
      membersList.push({
        id: primary.id,
        label: `${primary.firstName} ${primary.lastName} (Primary)`,
        phone: primary.phone,
        email: primary.email,
      });
    }
    if (spouse?.id) {
      membersList.push({
        id: spouse.id,
        label: `${spouse.firstName} ${spouse.lastName} (Spouse)`,
        phone: spouse.phone,
        email: spouse.email,
      });
    }

    setMembers(membersList);
  };

  const handleMemberChange = (e) => {
    const id = e.target.value;
    setSelectedMemberId(id);

    const selected = members.find(m => m.id.toString() === id);
    if (selected) {
      setForm(prev => ({
        ...prev,
        donorName: selected.label,
        phone: selected.phone || '',
        email: selected.email || ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      donorName: form.donorName,
      phone: form.phone,
      email: form.email,
      reason: form.reason,
      amount: parseFloat(form.amount),
      paymentMethod: form.paymentMethod,
      confirmationCode: form.confirmationCode,
      captchaToken:form.captchaToken
    };

    try {
      await api.post('/api/donations', payload);
      alert('Thank you! Your donation was submitted and is pending approval.');
      setForm({
        donorName: '',
        phone: '',
        email: '',
        reason: '',
        amount: '',
        paymentMethod: '',
        confirmationCode: ''
      });
      setSelectedMemberId('');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-5">
        <div className="max-w-[960px] w-full mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Support NCTBA</h1>
          <p className="text-base text-gray-700 mb-4">
            Your generous contributions help us sustain and expand our community initiatives.
            Donations are tax-deductible under our 501(c)(3) status. Our ID is 123-4567890.
          </p>

          {isLoggedIn && (
            <>
              <label className="block font-medium mb-1">Donor</label>
              <select
                value={selectedMemberId}
                onChange={handleMemberChange}
                className="form-select w-full rounded border mb-4"
              >
                <option value="">Select Primary or Spouse</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </>
          )}

          {!isLoggedIn && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <input name="donorName" value={form.donorName} onChange={handleChange} type="text" placeholder="Your Name" className="form-input h-12 rounded-lg border px-4 w-full sm:col-span-2" />
              <input name="phone" value={form.phone} onChange={handleChange} type="text" placeholder="Phone Number" className="form-input h-12 rounded-lg border px-4 w-full" />
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" className="form-input h-12 rounded-lg border px-4 w-full" />
            </div>
          )}

          <input name="reason" value={form.reason} onChange={handleChange} type="text" placeholder="Reason for Donation" className="form-input h-12 rounded-lg border px-4 w-full mb-4" />

          <h2 className="text-lg font-bold mt-6 mb-2">Choose an Amount</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {[25, 50, 100, 250].map(amount => (
              <button
                key={amount}
                onClick={() => setForm(prev => ({ ...prev, amount }))}
                className="flex-1 min-w-[100px] rounded-full h-10 px-4 bg-[#dce7f3] text-[#121416] text-sm font-bold"
              >
                ${amount}
              </button>
            ))}
          </div>

          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            type="number"
            placeholder="Enter custom amount"
            className="form-input w-full max-w-md rounded-xl border bg-white h-14 p-[15px] text-base font-normal mb-4"
          />

          <label className="block font-semibold mb-2">Payment Method</label>
          <div className="flex gap-4 mb-4">
            {['ZELLE', 'PAYPAL'].map(method => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={form.paymentMethod === method}
                  onChange={handleChange}
                />
                {method}
              </label>
            ))}
          </div>

          <input
            name="confirmationCode"
            value={form.confirmationCode}
            onChange={handleChange}
            type="text"
            placeholder="Enter Zelle/PayPal Confirmation Code"
            className="form-input w-full max-w-md rounded-xl border bg-white h-14 p-[15px] text-base font-normal mb-4"
          />

          <ReCAPTCHA
            sitekey="6LcstpwrAAAAAPMIX-opU19SQUuKSHspspw12YfA"
            onChange={token => setCaptchaToken(token)}
            className="mb-4"
          />

          <div>
            <button
              onClick={handleSubmit}
              className="w-full max-w-md rounded-full h-10 px-4 bg-[#dce7f3] text-[#121416] text-sm font-bold"
            >
              Submit Donation
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
