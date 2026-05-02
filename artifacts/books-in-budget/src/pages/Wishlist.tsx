import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import BookCover from "@/components/BookCover";
import { GB_FALLBACK_COVERS } from "@/utils/coverFallbacks";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={28} className="text-red-500 fill-red-500" />
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Wishlist</h1>
          {wishlist.length > 0 && (
            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {wishlist.length} book{wishlist.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save books you love to read later</p>
            <Link href="/books">
              <button data-testid="button-browse-books" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                Browse Books
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {wishlist.map((book) => (
                <motion.div
                  key={book.id}
                  data-testid={`wishlist-item-${book.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  className="flex gap-4 bg-card border border-border rounded-2xl p-4"
                >
                  <Link href={`/books/${book.id}`}>
                    <div className="relative w-20 h-28 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 bg-stone-100">
                      <BookCover
                        src={book.imageUrl}
                        fallbackSrc={GB_FALLBACK_COVERS[book.id]}
                        alt={book.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">{book.category}</span>
                    <Link href={`/books/${book.id}`}>
                      <h3 className="font-serif font-semibold text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-2 mt-0.5 text-sm">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                    <p className="font-bold text-primary mb-3">₹{book.price}</p>

                    <div className="flex gap-2">
                      <button
                        data-testid={`button-add-to-cart-wishlist-${book.id}`}
                        onClick={() => {
                          addToCart(book);
                          toast({ title: "Added to cart", description: `"${book.title}" added` });
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingCart size={12} />
                        Add to Cart
                      </button>
                      <button
                        data-testid={`button-remove-wishlist-${book.id}`}
                        onClick={() => {
                          toggleWishlist(book);
                          toast({ title: "Removed from wishlist", description: `"${book.title}" removed` });
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
