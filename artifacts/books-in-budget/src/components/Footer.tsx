import { BookOpen, Instagram, MessageCircle, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const CONTACT = {
  whatsapp: "+919876543210",
  whatsappDisplay: "+91 98765 43210",
  phone: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  email: "hello@booksinbudget.in",
  instagram: "booksinbudget",
  instagramUrl: "https://instagram.com/booksinbudget",
  location: "Bandra West, Mumbai, MH 400050",
};

const WHATSAPP_MSG = encodeURIComponent("Hi! I'd like to order a book from Books In Budget.");

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand + tagline */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="font-serif font-bold text-xl">
                Books<span className="text-primary">In</span>Budget
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Premium books at prices that actually make sense. Your next great read starts here.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:text-white transition-all hover:scale-110"
                style={{ background: undefined }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(135deg,#f09433,#dc2743,#bc1888)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${WHATSAPP_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:bg-[#25D366] hover:text-white transition-all hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:bg-primary hover:text-white transition-all hover:scale-110"
                aria-label="Call"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/books"><span className="hover:text-primary transition-colors cursor-pointer">All Books</span></Link></li>
              <li><Link href="/books?featured=true"><span className="hover:text-primary transition-colors cursor-pointer">Featured</span></Link></li>
              <li><Link href="/books?trending=true"><span className="hover:text-primary transition-colors cursor-pointer">Trending</span></Link></li>
              <li><Link href="/books?maxPrice=199"><span className="hover:text-primary transition-colors cursor-pointer">Under ₹199</span></Link></li>
              <li><Link href="/wishlist"><span className="hover:text-primary transition-colors cursor-pointer">My Wishlist</span></Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${WHATSAPP_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#25D366] transition-colors group"
                >
                  <MessageCircle size={14} className="text-[#25D366] shrink-0" />
                  <span>{CONTACT.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone size={14} className="text-primary shrink-0" />
                  <span>{CONTACT.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail size={14} className="text-primary shrink-0" />
                  <span className="break-all">{CONTACT.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-primary transition-colors"
                >
                  <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                  <span>{CONTACT.location}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Order CTA */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Order Now</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${WHATSAPP_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center bg-[#25D366] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1ebe5c] transition-colors shadow-sm"
              >
                <MessageCircle size={16} /> Order on WhatsApp
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-2 justify-center bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Phone size={16} /> Call Now
              </a>
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center border border-border text-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors"
              >
                <Instagram size={16} /> @{CONTACT.instagram} <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BooksInBudget. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with love for book lovers in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
