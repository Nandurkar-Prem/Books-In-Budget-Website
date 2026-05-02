import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import BookCover from "@/components/BookCover";
import { GB_FALLBACK_COVERS } from "@/utils/coverFallbacks";
import type { Book } from "@workspace/api-client-react";

interface BookCardProps {
  book: Book;
  priority?: boolean;
}

export default function BookCard({ book, priority = false }: BookCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const wishlisted = isWishlisted(book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
    toast({ title: "Added to cart", description: `"${book.title}" added successfully` });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book);
    toast({
      title: wishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: wishlisted ? `"${book.title}" removed` : `"${book.title}" saved`,
    });
  };

  return (
    <motion.div
      data-testid={`card-book-${book.id}`}
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <Link href={`/books/${book.id}`}>
        {/* Image container — warm paper background, fixed 3:4 ratio */}
        <div
          className="relative overflow-hidden cursor-pointer bg-stone-100"
          style={{ aspectRatio: "3/4" }}
        >
          <BookCover
            src={book.imageUrl}
            fallbackSrc={GB_FALLBACK_COVERS[book.id]}
            alt={book.title}
            priority={priority}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.05] transition-transform duration-500 ease-out"
          />

          {/* Subtle gradient on hover for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Badges */}
          {book.discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10 shadow">
              -{book.discountPercent}%
            </div>
          )}
          {book.trending && (
            <div className="absolute top-2.5 right-10 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10 shadow">
              Trending
            </div>
          )}

          {/* Wishlist button */}
          <button
            data-testid={`button-wishlist-${book.id}`}
            onClick={handleToggleWishlist}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow ${
              wishlisted
                ? "bg-red-500 text-white scale-110"
                : "bg-white/95 text-gray-500 hover:bg-red-500 hover:text-white hover:scale-110"
            }`}
          >
            <Heart size={13} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3.5 cursor-pointer">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
            {book.category}
          </p>
          <h3 className="font-serif font-semibold text-foreground leading-snug line-clamp-2 mb-0.5 group-hover:text-primary transition-colors text-[14px]">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{book.author}</p>

          <div className="flex items-center gap-1 mb-3">
            <Star size={11} className="text-amber-500 fill-amber-500" />
            <span className="text-[11px] font-bold text-foreground">{book.rating.toFixed(1)}</span>
            <span className="text-[11px] text-muted-foreground">({book.reviewCount.toLocaleString()})</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-primary">₹{book.price}</span>
              {book.originalPrice > book.price && (
                <span className="text-[11px] text-muted-foreground line-through">₹{book.originalPrice}</span>
              )}
            </div>
            <button
              data-testid={`button-cart-${book.id}`}
              onClick={handleAddToCart}
              className="flex items-center gap-1 bg-primary text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-primary/90 active:scale-95 transition-all shadow-sm shrink-0"
            >
              <ShoppingCart size={11} />
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
