import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-8 bg-white text-gray-800">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="mb-4">
            The North Carolina Telugu Brahmin Association (NCTBA) values your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Personal details such as name, email, phone, and address when registering or contacting us</li>
            <li>Event registration and donation details</li>
            <li>Information provided voluntarily through forms and communication</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>To manage event participation and community engagement</li>
            <li>To provide support and respond to inquiries</li>
            <li>To improve our services and communications</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Data Protection</h2>
          <p className="mb-4">
            We implement reasonable technical and organizational measures to safeguard your personal data. Access to data is limited to authorized volunteers and administrators.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Sharing of Information</h2>
          <p className="mb-4">
            We do not sell or rent your personal data. We may share information only with third parties necessary for event services or legal compliance.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Your Rights</h2>
          <p className="mb-4">
            You may request to review, update, or delete your personal data at any time by contacting us at <a href="mailto:privacy@nctba.org" className="text-blue-600 underline">privacy@nctba.org</a>.
          </p>

          <p className="text-sm text-gray-500">
            This policy may be updated from time to time. Please check back periodically for the latest version.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}