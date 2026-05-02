import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, BookOpen, Search, Menu, X, Shield, MessageCircle, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const WHATSAPP = "+917666344835";
const WHATSAPP_MSG = encodeURIComponent("Hi! I'd like to order a book from Books In Budget.");

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Browse" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top contact strip */}
      <div className="hidden md:flex bg-primary text-white text-xs items-center justify-between px-6 py-1.5 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5 opacity-90">
            <Phone size={11} /> +91 7666344835
            <span className="mx-2 opacity-40">|</span>
            nandurkarprem11@gmail.com
          </span>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-full px-3 py-0.5 font-semibold transition-colors"
          >
            <MessageCircle size={11} /> Order on WhatsApp
          </a>
        </div>
      </div>

      <motion.nav
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "glass shadow-md" : "bg-transparent"
        }`}
        style={{ top: "28px" }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" data-testid="link-logo">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen size={18} className="text-white" />
                </div>
                <span className="font-serif font-bold text-xl text-foreground">
                  Books<span className="text-primary">In</span>Budget
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                  <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                    location === link.href ? "text-primary" : "text-foreground/70"
                  }`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* WhatsApp quick button - desktop */}
              <a
                href={`https://wa.me/${WHATSAPP}?text=${WHATSAPP_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#1ebe5c] transition-colors shadow-sm"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>

              <button
                data-testid="button-search-toggle"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
              >
                <Search size={20} />
              </button>

              <Link href="/wishlist" data-testid="link-wishlist">
                <div className="relative p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-foreground/70 hover:text-foreground">
                  <Heart size={20} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </div>
              </Link>

              <Link href="/cart" data-testid="link-cart">
                <div className="relative p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-foreground/70 hover:text-foreground">
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
              </Link>

              <Link href="/admin" data-testid="link-admin">
                <div className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-foreground/70 hover:text-foreground hidden md:flex">
                  <Shield size={18} />
                </div>
              </Link>

              <button
                data-testid="button-mobile-menu"
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-background/95 backdrop-blur"
            >
              <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 py-3 flex gap-2">
                <input
                  data-testid="input-search"
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors..."
                  className="flex-1 bg-muted rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  data-testid="button-search-submit"
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-y-0 right-0 w-72 bg-card border-l border-border z-50 flex flex-col p-6 shadow-2xl md:hidden"
          >
            <button
              data-testid="button-close-menu"
              onClick={() => setMenuOpen(false)}
              className="self-end p-2 rounded-lg hover:bg-muted mb-6"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col gap-1 flex-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium cursor-pointer ${
                      location === link.href ? "text-primary bg-primary/5" : ""
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link href="/admin">
                <span
                  data-testid="link-mobile-admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium cursor-pointer text-foreground/70"
                >
                  Admin
                </span>
              </Link>
            </div>

            {/* Mobile contact actions */}
            <div className="border-t border-border pt-6 flex flex-col gap-2">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${WHATSAPP_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 bg-[#25D366] text-white font-semibold px-4 py-3 rounded-xl hover:bg-[#1ebe5c] transition-colors"
              >
                <MessageCircle size={18} /> Order on WhatsApp
              </a>
              <a
                href="tel:+917666344835"
                className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Phone size={18} /> Call Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
