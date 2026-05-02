import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import BookCover from "@/components/BookCover";
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
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden shadow hover:shadow-2xl transition-shadow duration-300"
    >
      <Link href={`/books/${book.id}`}>
        <div className="relative overflow-hidden bg-muted cursor-pointer" style={{ aspectRatio: "3/4" }}>
          <BookCover
            src={book.imageUrl}
            alt={book.title}
            priority={priority}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.06] transition-transform duration-500 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {book.discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10 shadow-md">
              -{book.discountPercent}%
            </div>
          )}

          {book.trending && (
            <div className="absolute top-2.5 right-11 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10 shadow-md">
              Trending
            </div>
          )}

          <button
            data-testid={`button-wishlist-${book.id}`}
            onClick={handleToggleWishlist}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-md ${
              wishlisted
                ? "bg-red-500 text-white scale-110"
                : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white hover:scale-110"
            }`}
          >
            <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="p-4 cursor-pointer">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{book.category}</p>
          <h3 className="font-serif font-semibold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors text-[15px]">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{book.author}</p>

          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-foreground">{book.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({book.reviewCount.toLocaleString()})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-primary">&#8377;{book.price}</span>
              {book.originalPrice > book.price && (
                <span className="text-xs text-muted-foreground line-through">&#8377;{book.originalPrice}</span>
              )}
            </div>
            <button
              data-testid={`button-cart-${book.id}`}
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm"
            >
              <ShoppingCart size={12} />
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
