import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  MessageCircle,
  Clock,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const CONTACT = {
  whatsapp: "+919876543210",
  whatsappDisplay: "+91 98765 43210",
  phone: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  email: "hello@booksinbudget.in",
  instagram: "booksinbudget",
  instagramUrl: "https://instagram.com/booksinbudget",
  location: "Bandra West, Mumbai, Maharashtra 400050",
  hours: "Mon–Sat: 10 AM – 8 PM | Sun: 11 AM – 6 PM",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Contact() {
  const whatsappMsg = encodeURIComponent(
    "Hi! I'd like to order a book from Books In Budget. Please help me."
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-primary font-medium text-sm uppercase tracking-widest mb-3">
            Get In Touch
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Contact Us
          </motion.h1>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
            Reach us on WhatsApp, Instagram, or email — we typically respond within minutes.
          </motion.p>
        </motion.div>

        {/* Primary CTA cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {/* WhatsApp */}
          <motion.a
            variants={fadeUp}
            href={`https://wa.me/${CONTACT.whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col items-center gap-4 bg-[#25D366] text-white rounded-2xl p-7 shadow-lg hover:shadow-2xl hover:shadow-[#25D366]/30 transition-shadow cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <MessageCircle size={28} />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">Order on WhatsApp</p>
              <p className="text-white/80 text-sm mt-1">{CONTACT.whatsappDisplay}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 rounded-full px-4 py-1.5 group-hover:bg-white/30 transition-colors">
              Chat Now <ArrowRight size={14} />
            </div>
          </motion.a>

          {/* Instagram */}
          <motion.a
            variants={fadeUp}
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col items-center gap-4 rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              color: "white",
            }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Instagram size={28} />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">Message on Instagram</p>
              <p className="text-white/80 text-sm mt-1">@{CONTACT.instagram}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 rounded-full px-4 py-1.5 group-hover:bg-white/30 transition-colors">
              Follow Us <ExternalLink size={13} />
            </div>
          </motion.a>

          {/* Phone */}
          <motion.a
            variants={fadeUp}
            href={`tel:${CONTACT.phone}`}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col items-center gap-4 bg-primary text-white rounded-2xl p-7 shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-shadow cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Phone size={28} />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">Call Now</p>
              <p className="text-white/80 text-sm mt-1">{CONTACT.phoneDisplay}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 rounded-full px-4 py-1.5 group-hover:bg-white/30 transition-colors">
              Call Now <ArrowRight size={14} />
            </div>
          </motion.a>
        </motion.div>

        {/* Info row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Email */}
          <motion.a
            variants={fadeUp}
            href={`mailto:${CONTACT.email}`}
            whileHover={{ y: -3 }}
            className="flex items-start gap-4 bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Mail size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Email Us</p>
              <p className="text-sm text-muted-foreground mt-0.5 break-all">{CONTACT.email}</p>
            </div>
          </motion.a>

          {/* Location */}
          <motion.a
            variants={fadeUp}
            href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            className="flex items-start gap-4 bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Visit Our Store</p>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{CONTACT.location}</p>
            </div>
          </motion.a>

          {/* Hours */}
          <motion.div
            variants={fadeUp}
            className="flex items-start gap-4 bg-card border border-border rounded-2xl p-6"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Clock size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Business Hours</p>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{CONTACT.hours}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* WhatsApp order CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(25,90%,48%) 0%, hsl(35,90%,55%) 100%)",
          }}
        >
          <div className="px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-white text-center sm:text-left">
              <h2 className="font-serif font-bold text-2xl mb-1">Ready to order?</h2>
              <p className="text-white/85 text-sm">
                Drop us a WhatsApp message and we'll confirm your order in minutes.
              </p>
            </div>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 bg-white text-primary font-bold px-7 py-3 rounded-xl hover:bg-white/90 active:scale-95 transition-all shadow-lg"
            >
              <MessageCircle size={18} />
              Order on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
