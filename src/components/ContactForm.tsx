import { useState, type FormEvent } from "react";

interface ContactFormProps {
  heading: string;
  orgLabel: string;
  textareaLabel: string;
}

const ContactForm = ({ heading, orgLabel, textareaLabel }: ContactFormProps) => {
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
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
        <button type="submit" className="alba-btn-primary w-full text-sm">Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;
