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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isLoggedIn = () => !!localStorage.getItem("jwtToken");
  // You can move this base URL to an env var (e.g., VITE_API_BASE_URL or REACT_APP_API_BASE_URL)
  const apiBase = useMemo(() => {
    const fromEnv = import.meta?.env?.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
    return (fromEnv || "").replace(/\/$/, "");
  }, []);

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
      <main className="px-4 lg:px-40 py-5">
        {/* Hero / Static visual remains unchanged */}
        <section
          className="rounded-lg min-h-[218px] mb-6 bg-cover bg-center flex flex-col justify-end overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 25%), url('/images/Agraharam_Logo_Transperant_Background.png')",
          }}
        >
          {/*<div className="flex p-4">
            <p className="text-white text-2xl sm:text-[28px] font-bold">NCTBA - Agraharam NC</p>
          </div>*/}
        </section>

        {/* --- Dynamic: Upcoming Event banner (non-structural, just an info bar) --- */}
        {nextEvent && (
          <div className="px-4 mb-4">
            <div className="w-full rounded-lg bg-yellow-300 text-black p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="font-semibold">🎉 Next Event:</div>
              <div className="flex-1">
                <span className="font-bold">{nextEvent.name}</span>
                {nextEvent.date && (
                  <span className="ml-2 text-sm opacity-80">{new Date(nextEvent.date).toLocaleString()}</span>
                )}
              </div>
              <Link
                to={targetHref}
                className="inline-flex items-center justify-center px-3 h-9 rounded-md bg-black text-white text-sm font-semibold"
              >
                Register Now
              </Link>
            </div>
          </div>
        )}

        {/* --- Dynamic: Announcements ticker (optional, shows if provided) --- */}
        {announcements?.length > 0 && (
          <div className="px-4 mb-4">
            <div className="rounded-lg bg-blue-50 text-blue-900 p-3 border border-blue-200">
              <div className="text-sm font-semibold mb-1">Announcements</div>
              <ul className="list-disc pl-5 space-y-1">
                {announcements.map((a, i) => (
                  <li key={`ann-${i}`} className="text-sm">{a}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* --- Dynamic: Sponsored / Ads (non-structural add-on card) --- */}
        {ads?.length > 0 && (
          <div className="px-4 pt-2 pb-4">
            <div className="rounded-lg bg-white shadow-sm border border-gray-100 p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold">Sponsors</h3>
                <span className="text-xs text-gray-500">Advertising supports our community programs</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {ads.map((ad) => {
                  const fit = (ad.fit || 'contain').toLowerCase();         // contain | cover
                  const aspect = ad.aspectRatio || '3 / 1';                 // logo-friendly default
                  const bg = ad.bg || '#ffffff';
                  const paddingPx = (ad.padding != null) ? `${ad.padding}px` : '8px';
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
                      <div
                        className="w-full"
                        style={{ aspectRatio: aspect, backgroundColor: bg, minHeight: '64px' }}
                      >
                        <img
                          src={ad.imageUrl}
                          alt={ad.label || 'Sponsor logo'}
                          className={`w-full h-full ${imgClass}`}
                          loading="lazy"
                        />
                      </div>
                      {ad.label && (
                        <div className="pt-2 text-xs text-center text-gray-700">
                          {ad.label}
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}


        <h2 className="text-xl font-bold px-4 pt-5 pb-3">Latest News</h2>
        <div className="space-y-4 px-4">
          {(loading && news.length === 0) && (
            <div className="text-sm text-gray-500">Loading latest news…</div>
          )}
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          {news?.length > 0 ? (
            news.map((item, index) => (
              <div
                key={`news-${index}`}
                className="flex flex-col sm:flex-row items-stretch gap-4 rounded-lg bg-white shadow-sm p-2"
              >
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <p className="text-sm text-gray-500 font-normal">Community News</p>
                  <p className="text-base text-black font-bold">{item.title}</p>
                  <p className="text-sm text-gray-500 font-normal">{item.description}</p>
                  {item.linkUrl && (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-700 hover:underline mt-1"
                    >
                      Read more
                    </a>
                  )}
                </div>
                {item.image && (
                  <div
                    className="w-full sm:w-48 bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                )}
              </div>
            ))
          ) : (
            !loading && (
              <div className="text-sm text-gray-500">No news to display right now. Check back later.</div>
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}