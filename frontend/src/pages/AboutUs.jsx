import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-8 bg-white text-gray-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <p className="mb-4">
            Welcome to the North Carolina Telugu Brahmin Association! We are a vibrant community dedicated to preserving and promoting our cultural heritage while fostering a strong sense of belonging among Telugu Brahmins in North Carolina. Our association serves as a platform for social interaction, cultural exchange, and community support.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">Our History</h2>
          <p className="mb-4">
            Established in 2010, the North Carolina Telugu Brahmin Association has grown from a small gathering of like-minded individuals to a thriving community organization. Our journey has been marked by numerous cultural events, social gatherings, and community service initiatives, all aimed at strengthening our bonds and contributing positively to society.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">Our Mission</h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Create a positive social impact within the Brahmin community in North Carolina and support the Brahmin community back home.</li>
            <li>Foster a cohesively-bonded community that provides support, maintains cultural roots, and encourages societal contributions.</li>
            <li>Preserve and promote Telugu Brahmin traditions and values.</li>
            <li>Provide a platform for social and cultural exchange.</li>
            <li>Support community members in times of need.</li>
            <li>Contribute to the broader community through service and outreach.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-3">Our Activities and Initiatives</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Cultural events and festivals celebrating our rich heritage.</li>
            <li>Social gatherings and networking opportunities.</li>
            <li>Educational programs for children and adults.</li>
            <li>Community service projects and charitable activities.</li>
            <li>Matrimonial services to help members find suitable partners.</li>
            <li>Financial support and guidance for members.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}