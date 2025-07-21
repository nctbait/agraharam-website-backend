import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const homeContent = {
  announcements: [
    "Ugadi event registration opens tomorrow!",
    "Annual picnic scheduled for September 1st."
  ],
  banners: [
    "/images/ugadi.jpg",
    "/images/picnic.jpg"
  ],
  news: [
    {
      title: "Community Picnic",
      description: "Join us for a fun-filled day at the park with games, food, and music. All community members are welcome!",
      image: "https://example.com/picnic.jpg"
    },
    {
      title: "Community Service Day",
      description: "Volunteer with us to clean up the local park and help keep our community beautiful.",
      image: "https://example.com/service.jpg"
    },
    {
      title: "Community Book Club",
      description: "Join our monthly book club to discuss thought-provoking books and connect with fellow readers.",
      image: "https://example.com/bookclub.jpg"
    }
  ]
};

export default function HomePage() {
  return (
    <>
    <Navbar />
    <main className="px-4 lg:px-40 py-5">
      <section
        className="rounded-lg min-h-[218px] mb-6 bg-cover bg-center flex flex-col justify-end overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 25%), url('/images/Agraharam_Logo_Transperant_Background.png')"
        }}
      >
        <div className="flex p-4">
          <p className="text-white text-2xl sm:text-[28px] font-bold">NCTBA - Agraharam NC</p>
        </div>
      </section>

      <h2 className="text-xl font-bold px-4 pb-3">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-3">
          <Link to="/event-registration" className="w-full h-10 px-4 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
            Register for Events
          </Link>
          <Link to="/dashboard" className="w-full h-10 px-4 rounded-lg bg-gray-200 text-black font-bold flex items-center justify-center">
            View Membership Info
          </Link>
      </div>
      <div className="px-4 py-2 flex justify-center">
        <button className="w-full sm:w-auto h-10 px-4 rounded-lg bg-gray-200 text-black font-bold">Join the Community Forum</button>
      </div>

      <h2 className="text-xl font-bold px-4 pt-5 pb-3">Latest News</h2>
      <div className="space-y-4 px-4">
        {homeContent.news.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-stretch gap-4 rounded-lg bg-white shadow-sm p-2">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-sm text-gray-500 font-normal">Community News</p>
              <p className="text-base text-black font-bold">{item.title}</p>
              <p className="text-sm text-gray-500 font-normal">{item.description}</p>
            </div>
            <div
              className="w-full sm:w-48 bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
              style={{ backgroundImage: `url('${item.image}')` }}
            ></div>
          </div>
        ))}
      </div>
    </main>
    <Footer />
    </>
  );
}
