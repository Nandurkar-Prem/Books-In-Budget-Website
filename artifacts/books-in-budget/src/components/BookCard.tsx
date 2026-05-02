import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@workspace/api-client-react";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
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
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <Link href={`/books/${book.id}`}>
        <div className="relative overflow-hidden aspect-[3/4] bg-muted cursor-pointer">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {book.discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{book.discountPercent}%
            </div>
          )}

          {book.trending && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              Trending
            </div>
          )}

          <button
            data-testid={`button-wishlist-${book.id}`}
            onClick={handleToggleWishlist}
            className={`absolute top-2 ${book.trending ? "top-9" : "top-2"} right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              wishlisted
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
            } shadow-md`}
          >
            <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="p-4 cursor-pointer">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{book.category}</p>
          <h3 className="font-serif font-semibold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>

          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-foreground">{book.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary">&#8377;{book.price}</span>
              {book.originalPrice > book.price && (
                <span className="text-xs text-muted-foreground line-through ml-1">&#8377;{book.originalPrice}</span>
              )}
            </div>
            <button
              data-testid={`button-cart-${book.id}`}
              onClick={handleAddToCart}
              className="flex items-center gap-1 bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
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
