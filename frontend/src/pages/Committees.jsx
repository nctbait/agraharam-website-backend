// Committees.jsx — snippet to replace your <main>...</main> block

import { useMemo } from "react";
import { useNavigate } from "react-router-dom"; // if you're using React Router
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Committees() {
  const isLoggedIn = () => !!localStorage.getItem("jwtToken");
  const volunteerHref = isLoggedIn()
   ? "/volunteer-interest"
   : "/login?redirect=/volunteer-interest";

  // your existing committees array should still render below
  const committees = [
    {
      name: 'Events Management Committee',
      description: `Plans, organizes, and delivers high-quality community events that are safe, inclusive, and stress-free. We manage the full lifecycle—from concept and budgeting to vendor coordination, volunteer scheduling, and day-of execution. We create clear run-of-show plans, ensure accessibility and safety, and partner closely with Food, Finance, Communications, and Cultural/Youth teams. After each event, we capture feedback and metrics to improve efficiency and reduce waste—so every event feels effortless for attendees and meaningful for participants.`,
      icon: '🎉'
    },
    {
      name: 'Youth Services Committee',
      description: `Engages youth in educational, cultural, and service activities—quiz bowls, essay competitions, workshops, and volunteering. We focus on leadership, teamwork, and community impact while promoting inclusion and service learning. Youth hours are documented and can count toward PVSA recognition.`,
      icon: '👧🏽👦🏽'
    },
    {
      name: 'Cultural & Matrimony Committee',
      description: `The Cultural division celebrates and preserves our traditions, promotes artistic expression, and fosters intercultural understanding through festivals, performances, and workshops. Kalyanam Vedika supports matrimonial services rooted in cultural and ethical values—facilitating harmonious alliances and helping promote and preserve Brahmin marriage values within our community.`,
      icon: '🎭'
    },
    {
      name: 'Religious Committee',
      description: `Fosters spiritual growth and community through meaningful religious services and education. We organize pujas and observances, provide guidance grounded in our Brahmin heritage, and promote Sanatana Dharma through outreach and learning—building inclusion and well-being.`,
      icon: '🕉️'
    },
    {
      name: 'Membership & Finance Committee',
      description: `Stewards membership and finances with transparency, accountability, and compliance. Responsibilities include budgeting, planning, bookkeeping, reporting, and regulatory adherence, providing strategic guidance that sustains our mission and long-term stability. The Treasurer oversees financial operations with regular reports to the Board.`,
      icon: '💳'
    },
    {
      name: 'Food Services Committee',
      description: `Our Food Team exists to nourish body and community through safe, inclusive, and sustainable food service. We design vegetarian menus that reflect our cultural roots while offering options for varied dietary needs. We uphold strict food-safety practices, provide clear allergen labeling, and train volunteers to serve with efficiency and kindness. We steward resources responsibly through smart sourcing and waste-reduction, and we engage youth and adults alike in learning, leadership, and seva (service). Together, we create events where everyone feels welcome, cared for, and connected.`,
      icon: '🍛'
    },
    {
      name: 'IT & Communication Committee',
      description: `Empowers the organization with reliable, secure technology and clear communications. We manage infrastructure, website, email, social media, and data security; support BoT/BoD and committees; and leverage tech to collaborate effectively and protect member data.`,
      icon: '💻'
    }
  ];
  

  return (
    <>
     <Navbar />
    
    <main className="px-4 lg:px-40 py-6 space-y-6">
      {/* Hero */}
      <section className="rounded-xl border bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <h1 className="text-3xl font-bold">Serve the Community. Grow Together.</h1>
        <p className="mt-2 text-gray-700 max-w-3xl">
          We run programs that uplift our community—and our committees are the hands that make it happen.
          Join a team, give your time, and turn good intentions into real impact.
        </p>

        {/* PVSA Callout */}
        <div className="mt-4 rounded-lg border bg-white p-4 sm:flex sm:items-start sm:gap-3">
          <div className="text-2xl">🏅</div>
          <div>
            <h2 className="font-semibold">PVSA-Certifying Organization</h2>
            <p className="text-sm text-gray-600">
              We track your service hours and can certify them for the U.S. Presidential Volunteer Service Award (PVSA),
              following program guidelines.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 flex flex-wrap gap-3">
        <Link
   to={isLoggedIn() ? "/volunteer-interest" : "/login?redirect=/volunteer-interest"}
            className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            I want to volunteer
          </Link>
          <a
            href="#committees"
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Explore committees
          </a>
        </div>
      </section>

      {/* Committees Grid */}
      <section id="committees">
        <h2 className="sr-only">Committees</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {committees.map((committee, index) => (
            <div
              key={index}
              className="rounded-lg shadow-md p-4 border border-gray-200 bg-white hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span>{committee.icon}</span>
                {committee.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{committee.description}</p>
              <div className="mt-3 text-xs inline-flex items-center gap-1 rounded-full border px-2 py-1">
                <span>⏱️</span><span>Volunteer hours documented</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
    <Footer/>
    </>
  );
}
