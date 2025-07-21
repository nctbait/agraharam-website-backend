import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const committees = [
  {
    name: 'Food Services Committee',
    description: 'Handles food planning, preparation, and distribution for community events.',
    icon: '🍛'
  },
  {
    name: 'Events Management Committee',
    description: 'Plans and organizes major events such as Ugadi, Deepavali, and Annual Picnics.',
    icon: '🎉'
  },
  {
    name: 'Youth Services Committee',
    description: 'Engages youth in educational and cultural activities such as quiz bowls, essay competitions, and workshops.',
    icon: '👧🏽👦🏽'
  },
  {
    name: 'Cultural & Matrimony Committee',
    description: 'Coordinates cultural programs and manages the matrimony service platform.',
    icon: '🎭'
  },
  {
    name: 'Membership & Finance Committee',
    description: 'Manages membership data, payments, tier upgrades, and financial oversight.',
    icon: '💳'
  },
  {
    name: 'Religious Committee',
    description: 'Organizes temple-related activities, homams, and religious observances.',
    icon: '🕉️'
  },
  {
    name: 'IT & Communication Committee',
    description: 'Manages the website, newsletters, and member communications.',
    icon: '💻'
  }
];

export default function Committees() {
  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-5">
        <h1 className="text-2xl font-bold text-center mb-6">Our Committees</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {committees.map((committee, index) => (
            <div
              key={index}
              className="rounded-lg shadow-md p-4 border border-gray-200 bg-white hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>{committee.icon}</span>
                {committee.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2">{committee.description}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
