import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, ArrowLeft, Package, TrendingUp, CheckCircle } from "lucide-react";
import {
  useGetBook,
  useGetRelatedBooks,
  getGetBookQueryKey,
  getGetRelatedBooksQueryKey,
} from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import BookSkeleton from "@/components/BookSkeleton";
import Footer from "@/components/Footer";

export default function BookDetail() {
  const [, params] = useRoute("/books/:id");
  const [, setLocation] = useLocation();
  const id = Number(params?.id);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const { data: book, isLoading } = useGetBook(id, {
    query: { enabled: !!id && !isNaN(id), queryKey: getGetBookQueryKey(id) },
  });

  const { data: related, isLoading: relatedLoading } = useGetRelatedBooks(id, { limit: 6 }, {
    query: { enabled: !!id && !isNaN(id), queryKey: getGetRelatedBooksQueryKey(id, { limit: 6 }) },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-[3/4] max-w-sm bg-muted rounded-2xl" />
            <div className="space-y-4 pt-4">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-8 bg-muted rounded w-4/5" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-12 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-serif text-2xl font-bold mb-2">Book not found</h2>
          <button onClick={() => setLocation("/books")} className="text-primary hover:underline">
            Back to books
          </button>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(book.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 max-w-7xl mx-auto px-4">
        <button
          data-testid="button-back"
          onClick={() => setLocation("/books")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Books
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative max-w-sm w-full">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl translate-x-4 translate-y-4" />
              <div className="relative w-full aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden" data-testid="img-book-cover">
                <BookCover
                  src={book.imageUrl}
                  alt={book.title}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
              {book.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                  -{book.discountPercent}% OFF
                </div>
              )}
              {book.trending && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                  <TrendingUp size={14} />
                  Trending
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit capitalize">
              {book.category}
            </span>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3" data-testid="text-book-title">
              {book.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-4" data-testid="text-book-author">by {book.author}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 px-3 py-1.5 rounded-lg">
                <Star size={16} className="fill-amber-500" />
                <span className="font-bold text-sm">{book.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">({book.reviewCount} reviews)</span>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle size={14} />
                {book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : "Out of stock"}
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-primary" data-testid="text-book-price">&#8377;{book.price}</span>
              {book.originalPrice > book.price && (
                <span className="text-lg text-muted-foreground line-through">&#8377;{book.originalPrice}</span>
              )}
              {book.discountPercent > 0 && (
                <span className="text-green-600 font-semibold text-sm">Save &#8377;{(book.originalPrice - book.price).toFixed(0)}</span>
              )}
            </div>

            {book.description && (
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-2">About this book</h3>
                <p className="text-muted-foreground leading-relaxed text-sm" data-testid="text-book-description">{book.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
              <div className="bg-muted rounded-xl p-3">
                <p className="text-muted-foreground text-xs mb-1">Category</p>
                <p className="font-medium capitalize">{book.category}</p>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <p className="text-muted-foreground text-xs mb-1">Stock</p>
                <p className="font-medium flex items-center gap-1">
                  <Package size={14} />
                  {book.stockQuantity} units
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                data-testid="button-add-to-cart-detail"
                onClick={() => {
                  addToCart(book);
                  toast({ title: "Added to cart", description: `"${book.title}" added successfully` });
                }}
                disabled={book.stockQuantity === 0}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                data-testid="button-wishlist-detail"
                onClick={() => {
                  toggleWishlist(book);
                  toast({
                    title: wishlisted ? "Removed from wishlist" : "Added to wishlist",
                    description: wishlisted ? `"${book.title}" removed` : `"${book.title}" saved`,
                  });
                }}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                  wishlisted
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-border hover:border-red-400 text-foreground hover:text-red-500"
                }`}
              >
                <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related Books */}
        <div className="pb-12">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Related Books</h2>
          {relatedLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <BookSkeleton key={i} />)}
            </div>
          ) : (related ?? []).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(related ?? []).map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">No related books found</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
