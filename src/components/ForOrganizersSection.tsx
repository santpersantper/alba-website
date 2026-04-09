import ContactForm from "./ContactForm";

const bullets = [
  "Post your events to a geo-targeted feed of users in your area",
  "Sell tickets directly in-app with instant checkout",
  "Connect with attendees via dedicated event group chats",
];

const ForOrganizersSection = () => (
  <section id="for-organizers" className="alba-section alba-gradient">
    <div className="max-w-7xl mx-auto">
      <h2 className="alba-heading text-center mb-14">For Event Organizers</h2>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="fade-up">
          <h3 className="text-2xl font-bold mb-6">Reach your local audience directly</h3>
          <ul className="space-y-4">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <i className="fa-solid fa-check-circle text-primary mt-1" aria-hidden="true" />
                <span className="text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="fade-up">
          <ContactForm
            type="organizer"
            heading="Get in touch, we'd love to feature your events on Alba."
            orgLabel="Organization name"
            textareaLabel="Tell us about your events"
          />
        </div>
      </div>
    </div>
  </section>
);

export default ForOrganizersSection;
