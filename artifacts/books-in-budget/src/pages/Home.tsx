import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Search, ArrowRight, BookOpen, TrendingUp, Tag, Star } from "lucide-react";
import {
  useGetFeaturedBooks,
  useGetTrendingBooks,
  useGetBudgetBooks,
  useListCategories,
  useGetBooksStats,
  getGetFeaturedBooksQueryKey,
  getGetTrendingBooksQueryKey,
  getGetBudgetBooksQueryKey,
  getListCategoriesQueryKey,
  getGetBooksStatsQueryKey,
} from "@workspace/api-client-react";
import BookCard from "@/components/BookCard";
import BookSkeleton from "@/components/BookSkeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

const CATEGORY_ICONS: Record<string, string> = {
  fiction: "📚",
  "non-fiction": "🔍",
  science: "🔬",
  history: "🏛",
  biography: "👤",
  technology: "💻",
  philosophy: "🧠",
  romance: "💝",
  mystery: "🕵",
  fantasy: "✨",
  "self-help": "🌱",
  business: "💼",
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: stats } = useGetBooksStats({ query: { queryKey: getGetBooksStatsQueryKey() } });
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedBooks(
    { limit: 8 },
    { query: { queryKey: getGetFeaturedBooksQueryKey({ limit: 8 }) } }
  );
  const { data: trending, isLoading: trendingLoading } = useGetTrendingBooks(
    { limit: 8 },
    { query: { queryKey: getGetTrendingBooksQueryKey({ limit: 8 }) } }
  );
  const { data: budget, isLoading: budgetLoading } = useGetBudgetBooks(
    { maxPrice: 199, limit: 8 },
    { query: { queryKey: getGetBudgetBooksQueryKey({ maxPrice: 199, limit: 8 }) } }
  );
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-background to-orange-50 dark:from-gray-900 dark:via-background dark:to-amber-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-20 rounded-lg bg-primary/10 shadow-lg"
              style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
              animate={{
                y: [0, -20, 0],
                rotate: [i % 2 === 0 ? -5 : 5, i % 2 === 0 ? 5 : -5, i % 2 === 0 ? -5 : 5],
              }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-24">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              Over {stats?.totalBooks ?? "1000"}+ books available
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Books That Fit
            <br />
            <span className="text-primary">Every Budget</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Discover thousands of premium books at prices that actually make sense.
            From bestsellers to hidden gems — all under &#8377;199.
          </motion.p>

          <motion.form
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex gap-2 max-w-lg mx-auto"
          >
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 shadow-md">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                data-testid="input-hero-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, categories..."
                className="flex-1 py-3 bg-transparent text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              data-testid="button-hero-search"
              className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-md"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12"
          >
            {[
              { id: "books", icon: BookOpen, label: `${stats?.totalBooks ?? 0} Books`, sub: "in collection" },
              { id: "avg", icon: Tag, label: `Avg ₹${stats?.avgPrice ?? 0}`, sub: "per book" },
              { id: "trending", icon: TrendingUp, label: `${stats?.trendingCount ?? 0}`, sub: "trending now" },
              { id: "cats", icon: Star, label: `${stats?.totalCategories ?? 0}`, sub: "categories" },
            ].map(({ id, icon: Icon, label, sub }) => (
              <motion.div key={id} variants={fadeUp} className="text-center">
                <div className="flex items-center gap-2 text-foreground font-bold text-lg">
                  <Icon size={18} className="text-primary" />
                  {label}
                </div>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-foreground/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Banner */}
      <section className="bg-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: `${stats?.booksUnder199 ?? 0}+`, label: "Books Under ₹199" },
              { value: `${stats?.featuredCount ?? 0}+`, label: "Editor's Picks" },
              { value: `${stats?.trendingCount ?? 0}+`, label: "Trending Now" },
              { value: `${stats?.totalCategories ?? 0}+`, label: "Categories" },
            ].map(({ value, label }) => (
              <motion.div
                key={label}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-bold font-serif">{value}</div>
                <div className="text-white/80 text-sm mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <Section
        title="Editor's Picks"
        subtitle="Handpicked for your reading pleasure"
        href="/books?featured=true"
      >
        <BookGrid books={featured ?? []} loading={featuredLoading} />
      </Section>

      {/* Budget Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/10 dark:to-background">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Books Under ₹199"
            subtitle="Premium reads that won't empty your wallet"
            href="/books?maxPrice=199"
            badge="Budget Picks"
          />
          <BookGrid books={budget ?? []} loading={budgetLoading} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <SectionHeader title="Browse by Category" subtitle="Find your perfect genre" />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {(categories ?? []).map((cat) => (
            <motion.div key={cat.name} variants={fadeUp}>
              <button
                data-testid={`button-category-${cat.slug}`}
                onClick={() => setLocation(`/books?category=${encodeURIComponent(cat.name)}`)}
                className="w-full bg-card border border-card-border rounded-2xl p-5 text-center hover:border-primary hover:shadow-md transition-all duration-200 group"
              >
                <div className="text-3xl mb-2">
                  {CATEGORY_ICONS[cat.slug] ?? "📖"}
                </div>
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors capitalize">
                  {cat.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{cat.bookCount} books</div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trending Books */}
      <Section
        title="Trending Now"
        subtitle="What readers are loving this week"
        href="/books?trending=true"
        bg
      >
        <BookGrid books={trending ?? []} loading={trendingLoading} />
      </Section>

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          viewport={{ once: true }}
          className="bg-primary rounded-3xl px-8 py-16 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-transparent" />
          <div className="relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Start Reading Today</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Browse our entire collection and find your next favorite book at a price you'll love.
            </p>
            <button
              data-testid="button-cta-browse"
              onClick={() => setLocation("/books")}
              className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-2"
            >
              Browse All Books
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

function Section({
  title, subtitle, href, children, bg,
}: {
  title: string;
  subtitle: string;
  href?: string;
  children: React.ReactNode;
  bg?: boolean;
}) {
  return (
    <section className={`py-20 ${bg ? "bg-muted/30" : ""}`}>
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title={title} subtitle={subtitle} href={href} />
        {children}
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle, href, badge }: {
  title: string;
  subtitle: string;
  href?: string;
  badge?: string;
}) {
  const [, setLocation] = useLocation();
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      className="flex items-end justify-between mb-10"
    >
      <div>
        {badge && (
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
            {badge}
          </span>
        )}
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {href && (
        <button
          data-testid={`button-view-all-${title.toLowerCase().replace(/\s+/g, "-")}`}
          onClick={() => setLocation(href)}
          className="hidden sm:flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
        >
          View all <ArrowRight size={16} />
        </button>
      )}
    </motion.div>
  );
}

function BookGrid({ books, loading }: { books: Parameters<typeof BookCard>[0]["book"][]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => <BookSkeleton key={i} />)}
      </div>
    );
  }
  return (
    <motion.div
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
    >
      {books.map((book) => (
        <motion.div key={book.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <BookCard book={book} />
        </motion.div>
      ))}
    </motion.div>
  );
}
