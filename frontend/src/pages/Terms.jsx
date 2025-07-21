import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-8 bg-white text-gray-800">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
          <p className="mb-4">
            By accessing or using the North Carolina Telugu Brahmin Association (NCTBA) website and services, you agree to comply with the following terms and conditions:
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Use of Services</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>You must use our services in a respectful and lawful manner.</li>
            <li>Any misuse, disruption, or abusive behavior may result in suspension or removal from the platform.</li>
            <li>Accounts must be registered with accurate and complete information.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Intellectual Property</h2>
          <p className="mb-4">
            All content, including logos, graphics, and text, belongs to NCTBA unless otherwise noted. Use of this material without prior written consent is prohibited.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Donations and Payments</h2>
          <p className="mb-4">
            All donations are voluntary and non-refundable unless otherwise explicitly stated. We use third-party services to process payments securely.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Limitation of Liability</h2>
          <p className="mb-4">
            NCTBA shall not be held liable for any damages resulting from the use of our site or services. This includes indirect or consequential losses.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Modifications</h2>
          <p className="mb-4">
            We reserve the right to update these terms at any time. Continued use of our services constitutes your acceptance of the modified terms.
          </p>

          <p className="text-sm text-gray-500">
            If you have questions about these terms, please contact us at <a href="mailto:info@nctba.org" className="text-blue-600 underline">info@nctba.org</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}