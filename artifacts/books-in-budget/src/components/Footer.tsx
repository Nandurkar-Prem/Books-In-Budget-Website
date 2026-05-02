import { BookOpen, Twitter, Github, Instagram } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="font-serif font-bold text-xl">
                Books<span className="text-primary">In</span>Budget
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Discover premium books at prices that don't break the bank. Your next favorite book is waiting.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                <Github size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/books"><span className="hover:text-primary transition-colors cursor-pointer">All Books</span></Link></li>
              <li><Link href="/books?featured=true"><span className="hover:text-primary transition-colors cursor-pointer">Featured</span></Link></li>
              <li><Link href="/books?trending=true"><span className="hover:text-primary transition-colors cursor-pointer">Trending</span></Link></li>
              <li><Link href="/books?maxPrice=199"><span className="hover:text-primary transition-colors cursor-pointer">Under &#8377;199</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/cart"><span className="hover:text-primary transition-colors cursor-pointer">Cart</span></Link></li>
              <li><Link href="/wishlist"><span className="hover:text-primary transition-colors cursor-pointer">Wishlist</span></Link></li>
              <li><Link href="/admin"><span className="hover:text-primary transition-colors cursor-pointer">Admin</span></Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BooksInBudget. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with love for book lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
