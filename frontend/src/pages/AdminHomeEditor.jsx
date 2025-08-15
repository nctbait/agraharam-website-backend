import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import authAxios from "../api/authAxios";
import AdminSidebar from '../components/AdminSidebar';


// Small helper components
function Section({ title, subtitle, children, right }) {
  return (
    <section className="rounded-xl bg-white border border-gray-200 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(type === 'number' ? e.target.valueAsNumber : e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4, placeholder }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 h-6 text-xs text-gray-700 border border-gray-200">
      {children}
    </span>
  );
}

// Accessible modal used for preview
function PreviewModal({ open, onClose, title = "Home Preview", children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-center overflow-auto">
        <div className="w-full max-w-5xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="h-8 px-3 rounded-md border text-sm">Close</button>
            </div>
          </div>
          <div className="p-4 sm:p-5 overflow-auto flex-1 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewPane({ form, nextEvent, onRefreshNextEvent }) {
  const announcements = form.announcements || [];
  const news = Array.isArray(form.news) ? form.news : [];
  const ads = Array.isArray(form.ads) ? form.ads : [];
  const mission = form.mission || null;

  const targetHref = "/user-events"; // preview only

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Live Preview</h3>
        <button type="button" onClick={onRefreshNextEvent} className="text-xs px-2 h-7 rounded-md border">Refresh Event</button>
      </div>

      {/* Next Event */}
      {nextEvent && (
        <div className="w-full rounded-lg bg-yellow-300 text-black p-3 shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="font-semibold">🎉 Next Event:</div>
          <div className="flex-1">
            <span className="font-bold">{nextEvent.name}</span>
            {nextEvent.date && (
              <span className="ml-2 text-sm opacity-80">{new Date(nextEvent.date).toLocaleString()}</span>
            )}
          </div>
          <Link to={targetHref} className="inline-flex items-center justify-center px-3 h-8 rounded-md bg-black text-white text-xs font-semibold">
            Register Now
          </Link>
        </div>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="rounded-lg bg-blue-50 text-blue-900 p-3 border border-blue-200">
          <div className="text-sm font-semibold mb-2">Announcements</div>
          <ul className="space-y-1">
            {announcements.map((a, i) => (
              <li key={`p-ann-${i}`} className="text-sm leading-snug">{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sponsors */}
      {ads.length > 0 && (
        <div className="rounded-lg bg-white shadow-sm border border-gray-100 p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Sponsors</h4>
            <span className="text-xs text-gray-500">Preview</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ads.map((ad) => {
              const fit = (ad.fit || 'contain').toLowerCase();
              const imgClass = fit === 'cover' ? 'object-cover' : 'object-contain';
              const bg = ad.bg || '#ffffff';
              const paddingPx = ad.padding != null ? `${ad.padding}px` : '8px';
              return (
                <a
                  key={ad.id}
                  href={ad.linkUrl || '#'}
                  target={ad.linkUrl ? '_blank' : undefined}
                  rel={ad.linkUrl ? 'noopener noreferrer' : undefined}
                  className="block rounded-md overflow-hidden border border-gray-200 hover:shadow bg-white"
                  style={{ padding: paddingPx }}
                  aria-label={ad.label || 'Community sponsor'}
                >
                  <div className="w-full flex items-center justify-center" style={{ backgroundColor: bg, minHeight: '56px' }}>
                    <img src={ad.imageUrl} alt={ad.label || 'Sponsor logo'} className={`w-auto max-h-12 ${imgClass}`} loading="lazy" />
                  </div>
                  {ad.label && <div className="pt-1 text-[11px] text-center text-gray-700">{ad.label}</div>}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Mission */}
      {(mission && (mission.title || mission.body)) && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <h2 className="text-base font-bold text-amber-900">
            {mission.title || "North Carolina Telugu Brahmin Association"}
          </h2>
          <p className="mt-2 text-gray-800 text-sm leading-relaxed whitespace-pre-line">
            {mission.body || "Add your mission statement here."}
          </p>
          {mission.ctaUrl && (
            <Link to={mission.ctaUrl} className="inline-flex items-center mt-3 px-3 h-8 rounded-md bg-amber-700 text-white text-xs font-semibold">
              {mission.ctaText || "Learn more"}
            </Link>
          )}
        </div>
      )}

      {/* News */}
      {news.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Latest News</h4>
          <div className="grid gap-3 grid-cols-1">
            {news.slice(0, 3).map((item, index) => (
              <article key={`p-news-${index}`} className="rounded-lg bg-white shadow-sm p-2 flex gap-2 border border-gray-100">
                {item.image && (
                  <div className="w-24 rounded bg-center bg-cover" style={{ backgroundImage: `url('${item.image}')`, aspectRatio: '16/9' }} />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-3">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminHomeEditor() {
  const navigate = useNavigate();

  const defaults = useMemo(() => ({
    announcements: [],
    banners: [],
    mission: { title: "", body: "", ctaText: "", ctaUrl: "" },
    news: [],
    ads: []
  }), []);

  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [nextEvent, setNextEvent] = useState(null);

  // Load current content
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    authAxios.get("/api/admin/home")
      .then(res => {
        if (!mounted) return;
        const data = res || {};
        setForm({
          announcements: data.announcements || [],
          banners: data.banners || [],
          mission: data.mission || { title: "", body: "", ctaText: "", ctaUrl: "" },
          news: Array.isArray(data.news) ? data.news : [],
          ads: Array.isArray(data.ads) ? data.ads : [],
        });
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load current homepage content.");
      })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Load live next event for preview
  const fetchNextEvent = async () => {
    try {
      const res = await authAxios.get("/api/public/home");
      setNextEvent(res?.nextEvent || null);
    } catch (e) {
      console.warn("Preview: could not fetch next event", e);
    }
  };
  useEffect(() => { fetchNextEvent(); }, []);

  // Helpers
  const updateField = (path, value) => {
    setForm(prev => {
      const next = { ...prev };
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateListItem = (listKey, idx, field, value) => {
    setForm(prev => {
      const arr = [...(prev[listKey] || [])];
      if (field === null) {
        arr[idx] = value; // for simple arrays like announcements/banners
      } else {
        const item = { ...(arr[idx] || {}) };
        item[field] = value;
        arr[idx] = item;
      }
      return { ...prev, [listKey]: arr };
    });
  };

  const addToList = (listKey, template) => {
    setForm(prev => ({ ...prev, [listKey]: [ ...(prev[listKey] || []), template ] }));
  };

  const removeFromList = (listKey, idx) => {
    setForm(prev => {
      const arr = [...(prev[listKey] || [])];
      arr.splice(idx, 1);
      return { ...prev, [listKey]: arr };
    });
  };

  const moveItem = (listKey, idx, dir) => {
    setForm(prev => {
      const arr = [...(prev[listKey] || [])];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return { ...prev, [listKey]: arr };
    });
  };

  // Validation & Save
  const sanitize = (draft) => {
    const clean = { ...draft };
    clean.announcements = (clean.announcements || []).map(s => String(s || "").trim()).filter(Boolean);
    clean.banners = (clean.banners || []).map(s => String(s || "").trim()).filter(Boolean);
    clean.news = (clean.news || []).map(n => ({
      title: (n.title || "").trim(),
      description: (n.description || "").trim(),
      image: (n.image || "").trim() || null,
      linkUrl: (n.linkUrl || "").trim() || null
    })).filter(n => n.title && n.description);
    clean.ads = (clean.ads || []).map(a => ({
      id: (a.id || "").trim(),
      imageUrl: (a.imageUrl || "").trim(),
      label: (a.label || "").trim() || null,
      linkUrl: (a.linkUrl || "").trim() || null,
      type: (a.type || "logo").trim(),
      fit: (a.fit || "contain").trim(),
      aspectRatio: (a.aspectRatio || "3 / 1").trim(),
      bg: (a.bg || "#ffffff").trim(),
      padding: Number.isFinite(Number(a.padding)) ? Number(a.padding) : 8
    })).filter(a => a.id && a.imageUrl);
    if (clean.mission) {
      clean.mission = {
        title: (clean.mission.title || "").trim(),
        body: (clean.mission.body || "").trim(),
        ctaText: (clean.mission.ctaText || "").trim() || null,
        ctaUrl: (clean.mission.ctaUrl || "").trim() || null
      };
    }
    return clean;
  };

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const payload = sanitize(form);
      await authAxios.put("/api/admin/home", payload);
      setSuccess("Homepage content saved.");
    } catch (e) {
      console.error(e);
      setError("Failed to save. Please check required fields.");
    } finally {
      setSaving(false);
    }
  };

  const isEmpty = (arr) => !arr || arr.length === 0;

  return (
    <>
      <Navbar />
      <div className="flex">
                <AdminSidebar isOpen={true} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Edit Homepage Content</h1>
          <div className="flex gap-2 items-center">
            <button onClick={() => setPreviewOpen(true)} className="h-9 px-3 rounded-md border text-sm">Open Preview</button>
            <Link to="/" className="text-sm underline text-blue-700">Preview on site</Link>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-gray-600">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
            {/* LEFT: Mission + News (wider) */}
            <div className="lg:col-span-6 space-y-6">

              {/* Mission */}
              <Section title="Mission" subtitle="Shown as a highlighted card on the homepage">
                <div className="grid grid-cols-1 gap-3">
                  <TextInput label="Title" value={form.mission?.title} onChange={(v) => updateField("mission.title", v)} />
                  <TextArea label="Body" rows={6} value={form.mission?.body} onChange={(v) => updateField("mission.body", v)} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextInput label="CTA Text" value={form.mission?.ctaText} onChange={(v) => updateField("mission.ctaText", v)} />
                    <TextInput label="CTA URL" value={form.mission?.ctaUrl} onChange={(v) => updateField("mission.ctaUrl", v)} placeholder="/about" />
                  </div>
                </div>
              </Section>

              {/* News */}
              <Section title="News" subtitle="Cards shown in the Latest News grid">
                <div className="space-y-4">
                  {isEmpty(form.news) && (
                    <div className="text-sm text-gray-500">No news yet. Add your first item.</div>
                  )}
                  {form.news.map((n, i) => (
                    <div key={`news-${i}`} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Chip>News #{i + 1}</Chip>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => moveItem("news", i, -1)} className="text-xs px-2 py-1 rounded border">↑</button>
                          <button type="button" onClick={() => moveItem("news", i, +1)} className="text-xs px-2 py-1 rounded border">↓</button>
                          <button type="button" onClick={() => removeFromList("news", i)} className="text-xs px-2 py-1 rounded border text-red-600">Delete</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <TextInput label="Title" value={n.title} onChange={(v) => updateListItem("news", i, "title", v)} />
                        <TextInput label="Image URL" value={n.image} onChange={(v) => updateListItem("news", i, "image", v)} placeholder="https://… or /images/foo.jpg" />
                        <TextInput label="Link URL (optional)" value={n.linkUrl} onChange={(v) => updateListItem("news", i, "linkUrl", v)} placeholder="https://… or /news/slug" />
                        <TextArea label="Description" rows={4} value={n.description} onChange={(v) => updateListItem("news", i, "description", v)} />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addToList("news", { title: "", description: "", image: "", linkUrl: "" })} className="h-9 px-3 rounded-md bg-gray-900 text-white text-sm">Add News</button>
                </div>
              </Section>
            </div>

            {/* RIGHT: Announcements / Sponsors / Banners */}
            <div className="lg:col-span-3 space-y-6">
              {/* Announcements */}
              <Section title="Announcements" subtitle="Short messages shown in the Announcements box">
                <div className="space-y-3">
                  {(form.announcements || []).map((a, i) => (
                    <div key={`ann-${i}`} className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-md border border-gray-300 h-10 px-3 text-sm"
                        value={a}
                        onChange={(e) => updateListItem("announcements", i, null, e.target.value)}
                      />
                      <button type="button" className="text-xs px-2 py-1 rounded border" onClick={() => moveItem("announcements", i, -1)}>↑</button>
                      <button type="button" className="text-xs px-2 py-1 rounded border" onClick={() => moveItem("announcements", i, +1)}>↓</button>
                      <button type="button" className="text-xs px-2 py-1 rounded border text-red-600" onClick={() => removeFromList("announcements", i)}>Del</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addToList("announcements", "")} className="h-9 px-3 rounded-md bg-gray-900 text-white text-sm">Add Announcement</button>
                </div>
              </Section>

              {/* Sponsors / Ads */}
              <Section title="Sponsors" subtitle="Logo cards shown in the Sponsors box">
                <div className="space-y-4">
                  {isEmpty(form.ads) && <div className="text-sm text-gray-500">No sponsors yet.</div>}
                  {form.ads.map((ad, i) => (
                    <div key={`ad-${i}`} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Chip>Sponsor #{i + 1}</Chip>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => moveItem("ads", i, -1)} className="text-xs px-2 py-1 rounded border">↑</button>
                          <button type="button" onClick={() => moveItem("ads", i, +1)} className="text-xs px-2 py-1 rounded border">↓</button>
                          <button type="button" onClick={() => removeFromList("ads", i)} className="text-xs px-2 py-1 rounded border text-red-600">Delete</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <TextInput label="ID" value={ad.id} onChange={(v) => updateListItem("ads", i, "id", v)} placeholder="unique-id" />
                        <TextInput label="Label" value={ad.label} onChange={(v) => updateListItem("ads", i, "label", v)} placeholder="Sponsor name" />
                        <TextInput label="Link URL" value={ad.linkUrl} onChange={(v) => updateListItem("ads", i, "linkUrl", v)} placeholder="https://…" />
                        <TextInput label="Image URL" value={ad.imageUrl} onChange={(v) => updateListItem("ads", i, "imageUrl", v)} placeholder="/images/logo.png" />
                        <div className="grid grid-cols-2 gap-3">
                          <TextInput label="Type (logo/banner)" value={ad.type || "logo"} onChange={(v) => updateListItem("ads", i, "type", v)} />
                          <TextInput label="Fit (contain/cover)" value={ad.fit || "contain"} onChange={(v) => updateListItem("ads", i, "fit", v)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <TextInput label="Aspect Ratio" value={ad.aspectRatio || "3 / 1"} onChange={(v) => updateListItem("ads", i, "aspectRatio", v)} placeholder="e.g. 3 / 1" />
                          <TextInput label="Padding (px)" type="number" value={ad.padding ?? 8} onChange={(v) => updateListItem("ads", i, "padding", v)} />
                        </div>
                        <TextInput label="Background" value={ad.bg || "#ffffff"} onChange={(v) => updateListItem("ads", i, "bg", v)} placeholder="#ffffff" />
                        {ad.imageUrl && (
                          <div className="pt-1">
                            <div className="text-xs text-gray-500 mb-1">Preview</div>
                            <div className="w-full flex items-center justify-center" style={{ backgroundColor: ad.bg || '#fff', minHeight: '56px' }}>
                              <img src={ad.imageUrl} alt={ad.label || 'Logo preview'} className="max-h-16 object-contain" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addToList("ads", { id: "", label: "", linkUrl: "", imageUrl: "", type: "logo", fit: "contain", aspectRatio: "3 / 1", bg: "#ffffff", padding: 8 })} className="h-9 px-3 rounded-md bg-gray-900 text-white text-sm">Add Sponsor</button>
                </div>
              </Section>

              {/* Banners (optional general image URLs) */}
              <Section title="Banners" subtitle="Optional extra images (not the main hero)">
                <div className="space-y-3">
                  {(form.banners || []).map((b, i) => (
                    <div key={`ban-${i}`} className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-md border border-gray-300 h-10 px-3 text-sm"
                        value={b}
                        onChange={(e) => updateListItem("banners", i, null, e.target.value)}
                        placeholder="/images/banner.jpg or https://…"
                      />
                      <button type="button" className="text-xs px-2 py-1 rounded border" onClick={() => moveItem("banners", i, -1)}>↑</button>
                      <button type="button" className="text-xs px-2 py-1 rounded border" onClick={() => moveItem("banners", i, +1)}>↓</button>
                      <button type="button" className="text-xs px-2 py-1 rounded border text-red-600" onClick={() => removeFromList("banners", i)}>Del</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addToList("banners", "")} className="h-9 px-3 rounded-md bg-gray-900 text-white text-sm">Add Banner</button>
                </div>
              </Section>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm">
            {error && <span className="text-red-600 mr-3">{error}</span>}
            {success && <span className="text-green-700">{success}</span>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => navigate(-1)}
              className="h-10 px-4 rounded-md border border-gray-300 text-sm"
            >Cancel</button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="h-10 px-4 rounded-md bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
            >{saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </div>
      </main>
      </div>

      {/* Modal renders at root */}
      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <PreviewPane form={form} nextEvent={nextEvent} onRefreshNextEvent={fetchNextEvent} />
      </PreviewModal>

      <Footer />
    </>
  );
}
