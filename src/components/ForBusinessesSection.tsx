import ContactForm from "./ContactForm";

const bullets = [
  "Run geo-targeted ads that only reach users who have opted into your category",
  "Track performance with a full analytics dashboard — impressions, clicks, engagement",
  "No wasted spend on irrelevant audiences — your budget reaches locals who care",
];

const ForBusinessesSection = () => (
  <section id="for-businesses" className="alba-section bg-background">
    <div className="max-w-7xl mx-auto">
      <h2 className="alba-heading text-center mb-14">For Businesses</h2>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="fade-up">
          <h3 className="text-2xl font-bold mb-6">Advertise to the audience that's right next to you.</h3>
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
            type="business"
            heading="Interested in advertising on Alba? Let's talk."
            orgLabel="Business name"
            textareaLabel="What would you like to advertise?"
          />
        </div>
      </div>
    </div>
  </section>
);

export default ForBusinessesSection;
