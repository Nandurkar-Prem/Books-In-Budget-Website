import { motion } from "framer-motion";
import { Link } from "wouter";
import { BookOpen, Package, TrendingUp, Star, ArrowRight, Plus, AlertTriangle } from "lucide-react";
import { useGetInventory, getGetInventoryQueryKey } from "@workspace/api-client-react";
import Footer from "@/components/Footer";

export default function Admin() {
  const { data: inventory, isLoading } = useGetInventory({
    query: { queryKey: getGetInventoryQueryKey() },
  });

  const statCards = [
    { label: "Total Books", value: inventory?.totalBooks ?? 0, icon: BookOpen, color: "bg-primary/10 text-primary" },
    { label: "Total Stock", value: inventory?.totalStock ?? 0, icon: Package, color: "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" },
    { label: "Low Stock", value: inventory?.lowStockCount ?? 0, icon: AlertTriangle, color: "bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" },
    { label: "Categories", value: inventory?.totalCategories ?? 0, icon: TrendingUp, color: "bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your bookstore inventory</p>
          </div>
          <Link href="/admin/books/new">
            <button data-testid="button-add-book" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors">
              <Plus size={18} />
              Add Book
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <motion.div
              key={label}
              data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-card-border rounded-2xl p-5"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <div className="text-2xl font-bold text-foreground">{isLoading ? "—" : value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/books">
            <motion.div
              whileHover={{ scale: 1.02 }}
              data-testid="card-manage-books"
              className="bg-card border border-card-border rounded-2xl p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <ArrowRight size={20} className="text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-1">Manage Books</h3>
              <p className="text-muted-foreground text-sm">Add, edit, delete books and manage inventory</p>
            </motion.div>
          </Link>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card border border-card-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/30 rounded-xl flex items-center justify-center">
                <Star size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-1">Inventory Overview</h3>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Out of Stock</span>
                <span className="font-medium text-destructive">{inventory?.outOfStockCount ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Low Stock (less than 10)</span>
                <span className="font-medium text-amber-600">{inventory?.lowStockCount ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Stock Units</span>
                <span className="font-medium">{inventory?.totalStock ?? 0}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6">
          <h3 className="font-serif text-xl font-bold text-foreground mb-4">Recently Added</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-14 bg-muted rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(inventory?.recentlyAdded ?? []).map((book) => (
                <div key={book.id} data-testid={`recent-book-${book.id}`} className="flex gap-3 items-center">
                  <img src={book.imageUrl} alt={book.title} className="w-10 h-14 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground line-clamp-1">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author} &middot; {book.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary text-sm">&#8377;{book.price}</p>
                    <p className="text-xs text-muted-foreground">{book.stockQuantity} in stock</p>
                  </div>
                  <Link href={`/admin/books/${book.id}/edit`}>
                    <button data-testid={`button-edit-recent-${book.id}`} className="text-xs text-primary hover:underline ml-2">
                      Edit
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
