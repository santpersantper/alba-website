const AlbaFooter = () => (
  <footer className="bg-alba-footer text-primary-foreground py-16 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <i className="fa-solid fa-sun text-primary text-xl" aria-hidden="true" />
          <span className="text-lg font-bold">Alba</span>
        </div>
        <p className="text-sm opacity-70">Social media, without the toxic part.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-60">Navigation</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#for-users" className="opacity-70 hover:opacity-100 transition-opacity">For Users</a></li>
          <li><a href="#for-organizers" className="opacity-70 hover:opacity-100 transition-opacity">For Organizers</a></li>
          <li><a href="#for-businesses" className="opacity-70 hover:opacity-100 transition-opacity">For Businesses</a></li>
          <li><a href="#waitlist" className="opacity-70 hover:opacity-100 transition-opacity">Join Waitlist</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-60">Legal</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="/privacy" className="opacity-70 hover:opacity-100 transition-opacity">Privacy Policy</a></li>
          <li><a href="/terms" className="opacity-70 hover:opacity-100 transition-opacity">Terms of Service</a></li>
          <li><a href="/refunds" className="opacity-70 hover:opacity-100 transition-opacity">Refund Policy</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-60">Socials</h4>
        <div className="flex gap-4 text-xl">
          <a href="#" aria-label="Instagram" className="opacity-70 hover:opacity-100 transition-opacity"><i className="fa-brands fa-instagram" /></a>
          <a href="#" aria-label="TikTok" className="opacity-70 hover:opacity-100 transition-opacity"><i className="fa-brands fa-tiktok" /></a>
          <a href="#" aria-label="LinkedIn" className="opacity-70 hover:opacity-100 transition-opacity"><i className="fa-brands fa-linkedin" /></a>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-primary-foreground/10 text-center text-sm opacity-60">
      © 2025 Alba. Made in Milan. 🇮🇹
    </div>
  </footer>
);

export default AlbaFooter;
