import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Plus, Pencil, Trash2, Search, Star, Package, ArrowLeft } from "lucide-react";
import {
  useListBooks,
  useDeleteBook,
  getListBooksQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import BookCover from "@/components/BookCover";
import BookSkeleton from "@/components/BookSkeleton";

export default function AdminBooks() {
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryParams = { search: search || undefined, limit: 50 };
  const { data, isLoading } = useListBooks(queryParams, {
    query: { queryKey: getListBooksQueryKey(queryParams) },
  });

  const deleteMutation = useDeleteBook({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBooksQueryKey({}) });
        toast({ title: "Book deleted", description: "Book has been removed successfully" });
        setDeleteConfirm(null);
      },
    },
  });

  const books = data?.books ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin">
            <button data-testid="button-back-admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-serif text-3xl font-bold text-foreground">Manage Books</h1>
            <p className="text-muted-foreground text-sm">{data?.total ?? 0} total books</p>
          </div>
          <Link href="/admin/books/new">
            <button data-testid="button-add-book-list" className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors">
              <Plus size={18} />
              Add Book
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 mb-6 shadow-sm">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <input
            data-testid="input-admin-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books..."
            className="flex-1 py-3 bg-transparent text-sm outline-none"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => <BookSkeleton key={i} />)}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No books found</p>
            <Link href="/admin/books/new">
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Add First Book
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-6 py-3">Book</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Category</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Price</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Rating</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Stock</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Status</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {books.map((book) => (
                    <motion.tr
                      key={book.id}
                      data-testid={`admin-book-row-${book.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <BookCover src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground line-clamp-1 max-w-[200px]">{book.title}</p>
                            <p className="text-xs text-muted-foreground">{book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-bold text-primary text-sm">&#8377;{book.price}</p>
                          {book.discountPercent > 0 && (
                            <p className="text-xs text-green-600">-{book.discountPercent}%</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          <span className="text-sm">{book.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Package size={14} className="text-muted-foreground" />
                          <span className={book.stockQuantity === 0 ? "text-destructive" : book.stockQuantity < 10 ? "text-amber-600" : "text-foreground"}>
                            {book.stockQuantity}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {book.featured && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full w-fit">
                              Featured
                            </span>
                          )}
                          {book.trending && (
                            <span className="text-xs bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full w-fit">
                              Trending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/books/${book.id}/edit`}>
                            <button
                              data-testid={`button-edit-book-${book.id}`}
                              className="p-2 hover:bg-primary/10 hover:text-primary text-muted-foreground rounded-lg transition-colors"
                            >
                              <Pencil size={16} />
                            </button>
                          </Link>
                          {deleteConfirm === book.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                data-testid={`button-confirm-delete-${book.id}`}
                                onClick={() => deleteMutation.mutate({ id: book.id })}
                                className="text-xs bg-destructive text-white px-2 py-1 rounded-lg hover:bg-destructive/90 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                data-testid={`button-cancel-delete-${book.id}`}
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs bg-muted px-2 py-1 rounded-lg hover:bg-muted/80 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              data-testid={`button-delete-book-${book.id}`}
                              onClick={() => setDeleteConfirm(book.id)}
                              className="p-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
