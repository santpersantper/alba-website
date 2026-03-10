import { useState, type FormEvent } from "react";

const WaitlistSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="py-20 md:py-28 px-6 bg-primary">
      <div className="max-w-2xl mx-auto text-center text-primary-foreground fade-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Be the first to know when Alba launches.</h2>
        <p className="text-lg opacity-90 mb-8">Join our waitlist and get early access when we launch in Milan.</p>

        {submitted ? (
          <p className="text-xl font-semibold">You're on the list! We'll be in touch soon. ☀️</p>
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
            <button type="submit" className="rounded-full px-6 py-3 bg-background text-primary font-semibold text-sm hover:bg-background/90 transition-colors whitespace-nowrap">
              Join Waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default WaitlistSection;
