import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BecomeMember() {
  const [memberships, setMemberships] = useState([]);
  const [current, setCurrent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("jwtToken");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [zelleInfo, setZelleInfo] = useState({ confirmation: "", recipient: "" });
  const [founderNotice, setFounderNotice] = useState(false);


  const currentPrice = current
    ? memberships.find(m => m.name === current.membershipName)?.price
    : null;


  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_BASE}/api/memberships/available`, { headers })
      .then(res => setMemberships(res.data))
      .catch(() => setError("Failed to load membership types"));

    axios.get(`${API_BASE}/api/memberships/current`, { headers })
      .then(res => setCurrent(res.data))
      .catch(() => setError("Failed to load current membership"));
  }, [API_BASE, token]);

  const startUpgrade = (membership) => {
    setSelectedMembership(membership);
    setShowPaymentForm(true);
    setPaymentMethod("zelle");
    setZelleInfo({ confirmation: "", recipient: "" });
    setFounderNotice(membership.name.toLowerCase().includes("founder"));
  };

  const submitUpgrade = () => {
    const payload = {
      membershipTypeId: selectedMembership.id,
      paymentMethod,
      confirmation: paymentMethod === "zelle" ? zelleInfo.confirmation : undefined,
      recipientName: paymentMethod === "zelle" ? zelleInfo.recipient : undefined,
    };

    axios.post(`${API_BASE}/api/memberships/upgrade`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setMessage("Upgrade request submitted successfully!");
        setShowPaymentForm(false);
      })
      .catch(() => setError("Upgrade failed."));
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
          <main className="flex-1 flex flex-col items-center px-4 lg:px-20 py-6">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow p-4">
              <div className="mb-4">
                <h1 className="text-[#111418] text-2xl font-bold">Membership Options</h1>
                {current && (
                  <div className="mt-2 text-sm text-[#111418]">
                    Your current membership: <strong>{current.membershipName}</strong>
                    {current.startDate && (
                      <> (from {current.startDate}{current.endDate && ` to ${current.endDate}`})</>
                    )}
                  </div>
                )}
              </div>

              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memberships
                  .filter(m => currentPrice == null || m.price > currentPrice)
                  .map((m, idx) => (

                    <div key={idx} className="border border-[#dbe0e6] rounded-lg p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#111418]">{m.name}</h3>
                        <p className="text-sm text-[#60748a] mt-1">{m.description}</p>
                        <p className="text-base font-medium mt-2 text-[#0c77f2]">${m.price}</p>
                        <p className="text-sm text-[#60748a]">
                          Duration: {m.durationMonths >= 999 ? "Lifetime" : `${m.durationMonths} months`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => startUpgrade(m)}
                        disabled={current && current.membershipName === m.name}
                        className={`mt-4 h-10 px-6 rounded-full text-sm font-bold ${current && current.membershipName === m.name
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-[#0c77f2] text-white"
                          }`}
                      >
                        {current && current.membershipName === m.name ? "Current Plan" : `Upgrade to ${m.name}`}
                      </button>

                    </div>
                  ))}
              </div>
              {showPaymentForm && selectedMembership && (
                <div className="bg-[#f9fafb] border border-[#dbe0e6] rounded-lg mt-6 p-4 w-full">
                  <h2 className="text-lg font-bold mb-2">Complete Your Membership Upgrade</h2>
                  <p className="text-sm mb-4">Selected Plan: <strong>{selectedMembership.name}</strong> (${selectedMembership.price})</p>
                  {founderNotice && (
                    <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                      <p className="font-semibold">Important:</p>
                      <p>Please check with the board for open spots before making the payment for a Founder membership.</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="mr-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="mr-1"
                      />
                      PayPal
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="zelle"
                        checked={paymentMethod === "zelle"}
                        onChange={() => setPaymentMethod("zelle")}
                        className="mr-1 ml-4"
                      />
                      Zelle
                    </label>
                  </div>

                  {paymentMethod === "zelle" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Zelle Confirmation Number"
                        value={zelleInfo.confirmation}
                        onChange={(e) => setZelleInfo(prev => ({ ...prev, confirmation: e.target.value }))}
                        className="form-input border border-[#dbe0e6] px-4 py-2 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Paid To (e.g., NCTBA Treasurer)"
                        value={zelleInfo.recipient}
                        onChange={(e) => setZelleInfo(prev => ({ ...prev, recipient: e.target.value }))}
                        className="form-input border border-[#dbe0e6] px-4 py-2 rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(false)}
                      className="rounded-full h-10 px-6 bg-gray-400 text-white text-sm font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={submitUpgrade}
                      className="rounded-full h-10 px-6 bg-[#0c77f2] text-white text-sm font-bold"
                    >
                      Submit Upgrade
                    </button>
                  </div>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
