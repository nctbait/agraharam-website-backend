import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- Types (informal) ---
// HomeAPIResponse = {
//   announcements?: string[];
//   banners?: string[];                  // image URLs for general banners (kept for parity)
//   news?: Array<{ title: string; description: string; image?: string; linkUrl?: string }>;
//   ads?: Array<{ id: string|number; imageUrl: string; alt?: string; linkUrl?: string; label?: string }>;
//   nextEvent?: { id: number|string; name: string; date: string; imageUrl?: string; ctaUrl?: string } | null;
// }

export default function HomePage() {
  const [data, setData] = useState({
    announcements: [],
    banners: [],
    news: [],
    ads: [],
    nextEvent: null,
    mission: null, // NEW
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isLoggedIn = () => !!localStorage.getItem("jwtToken");
  // You can move this base URL to an env var (e.g., VITE_API_BASE_URL or REACT_APP_API_BASE_URL)
  const apiBase = useMemo(() => {
    const fromEnv = process.env.REACT_APP_API_BASE_URL;
    return (fromEnv || "").replace(/\/$/, "");
  }, []);
  // --- Saffron theme (can move to admin later) ---
  const THEME = useMemo(() => ({
    brand: '#F57C00',      // saffron (primary)
    brandDark: '#E65100',  // deeper saffron
    brandLight: '#FFF3E0', // pale saffron
    accent: '#0E7490',     // teal accent
  }), []);

  const pageBgStyle = useMemo(() => ({
    backgroundImage: `
          radial-gradient(60% 40% at 100% 0%, ${THEME.brandLight} 0%, rgba(255,255,255,0) 60%),
          radial-gradient(40% 30% at 0% 100%, ${THEME.brandLight} 0%, rgba(255,255,255,0) 65%)
        `
  }), [THEME.brandLight]);

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        // Single endpoint that returns all homepage content; implement on backend
        const res = await fetch(`${apiBase}/api/public/home`, { signal: ac.signal });
        if (!res.ok) throw new Error(`Failed to load home content: ${res.status}`);
        const json = await res.json();

        // Provide safe fallbacks to keep the page stable
        setData({
          announcements: json.announcements || [],
          banners: json.banners || [],
          news: Array.isArray(json.news) ? json.news : [],
          ads: Array.isArray(json.ads) ? json.ads : [],
          nextEvent: json.nextEvent || null,
          mission: json.mission || null, // NEW
        });
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setError("We couldn't load the latest content. Showing a basic view.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, [apiBase]);

  const { announcements, news, ads, nextEvent } = data;
  const targetHref = useMemo(
    () => (isLoggedIn() ? "/user-events" : "/login?redirect=/user-events"),
    []
  );
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 min-h-screen" style={pageBgStyle}>

        {/* Hero */}
        <section className="rounded-xl mb-6 overflow-hidden">
          <div
            className="w-full flex flex-col items-center justify-center text-center px-6 py-12 sm:py-16"
            style={{ backgroundImage: `linear-gradient(135deg, ${THEME.brand} 0%, ${THEME.brandDark} 100%)` }}
          >
            <img
              src="/images/Agraharam_Logo_Transperant_Background.png"
              alt="NCTBA — Agraharam NC"
              className="h-14 sm:h-16 w-auto object-contain drop-shadow mb-4"
              loading="eager"
            />
            <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight drop-shadow">
              North Carolina Telugu Brahmin Association
            </h1>
            <p className="mt-2 text-orange-100 text-sm sm:text-base max-w-xl">
              Uniting Telugu Brahmin families across North Carolina — building stronger bonds, deeper cultural roots for our children, and lasting impact for the communities we call home.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                to={isLoggedIn() ? "/dashboard" : "/register"}
                className="inline-flex items-center px-5 h-10 rounded-lg text-sm font-bold shadow"
                style={{ backgroundColor: 'white', color: THEME.brandDark }}
              >
                {isLoggedIn() ? "Go to Dashboard" : "Join the Community"}
              </Link>
              <Link
                to="/committees"
                className="inline-flex items-center px-5 h-10 rounded-lg text-sm font-bold border border-white text-white"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </section>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Next Event banner spans full width */}
          {nextEvent && (
            <div className="lg:col-span-12">
              <div
                className="w-full rounded-lg p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                style={{ background: `linear-gradient(90deg, ${THEME.brandLight}, #fff)` }}
              >
                <span
                  className="px-2 py-1 text-[11px] sm:text-xs font-bold rounded-md"
                  style={{ backgroundColor: THEME.brand, color: 'white' }}
                >
                  NEXT EVENT
                </span>
                <div className="flex-1 text-gray-900">
                  <span className="font-bold">{nextEvent.name}</span>
                  {nextEvent.date && (
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(nextEvent.date).toLocaleString()}
                    </span>
                  )}
                </div>
                <Link
                  to={targetHref}
                  className="inline-flex items-center justify-center px-3 h-9 rounded-md text-sm font-semibold shadow-sm"
                  style={{ backgroundColor: THEME.brandDark, color: 'white' }}
                >
                  Register Now
                </Link>
              </div>
            </div>
          )}

          {/* LEFT: News */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Latest News</h2>
            </div>

            {loading && news.length === 0 && (
              <div className="text-sm text-gray-500">Loading latest news…</div>
            )}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {news?.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {news.map((item, index) => (
                  <article
                    key={`news-${index}`}
                    className="rounded-lg bg-white shadow-sm p-3 flex flex-col gap-3 border border-gray-100"
                  >
                    {item.image && (
                      <div
                        className="w-full rounded-md bg-center bg-no-repeat bg-cover aspect-[16/9]"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold hover:underline mt-1"
                          style={{ color: THEME.accent }}
                        >
                          Read more
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 flex flex-col items-center text-center gap-3">
                  <p className="text-sm text-gray-500">No news to display right now. Check back soon!</p>
                  <Link
                    to="/committees"
                    className="inline-flex items-center px-4 h-9 rounded-md text-sm font-semibold text-white shadow-sm"
                    style={{ backgroundColor: THEME.brand }}
                  >
                    Explore our Services
                  </Link>
                </div>
              )
            )}
          </section>

          {/* RIGHT: Sidebar (Announcements, Sponsors, Mission) */}
          <aside className="lg:col-span-4 space-y-4">

            {/* Announcements */}
            <div
              className="rounded-lg p-3 border"
              style={{ backgroundColor: THEME.brandLight, borderColor: '#FDE68A' }}
            >
              <div className="text-sm font-semibold mb-2" style={{ color: THEME.brandDark }}>Announcements</div>
              {announcements?.length > 0 ? (
                <ul className="space-y-1">
                  {announcements.map((a, i) => (
                    <li key={`ann-${i}`} className="text-sm leading-snug">{a}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No announcements at this time. Stay tuned!</p>
              )}
            </div>

            {/* Sponsors (object-contain logos; responsive) */}
            {ads?.length > 0 && (
              <div className="rounded-lg bg-white shadow-sm border border-gray-100 p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold">Sponsors</h3>
                  <span className="text-xs text-gray-500">Supports our programs</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {ads.map((ad) => {
                    const fit = (ad.fit || 'contain').toLowerCase();
                    const aspect = ad.aspectRatio || '3 / 1';
                    const bg = ad.bg || '#ffffff';
                    const paddingPx = ad.padding != null ? `${ad.padding}px` : '8px';
                    const imgClass = fit === 'cover' ? 'object-cover' : 'object-contain';
                    return (
                      <a
                        key={ad.id}
                        href={ad.linkUrl || '#'}
                        target={ad.linkUrl ? '_blank' : undefined}
                        rel={ad.linkUrl ? 'noopener noreferrer' : undefined}
                        className="block rounded-md overflow-hidden border border-gray-200 hover:shadow bg-white"
                        aria-label={ad.label || 'Community sponsor'}
                        style={{ padding: paddingPx }}
                      >
                        <div className="w-full" style={{ aspectRatio: aspect, backgroundColor: bg, minHeight: '56px' }}>
                        <img src={ad.imageUrl} alt={ad.label || 'Sponsor logo'} className={`w-full h-full ${imgClass}`} loading="lazy" />
                        </div>
                        {ad.label && <div className="pt-1 text-[11px] text-center text-gray-700">{ad.label}</div>}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mission */}
            {(data.mission || true) && (
              <div
                className="rounded-xl p-4 border"
                style={{ backgroundColor: THEME.brandLight, borderColor: '#FBD38D' }}
              >
                <h2 className="text-lg font-bold" style={{ color: THEME.brandDark }}>

                  {data.mission?.title || "North Carolina Telugu Brahmin Association"}
                </h2>
                <p className="mt-2 text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                  {data.mission?.body ||
                    `Coming together we intend to create a positive impact socially within our Brahmin community here in NC and also to the Brahmin community back home as appropriate. A cohesively-bonded Brahmin community is good for our families in many dimensions: a deeper support system for each of us, stronger cultural roots for our children, and for greater good that we can extend to the societies we live in.`}
                </p>
                {data.mission?.ctaUrl && (
                  <Link
                    to={data.mission.ctaUrl}
                    className="inline-flex items-center mt-3 px-3 h-9 rounded-md text-white text-xs font-semibold shadow-sm"
                    style={{ backgroundColor: THEME.brandDark }}
                   >
                    {data.mission.ctaText || "Learn more"}
                  </Link>
                )}
              </div>
            )}
          </aside>

          {/* Quick Links full-width (optional: move into left column top if you want) 
          <section className="lg:col-span-12">
            <h2 className="text-xl font-bold mb-3">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/event-registration" className="w-full h-10 px-4 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
                Register for Events
              </Link>
              <Link to="/dashboard" className="w-full h-10 px-4 rounded-lg bg-gray-200 text-black font-bold flex items-center justify-center">
                View Membership Info
              </Link>
            </div>
            <div className="pt-3 flex justify-center sm:justify-start">
              <button className="w-full sm:w-auto h-10 px-4 rounded-lg bg-gray-200 text-black font-bold">
                Join the Community Forum
              </button>
            </div>
          </section>*/}
        </div>
      </main>

      <Footer />
    </>
  );
}