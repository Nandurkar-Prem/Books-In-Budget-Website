import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const { toast } = useToast();

  const handleRemove = (id: number, title: string) => {
    removeFromCart(id);
    toast({ title: "Removed from cart", description: `"${title}" removed` });
  };

  const handleCheckout = () => {
    clearCart();
    toast({ title: "Order placed!", description: "Thank you for your purchase. Your books are on the way!" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart size={28} className="text-primary" />
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Your Cart</h1>
          {itemCount > 0 && (
            <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} className="text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some books to get started</p>
            <Link href="/books">
              <button data-testid="button-continue-shopping" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                Browse Books
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(({ book, quantity }) => (
                  <motion.div
                    key={book.id}
                    data-testid={`cart-item-${book.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-4 bg-card border border-card-border rounded-2xl p-4"
                  >
                    <Link href={`/books/${book.id}`}>
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-xl cursor-pointer flex-shrink-0"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">{book.category}</span>
                      <Link href={`/books/${book.id}`}>
                        <h3 className="font-serif font-semibold text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-1 mt-0.5">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{book.author}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            data-testid={`button-decrease-${book.id}`}
                            onClick={() => updateQuantity(book.id, quantity - 1)}
                            className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span data-testid={`text-quantity-${book.id}`} className="w-8 text-center font-semibold text-sm">
                            {quantity}
                          </span>
                          <button
                            data-testid={`button-increase-${book.id}`}
                            onClick={() => updateQuantity(book.id, quantity + 1)}
                            className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary" data-testid={`text-item-price-${book.id}`}>
                            &#8377;{(book.price * quantity).toFixed(0)}
                          </span>
                          <button
                            data-testid={`button-remove-${book.id}`}
                            onClick={() => handleRemove(book.id, book.title)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                data-testid="button-clear-cart"
                onClick={() => clearCart()}
                className="text-sm text-destructive hover:underline"
              >
                Clear cart
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-card-border rounded-2xl p-6 sticky top-24">
                <h2 className="font-serif text-xl font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {items.map(({ book, quantity }) => (
                    <div key={book.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{book.title} x{quantity}</span>
                      <span className="font-medium shrink-0">&#8377;{(book.price * quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>&#8377;{total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary" data-testid="text-cart-total">&#8377;{total.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  data-testid="button-checkout"
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>

                <Link href="/books">
                  <button data-testid="button-continue-shopping-cart" className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={14} />
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
