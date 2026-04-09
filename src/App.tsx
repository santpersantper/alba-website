import { useState, useEffect, useRef, FormEvent } from "react";
import {
  Menu,
  X,
  MapPin,
  Clock,
  Users,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function App() {
  const SUPABASE_URL = "https://phoepkacbrtolqmlwkvw.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBob2Vwa2FjYnJ0b2xxbWx3a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDUxMjcsImV4cCI6MjA3NjE4MTEyN30.ZtrCsy3ReW0ctykXqt9YWy14oevyzWZSdYALYPDX8fo";

  const sendContactEmail = async (payload: Record<string, string>) => {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("send failed");
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [organizerSuccess, setOrganizerSuccess] = useState(false);
  const [businessSuccess, setBusinessSuccess] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const handleOrganizerSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;
    const fd = new FormData(form);
    try {
      await sendContactEmail({
        type: "organizer",
        name: fd.get("organizer-name") as string,
        org: fd.get("organizer-org") as string,
        email: fd.get("organizer-email") as string,
        message: fd.get("organizer-events") as string,
      });
    } catch {
      // show success regardless — email is best-effort
    }
    setOrganizerSuccess(true);
    form.reset();
    setTimeout(() => setOrganizerSuccess(false), 5000);
  };

  const handleBusinessSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;
    const fd = new FormData(form);
    try {
      await sendContactEmail({
        type: "business",
        name: fd.get("business-name") as string,
        org: fd.get("business-org") as string,
        email: fd.get("business-email") as string,
        message: fd.get("business-advertise") as string,
      });
    } catch {
      // show success regardless — email is best-effort
    }
    setBusinessSuccess(true);
    form.reset();
    setTimeout(() => setBusinessSuccess(false), 5000);
  };

  const handleWaitlistSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;
    const fd = new FormData(form);
    try {
      await sendContactEmail({
        type: "newsletter",
        email: fd.get("waitlist-email") as string,
      });
    } catch {
      // show success regardless — email is best-effort
    }
    setWaitlistSuccess(true);
    form.reset();
    setTimeout(() => setWaitlistSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          text-transform: lowercase;
        }

        html {
          scroll-behavior: smooth;
        }

        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }

        input:focus, textarea:focus, button:focus {
          outline: 2px solid #0ea5e9;
          outline-offset: 2px;
        }

        .nav-link:hover {
          color: #0ea5e9;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .play-button:hover {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .hero-heading {
            font-size: 2.5rem !important;
          }
        }

        @media (max-width: 480px) {
          .hero-heading {
            font-size: 2rem !important;
          }
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50">
        <nav className="max-w-[1280px] mx-auto px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 text-2xl font-bold text-sky-500"
            aria-label="alba"
          >
            <img
              src="/icon.png"
              alt=""
              className="w-8 h-8"
              aria-hidden="true"
            />
            <span>alba</span>
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-10">
            <li>
              <button
                onClick={() => scrollToSection("users")}
                className="nav-link font-semibold transition-colors"
              >
                for users
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("organizers")}
                className="nav-link font-semibold transition-colors"
              >
                for organizers
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("businesses")}
                className="nav-link font-semibold transition-colors"
              >
                for businesses
              </button>
            </li>
            <li>
              <a
                href="https://apps.apple.com/it/app/alba/id6759857131"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30"
              >
                join alba
              </a>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-sky-500" />
            ) : (
              <Menu className="w-6 h-6 text-sky-500" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <ul className="flex flex-col p-6 gap-9">
              <li>
                <button
                  onClick={() => scrollToSection("users")}
                  className="w-full text-center py-4 font-semibold hover:text-sky-500 transition-colors"
                >
                  for users
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("organizers")}
                  className="w-full text-center py-4 font-semibold hover:text-sky-500 transition-colors"
                >
                  for organizers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("businesses")}
                  className="w-full text-center py-4 font-semibold hover:text-sky-500 transition-colors"
                >
                  for businesses
                </button>
              </li>
              <li>
                <a
                  href="https://apps.apple.com/it/app/alba/id6759857131"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition-colors whitespace-nowrap block text-center"
                >
                  join alba
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="pt-40 pb-48 px-8 bg-gradient-to-br from-sky-50 to-white"
      >
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="fade-in order-2 md:order-1">
            <h1 className="hero-heading text-5xl md:text-6xl font-extrabold mb-8 text-slate-900 leading-tight">
              social media, without the toxic part.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              discover events and things to do near you, spend
              less time on your phone, and connect with the
              people around you. launching in milan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://apps.apple.com/it/app/alba/id6759857131"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30 whitespace-nowrap text-center"
              >
                join alba
              </a>
              <button
                onClick={() => scrollToSection("users")}
                className="bg-transparent text-sky-500 border-2 border-sky-500 px-8 py-3 rounded-full font-semibold hover:bg-sky-500 hover:text-white transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                learn more
              </button>
            </div>
          </div>
          <div className="fade-in order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-[340px] rounded-2xl overflow-hidden shadow-2xl bg-slate-900" style={{ aspectRatio: "9/16" }}>
              <iframe
                src="https://www.youtube.com/embed/UV_sTo1Ha4o"
                title="alba preview video"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* For Users Section */}
      <section
        id="users"
        className="py-64 px-8 bg-white fade-in"
      >
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl font-bold text-center mb-20 text-slate-900">
            for users
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="feature-card p-10 bg-slate-50 rounded-2xl transition-all">
              <MapPin className="w-12 h-12 text-sky-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-slate-900">
                discover events
              </h3>
              <p className="text-slate-600 leading-relaxed">
                see concerts, aperitivos, exhibitions and more
                happening within walking distance.
              </p>
            </div>
            <div className="feature-card p-10 bg-slate-50 rounded-2xl transition-all">
              <Clock className="w-12 h-12 text-sky-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-slate-900">
                control your screen time
              </h3>
              <p className="text-slate-600 leading-relaxed">
                set daily goals, track your usage across social
                media apps, and reduce it gradually.
              </p>
            </div>
            <div className="feature-card p-10 bg-slate-50 rounded-2xl transition-all">
              <Users className="w-12 h-12 text-sky-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-slate-900">
                meet people nearby
              </h3>
              <p className="text-slate-600 leading-relaxed">
                join group chats for events you're attending,
                connect with others before and after.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Organizers Section */}
      <section
        id="organizers"
        className="py-64 px-8 bg-slate-50 fade-in"
      >
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-10 text-slate-900">
              reach your local audience directly
            </h2>
            <ul className="space-y-6 mb-8">
              <li className="flex gap-4 text-slate-600 leading-relaxed">
                <span className="text-sky-500 font-bold text-xl flex-shrink-0">
                  ✓
                </span>
                <span>
                  post your events to a geo-targeted feed of
                  users in your area
                </span>
              </li>
              <li className="flex gap-4 text-slate-600 leading-relaxed">
                <span className="text-sky-500 font-bold text-xl flex-shrink-0">
                  ✓
                </span>
                <span>
                  sell tickets directly in-app with instant
                  checkout
                </span>
              </li>
              <li className="flex gap-4 text-slate-600 leading-relaxed">
                <span className="text-sky-500 font-bold text-xl flex-shrink-0">
                  ✓
                </span>
                <span>
                  connect with attendees via dedicated event
                  group chats
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-8 text-slate-900">
              get in touch, we'd love to feature your events on
              alba.
            </h3>
            {organizerSuccess && (
              <div className="bg-green-100 text-green-800 p-5 rounded-lg mb-6">
                your message has been sent! we'll be in touch
                soon. ✨
              </div>
            )}
            <form
              onSubmit={handleOrganizerSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="organizer-name"
                  className="block font-semibold mb-3 text-sm"
                >
                  name
                </label>
                <input
                  type="text"
                  id="organizer-name"
                  required
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-lg focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="organizer-org"
                  className="block font-semibold mb-3 text-sm"
                >
                  organization name
                </label>
                <input
                  type="text"
                  id="organizer-org"
                  required
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-lg focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="organizer-email"
                  className="block font-semibold mb-3 text-sm"
                >
                  email
                </label>
                <input
                  type="email"
                  id="organizer-email"
                  required
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-lg focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="organizer-events"
                  className="block font-semibold mb-3 text-sm"
                >
                  tell us about your events
                </label>
                <textarea
                  id="organizer-events"
                  required
                  rows={4}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-lg focus:border-sky-500 transition-colors resize-y"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition-colors whitespace-nowrap"
              >
                submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* For Businesses Section */}
      <section
        id="businesses"
        className="py-64 px-8 bg-white fade-in"
      >
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-10 text-slate-900">
              advertise to the audience that's right next to
              you.
            </h2>
            <ul className="space-y-6 mb-8">
              <li className="flex gap-4 text-slate-600 leading-relaxed">
                <span className="text-sky-500 font-bold text-xl flex-shrink-0">
                  ✓
                </span>
                <span>
                  run geo-targeted ads that only reach users who
                  have opted into your category
                </span>
              </li>
              <li className="flex gap-4 text-slate-600 leading-relaxed">
                <span className="text-sky-500 font-bold text-xl flex-shrink-0">
                  ✓
                </span>
                <span>
                  track performance with a full analytics
                  dashboard, impressions, clicks, engagement
                </span>
              </li>
              <li className="flex gap-4 text-slate-600 leading-relaxed">
                <span className="text-sky-500 font-bold text-xl flex-shrink-0">
                  ✓
                </span>
                <span>
                  no wasted spend on irrelevant audiences, your
                  budget reaches locals who care
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-50 p-10 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-8 text-slate-900">
              interested in advertising on alba? let's talk.
            </h3>
            {businessSuccess && (
              <div className="bg-green-100 text-green-800 p-5 rounded-lg mb-6">
                thanks for your interest! we'll reach out
                shortly. 🚀
              </div>
            )}
            <form
              onSubmit={handleBusinessSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="business-name"
                  className="block font-semibold mb-3 text-sm"
                >
                  name
                </label>
                <input
                  type="text"
                  id="business-name"
                  required
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-lg focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="business-org"
                  className="block font-semibold mb-3 text-sm"
                >
                  business name
                </label>
                <input
                  type="text"
                  id="business-org"
                  required
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-lg focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="business-email"
                  className="block font-semibold mb-3 text-sm"
                >
                  email
                </label>
                <input
                  type="email"
                  id="business-email"
                  required
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-lg focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="business-advertise"
                  className="block font-semibold mb-3 text-sm"
                >
                  what would you like to advertise?
                </label>
                <textarea
                  id="business-advertise"
                  required
                  rows={4}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-lg focus:border-sky-500 transition-colors resize-y"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition-colors whitespace-nowrap"
              >
                submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section
        id="waitlist"
        className="py-64 px-8 bg-sky-500 text-white fade-in"
      >
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            stay in the loop.
          </h2>
          <p className="text-xl mb-10 opacity-90">
            subscribe to our newsletter for updates, features,
            and everything happening on alba.
          </p>
          {waitlistSuccess && (
            <div className="max-w-[600px] mx-auto bg-white text-sky-500 p-5 rounded-lg mb-6 font-semibold">
              you're subscribed! ☀️
            </div>
          )}
          <form
            onSubmit={handleWaitlistSubmit}
            className="max-w-[600px] mx-auto flex flex-col sm:flex-row gap-5"
          >
            <input
              type="email"
              name="waitlist-email"
              required
              placeholder="enter your email"
              className="flex-1 px-6 py-5 rounded-full text-slate-900 focus:outline-white"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-white text-sky-500 px-12 py-5 rounded-full font-semibold hover:bg-slate-50 transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 mb-16">
            <div>
            <div className="flex items-center gap-3 text-2xl font-bold text-sky-500 mb-6">
              <img
                src="/icon.png"
                alt=""
                className="w-8 h-8"
                aria-hidden="true"
              />
              <span>alba</span>
            </div>
              <p className="text-slate-400">
                social media, without the toxic part.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">navigation</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("users")}
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    for users
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      scrollToSection("organizers")
                    }
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    for organizers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      scrollToSection("businesses")
                    }
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    for businesses
                  </button>
                </li>
                <li>
                  <a
                    href="https://apps.apple.com/it/app/alba/id6759857131"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    join alba
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/privacy/"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    privacy policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms/"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    terms of service
                  </a>
                </li>
                <li>
                  <a
                    href="/refunds/"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    refund policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">follow us</h4>
              <div className="flex gap-5">
                <a
                  href="https://instagram.com/albaappofficial"
                  aria-label="Instagram"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://x.com/albaappofficial"
                  aria-label="X"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M4.2 3h3.1l4.4 6.4L16.9 3H20l-5.8 8.2L20 21h-3.1l-4.7-6.8L7.3 21H4.2l6.2-9.1L4.2 3z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/albaappofficial"
                  aria-label="LinkedIn"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
              <h4 className="font-bold mt-8 mb-4">contact us</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a href="mailto:support@albaappofficial.com" className="hover:text-sky-400 transition-colors">
                    support@albaappofficial.com
                  </a>
                </li>
                <li>
                  <a href="tel:+4367846265741" className="hover:text-sky-400 transition-colors">
                    +43 678 46265741
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-10 text-center text-slate-400">
            © 2025 alba. made in milan. 🇮🇹
          </div>
        </div>
      </footer>
    </div>
  );
}
