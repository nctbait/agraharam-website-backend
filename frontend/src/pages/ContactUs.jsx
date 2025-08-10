import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactUs() {
  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-8 bg-white text-gray-800">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

          <p className="mb-4">
            North Carolina Telugu Brahmin Association (NCTBA) is a registered 501(c)(3) non-profit organization. Our communication address is:
          </p>
          <p className="mb-6 font-semibold">NCTBA, 2121 CRIGAN BLUFF DR, CARY NC 27513</p>

          <h2 className="text-2xl font-semibold mb-3">Email Contacts</h2>
          <ul className="mb-4 space-y-2">
            <li><strong>President:</strong> <a href="mailto:president@nctba.org" className="text-blue-600 underline">president@nctba.org</a></li>
            <li><strong>Chairman's Office:</strong> <a href="mailto:chairman@nctba.org" className="text-blue-600 underline">chairman@nctba.org</a></li>
          </ul>
          <p className="mb-6 text-sm text-gray-600">Please do not share any sensitive information via email. Response times may vary due to the volunteer nature of our organization.</p>

          <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Your Name" className="form-input h-12 rounded-lg border border-gray-300 px-4" required />
            <input type="email" placeholder="Your Email" className="form-input h-12 rounded-lg border border-gray-300 px-4" required />
            <input type="text" placeholder="Phone Number" className="form-input h-12 rounded-lg border border-gray-300 px-4" />
            <select className="form-input h-12 rounded-lg border border-gray-300 px-4" required>
              <option value="">Select Committee</option>
              <option value="food">Food Services</option>
              <option value="events">Events Management</option>
              <option value="youth">Youth Services</option>
              <option value="matrimony">Cultural & Matrimony</option>
              <option value="finance">Membership & Finance</option>
              <option value="religious">Religious</option>
              <option value="it">IT & Communication</option>
              <option value="president">President</option>
              <option value="trustees">Trustees</option>
              <option value="general">General</option>
            </select>
            <textarea
              placeholder="Message"
              rows={4}
              className="md:col-span-2 form-textarea w-full rounded-lg border border-gray-300 p-4"
              required
            ></textarea>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="rounded-lg px-6 h-10 bg-blue-600 text-white font-bold">Send</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}