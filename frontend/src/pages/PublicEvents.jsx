import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sampleEvents = [
  {
    title: 'Ugadi Celebrations 2025',
    date: 'April 5, 2025',
    description: 'Join us for a traditional celebration with food, dance, and community gathering.',
    image: '/images/ugadi.jpg'
  },
  {
    title: 'Community Cleanup Day',
    date: 'May 12, 2025',
    description: 'Volunteer to help beautify our local parks and streets.',
    image: '/images/cleanup.jpg'
  },
  {
    title: 'Yoga & Wellness Retreat',
    date: 'June 9, 2025',
    description: 'A peaceful retreat focused on holistic health and wellness practices.',
    image: '/images/yoga.jpg'
  }
];

export default function PublicEvents() {
  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-5">
        <h1 className="text-2xl font-bold text-center mb-6">Upcoming Community Events</h1>
        <div className="space-y-6">
          {sampleEvents.map((event, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-stretch gap-4 rounded-lg bg-white shadow-md p-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                <p className="text-sm text-gray-500 mb-1">{event.date}</p>
                <p className="text-gray-600 text-sm">{event.description}</p>
              </div>
              <div
                className="w-full sm:w-48 bg-center bg-no-repeat aspect-video bg-cover rounded-md"
                style={{ backgroundImage: `url('${event.image}')` }}
              ></div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
