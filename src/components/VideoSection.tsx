const VideoSection = () => (
  <section className="alba-section bg-background" id="video">
    <div className="max-w-4xl mx-auto text-center fade-up">
      <h2 className="alba-heading text-2xl md:text-3xl">See Alba in action</h2>
      <div className="mt-8 relative rounded-2xl overflow-hidden bg-muted aspect-video flex items-center justify-center cursor-pointer group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
        <button className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-110 transition-transform" aria-label="Play video">
          <i className="fa-solid fa-play text-2xl ml-1" />
        </button>
      </div>
      <p className="mt-6 alba-subheading text-base">
        Alba is currently in beta. Launching in Milan in 2025.
      </p>
    </div>
  </section>
);

export default VideoSection;
