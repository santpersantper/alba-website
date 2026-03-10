import phoneMockup from "@/assets/phone-mockup.png";

const HeroSection = () => (
  <section className="alba-section pt-32 md:pt-40 alba-gradient min-h-[90vh] flex items-center">
    <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 md:gap-16">
      <div className="flex-1 text-center md:text-left">
        <h1 className="alba-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
          Social media,<br />without the toxic part.
        </h1>
        <p className="alba-subheading mt-6 max-w-xl mx-auto md:mx-0">
          Discover events happening near you, spend less time on your phone, and connect with the people around you. Launching in Milan.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <a href="#waitlist" className="alba-btn-primary text-center">Join the Waitlist</a>
          <a href="#for-users" className="alba-btn-ghost text-center">Learn More</a>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <img
          src={phoneMockup}
          alt="Alba app showing local events in Milan"
          className="w-64 md:w-80 drop-shadow-2xl"
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
