import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Link } from "wouter";
import {
  useCreateBook,
  useGetBook,
  useUpdateBook,
  getListBooksQueryKey,
  getGetInventoryQueryKey,
  getGetBookQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import BookCover from "@/components/BookCover";

const CATEGORIES = [
  "Fiction", "Non-Fiction", "Science", "History", "Biography",
  "Technology", "Philosophy", "Romance", "Mystery", "Fantasy",
  "Self-Help", "Business",
];

interface FormData {
  title: string;
  author: string;
  description: string;
  category: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  rating: string;
  reviewCount: string;
  featured: boolean;
  trending: boolean;
  stockQuantity: string;
}

const DEFAULT_FORM: FormData = {
  title: "",
  author: "",
  description: "",
  category: "Fiction",
  price: "",
  originalPrice: "",
  imageUrl: "",
  rating: "4.0",
  reviewCount: "0",
  featured: false,
  trending: false,
  stockQuantity: "100",
};

export default function AdminBookForm() {
  const [, isEdit] = useRoute("/admin/books/:id/edit");
  const [, editParams] = useRoute("/admin/books/:id/edit");
  const bookId = editParams ? Number(editParams.id) : undefined;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const isEditing = !!isEdit && !!bookId;

  const { data: existingBook, isLoading: bookLoading } = useGetBook(bookId!, {
    query: { enabled: isEditing && !!bookId, queryKey: getGetBookQueryKey(bookId!) },
  });

  useEffect(() => {
    if (existingBook) {
      setForm({
        title: existingBook.title,
        author: existingBook.author,
        description: existingBook.description ?? "",
        category: existingBook.category,
        price: String(existingBook.price),
        originalPrice: String(existingBook.originalPrice),
        imageUrl: existingBook.imageUrl,
        rating: String(existingBook.rating),
        reviewCount: String(existingBook.reviewCount),
        featured: existingBook.featured,
        trending: existingBook.trending,
        stockQuantity: String(existingBook.stockQuantity),
      });
    }
  }, [existingBook]);

  const createMutation = useCreateBook({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBooksQueryKey({}) });
        queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
        toast({ title: "Book created", description: "New book added successfully" });
        setLocation("/admin/books");
      },
    },
  });

  const updateMutation = useUpdateBook({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBooksQueryKey({}) });
        queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
        if (bookId) queryClient.invalidateQueries({ queryKey: getGetBookQueryKey(bookId) });
        toast({ title: "Book updated", description: "Book updated successfully" });
        setLocation("/admin/books");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      author: form.author,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      imageUrl: form.imageUrl,
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      featured: form.featured,
      trending: form.trending,
      stockQuantity: Number(form.stockQuantity),
    };

    if (isEditing && bookId) {
      updateMutation.mutate({ id: bookId, data: payload });
    } else {
      createMutation.mutate({ data: payload });
    }
  };

  const set = (key: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (bookLoading && isEditing) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/books">
            <button data-testid="button-back-books" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {isEditing ? "Edit Book" : "Add New Book"}
          </h1>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-card border border-card-border rounded-2xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Title" required>
              <input
                data-testid="input-book-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Book title"
                required
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>

            <Field label="Author" required>
              <input
                data-testid="input-book-author"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                placeholder="Author name"
                required
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              data-testid="input-book-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Book description..."
              rows={4}
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Category" required>
              <select
                data-testid="select-book-category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Image URL" required>
              <input
                data-testid="input-book-image"
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Price (₹)" required>
              <input
                data-testid="input-book-price"
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="199"
                min="0"
                step="0.01"
                required
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>

            <Field label="Original Price (₹)" required>
              <input
                data-testid="input-book-original-price"
                type="number"
                value={form.originalPrice}
                onChange={(e) => set("originalPrice", e.target.value)}
                placeholder="399"
                min="0"
                step="0.01"
                required
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>

            <Field label="Rating">
              <input
                data-testid="input-book-rating"
                type="number"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
                min="0"
                max="5"
                step="0.1"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>

            <Field label="Stock">
              <input
                data-testid="input-book-stock"
                type="number"
                value={form.stockQuantity}
                onChange={(e) => set("stockQuantity", e.target.value)}
                min="0"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                data-testid="checkbox-book-featured"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                data-testid="checkbox-book-trending"
                type="checkbox"
                checked={form.trending}
                onChange={(e) => set("trending", e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium">Trending</span>
            </label>
          </div>

          {form.imageUrl && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Image Preview</p>
              <div className="relative w-20 h-28 rounded-xl border border-border overflow-hidden">
                <BookCover src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" loading="eager" />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              data-testid="button-save-book"
              disabled={isPending}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isEditing ? "Save Changes" : "Add Book"}
            </button>
            <Link href="/admin/books">
              <button type="button" data-testid="button-cancel-form" className="px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium">
                Cancel
              </button>
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
