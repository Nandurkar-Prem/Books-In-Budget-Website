import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useListBooks, useListCategories, getListBooksQueryKey, getListCategoriesQueryKey } from "@workspace/api-client-react";
import BookCard from "@/components/BookCard";
import BookSkeleton from "@/components/BookSkeleton";
import Footer from "@/components/Footer";

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "title", label: "Title A-Z" },
] as const;

function parseSearchParams(search: string) {
  const params = new URLSearchParams(search);
  return {
    searchQuery: params.get("search") ?? "",
    category: params.get("category") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    featured: params.get("featured") === "true" ? true : undefined,
    trending: params.get("trending") === "true" ? true : undefined,
  };
}

export default function Books() {
  const [location] = useLocation();
  const searchString = typeof window !== "undefined" ? window.location.search : "";
  const initial = parseSearchParams(searchString);

  const [search, setSearch] = useState(initial.searchQuery);
  const [category, setCategory] = useState(initial.category);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [featured, setFeatured] = useState(initial.featured);
  const [trending, setTrending] = useState(initial.trending);
  const [sortBy, setSortBy] = useState<string>("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const p = parseSearchParams(window.location.search);
    setSearch(p.searchQuery);
    setCategory(p.category);
    setMaxPrice(p.maxPrice);
    setFeatured(p.featured);
    setTrending(p.trending);
    setPage(1);
  }, [location]);

  const queryParams = {
    search: search || undefined,
    category: category || undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    featured,
    trending,
    sortBy: (sortBy || undefined) as "price_asc" | "price_desc" | "rating" | "title" | undefined,
    page,
    limit: 20,
  };

  const { data, isLoading } = useListBooks(queryParams, {
    query: { queryKey: getListBooksQueryKey(queryParams) },
  });

  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });

  const books = data?.books ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMaxPrice("");
    setFeatured(undefined);
    setTrending(undefined);
    setSortBy("");
    setPage(1);
  };

  const hasFilters = search || category || maxPrice || featured || trending || sortBy;

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-8 bg-gradient-to-br from-amber-50/60 to-background dark:from-amber-950/10 dark:to-background">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">Browse Books</h1>
          <p className="text-muted-foreground">
            {total > 0 ? `${total} book${total !== 1 ? "s" : ""} found` : "Discover your next read"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 shadow-sm">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <input
              data-testid="input-books-search"
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search books, authors..."
              className="flex-1 py-3 bg-transparent text-sm outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} data-testid="button-clear-search">
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              data-testid="button-toggle-filters"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 text-sm font-medium hover:border-primary transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
            </button>

            <div className="relative">
              <select
                data-testid="select-sort"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="bg-card border border-border rounded-xl px-4 py-3 text-sm outline-none appearance-none pr-8 cursor-pointer hover:border-primary transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>

        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-2xl p-6 mb-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Category</label>
                <select
                  data-testid="select-category"
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="">All Categories</option>
                  {(categories ?? []).map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Max Price (&#8377;)</label>
                <input
                  data-testid="input-max-price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  placeholder="e.g. 500"
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    data-testid="checkbox-featured"
                    type="checkbox"
                    checked={!!featured}
                    onChange={(e) => { setFeatured(e.target.checked || undefined); setPage(1); }}
                    className="accent-primary"
                  />
                  <span className="text-sm">Featured only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    data-testid="checkbox-trending"
                    type="checkbox"
                    checked={!!trending}
                    onChange={(e) => { setTrending(e.target.checked || undefined); setPage(1); }}
                    className="accent-primary"
                  />
                  <span className="text-sm">Trending only</span>
                </label>
              </div>

              <div className="flex items-end">
                {hasFilters && (
                  <button
                    data-testid="button-clear-filters"
                    onClick={clearFilters}
                    className="text-sm text-destructive hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {search && <Chip label={`Search: "${search}"`} onRemove={() => setSearch("")} />}
            {category && <Chip label={`Category: ${category}`} onRemove={() => setCategory("")} />}
            {maxPrice && <Chip label={`Max ₹${maxPrice}`} onRemove={() => setMaxPrice("")} />}
            {featured && <Chip label="Featured" onRemove={() => setFeatured(undefined)} />}
            {trending && <Chip label="Trending" onRemove={() => setTrending(undefined)} />}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => <BookSkeleton key={i} />)}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">No books found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
            <button
              data-testid="button-clear-all"
              onClick={clearFilters}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  data-testid="button-prev-page"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-border disabled:opacity-40 hover:border-primary hover:text-primary transition-colors text-sm"
                >
                  Previous
                </button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      data-testid={`button-page-${p}`}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        p === page ? "bg-primary text-white" : "border border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  data-testid="button-next-page"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-border disabled:opacity-40 hover:border-primary hover:text-primary transition-colors text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} data-testid={`button-remove-chip-${label}`}>
        <X size={12} />
      </button>
    </span>
  );
}
