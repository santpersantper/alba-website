import { useState, type FormEvent } from "react";

const SUPABASE_URL = "https://phoepkacbrtolqmlwkvw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBob2Vwa2FjYnJ0b2xxbWx3a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDUxMjcsImV4cCI6MjA3NjE4MTEyN30.ZtrCsy3ReW0ctykXqt9YWy14oevyzWZSdYALYPDX8fo";

interface ContactFormProps {
  heading: string;
  orgLabel: string;
  textareaLabel: string;
  type: "organizer" | "business";
}

const ContactForm = ({ heading, orgLabel, textareaLabel, type }: ContactFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (form: FormData) => {
    const errs: Record<string, string> = {};
    if (!form.get("name")) errs.name = "Name is required.";
    if (!form.get("org")) errs.org = `${orgLabel} is required.`;
    const email = form.get("email") as string;
    if (!email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    if (!form.get("message")) errs.message = "This field is required.";
    return errs;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({
          type,
          name: fd.get("name") as string,
          org: fd.get("org") as string,
          email: fd.get("email") as string,
          message: fd.get("message") as string,
        }),
      });
    } catch {
      // show success regardless — email is best-effort
    } finally {
      setLoading(false);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-secondary/50 rounded-2xl p-8 text-center">
        <p className="text-lg font-semibold text-primary">Thanks! We'll be in touch soon. ☀️</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{heading}</h3>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <input name="name" placeholder="Name" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input name="org" placeholder={orgLabel} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          {errors.org && <p className="text-destructive text-xs mt-1">{errors.org}</p>}
        </div>
        <div>
          <input name="email" type="email" placeholder="Email" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <textarea name="message" rows={4} placeholder={textareaLabel} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="alba-btn-primary w-full text-sm disabled:opacity-60">
          {loading ? "Sending…" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
