import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Donate() {
  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-5">
        <div className="max-w-[960px] w-full mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Support NCTBA</h1>
          <p className="text-base text-gray-700 mb-4">
            Your generous contributions help us sustain and expand our community initiatives. Donations are tax-deductible under our 501(c)(3) status. Our ID is 123-4567890.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input type="text" placeholder="Your Name" className="form-input h-12 rounded-lg border border-gray-300 px-4 w-full sm:col-span-2" />
            <input type="text" placeholder="Phone Number" className="form-input h-12 rounded-lg border border-gray-300 px-4 w-full" required />
            <input type="email" placeholder="Your Email" className="form-input h-12 rounded-lg border border-gray-300 px-4 w-full" required />            <input type="text" placeholder="Reason for Donation" className="form-input h-12 rounded-lg border border-gray-300 px-4 w-full sm:col-span-2" />
          </div>

          <h2 className="text-lg font-bold mt-6 mb-2">Choose an Amount</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {[25, 50, 100, 250].map((amount) => (
              <button
                key={amount}
                className="flex-1 min-w-[100px] rounded-full h-10 px-4 bg-[#dce7f3] text-[#121416] text-sm font-bold"
              >
                ${amount}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Enter custom amount"
            className="form-input w-full max-w-md rounded-xl border border-[#dde0e3] bg-white text-[#121416] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal mb-4"
          />

          <div>
            <button className="w-full max-w-md rounded-full h-10 px-4 bg-[#dce7f3] text-[#121416] text-sm font-bold">
              Donate with PayPal
            </button>
            <p className="text-sm text-gray-500 mt-2">*You will be redirected to our secure PayPal payment gateway.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}