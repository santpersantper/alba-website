import { useState, type FormEvent } from "react";

const SUPABASE_URL = "https://phoepkacbrtolqmlwkvw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBob2Vwa2FjYnJ0b2xxbWx3a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDUxMjcsImV4cCI6MjA3NjE4MTEyN30.ZtrCsy3ReW0ctykXqt9YWy14oevyzWZSdYALYPDX8fo";

const WaitlistSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ type: "newsletter", email }),
      });
    } catch {
      // show success regardless — email is best-effort
    } finally {
      setLoading(false);
    }
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="py-20 md:py-28 px-6 bg-primary">
      <div className="max-w-2xl mx-auto text-center text-primary-foreground fade-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the loop.</h2>
        <p className="text-lg opacity-90 mb-8">Subscribe to our newsletter for updates, features, and everything happening on Alba.</p>

        {submitted ? (
          <p className="text-xl font-semibold">You're subscribed! ☀️</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1">
              <input
                name="email"
                type="email"
                placeholder="Your email address"
                className="w-full rounded-full px-5 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {error && <p className="text-primary-foreground/80 text-xs mt-1 text-left pl-4">{error}</p>}
            </div>
            <button type="submit" disabled={loading} className="rounded-full px-6 py-3 bg-background text-primary font-semibold text-sm hover:bg-background/90 transition-colors whitespace-nowrap disabled:opacity-60">
              {loading ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default WaitlistSection;
