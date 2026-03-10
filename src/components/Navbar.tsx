import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "For Users", href: "#for-users" },
    { label: "For Organizers", href: "#for-organizers" },
    { label: "For Businesses", href: "#for-businesses" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <i className="fa-solid fa-sun text-primary text-2xl" aria-hidden="true"></i>
          <span className="text-xl font-bold text-primary">Alba</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#waitlist" className="alba-btn-primary text-sm py-2 px-6">Join Waitlist</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4 space-y-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-foreground/70 hover:text-primary py-2">
              {l.label}
            </a>
          ))}
          <a href="#waitlist" onClick={() => setMenuOpen(false)} className="alba-btn-primary text-sm py-2 px-6 inline-block">Join Waitlist</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
