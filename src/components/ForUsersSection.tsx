const cards = [
  {
    icon: "fa-solid fa-map-location-dot",
    title: "Discover local events",
    desc: "See concerts, aperitivos, exhibitions and more happening within walking distance. No global noise, just your city.",
  },
  {
    icon: "fa-solid fa-hourglass-half",
    title: "Control your screen time",
    desc: "Set daily goals, track your usage across social media apps, and reduce it gradually — without going cold turkey.",
  },
  {
    icon: "fa-solid fa-people-group",
    title: "Meet people nearby",
    desc: "Join group chats for events you're attending, connect with others before and after, and build real local connections.",
  },
];

const ForUsersSection = () => (
  <section id="for-users" className="alba-section bg-background">
    <div className="max-w-7xl mx-auto">
      <h2 className="alba-heading text-center mb-14">For Users</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((c, i) => (
          <div key={i} className="fade-up bg-secondary/50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <i className={`${c.icon} text-primary text-xl`} aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold mb-3">{c.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ForUsersSection;
