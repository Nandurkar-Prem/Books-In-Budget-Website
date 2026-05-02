import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { booksTable } from "@workspace/db";
import { eq, ilike, lte, gte, and, or, desc, asc, sql, ne } from "drizzle-orm";
import {
  ListBooksQueryParams,
  CreateBookBody,
  GetBookParams,
  UpdateBookBody,
  UpdateBookParams,
  DeleteBookParams,
  GetTrendingBooksQueryParams,
  GetFeaturedBooksQueryParams,
  GetBudgetBooksQueryParams,
  GetRelatedBooksParams,
  GetRelatedBooksQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function calcDiscount(price: string | number, originalPrice: string | number): number {
  const p = Number(price);
  const op = Number(originalPrice);
  if (op <= 0 || p >= op) return 0;
  return Math.round(((op - p) / op) * 100);
}

function formatBook(book: typeof booksTable.$inferSelect) {
  return {
    ...book,
    price: Number(book.price),
    originalPrice: Number(book.originalPrice),
    rating: Number(book.rating),
    discountPercent: calcDiscount(book.price, book.originalPrice),
    createdAt: book.createdAt?.toISOString(),
    updatedAt: book.updatedAt?.toISOString(),
  };
}

router.get("/books", async (req, res) => {
  const query = ListBooksQueryParams.parse(req.query);
  const { search, category, minPrice, maxPrice, featured, trending, sortBy, page = 1, limit = 20 } = query;

  const conditions = [];
  if (search) conditions.push(
    or(
      ilike(booksTable.title, `%${search}%`),
      ilike(booksTable.author, `%${search}%`),
      ilike(booksTable.category, `%${search}%`)
    )!
  );
  if (category) conditions.push(eq(booksTable.category, category));
  if (minPrice !== undefined) conditions.push(gte(sql`${booksTable.price}::numeric`, minPrice));
  if (maxPrice !== undefined) conditions.push(lte(sql`${booksTable.price}::numeric`, maxPrice));
  if (featured !== undefined) conditions.push(eq(booksTable.featured, featured));
  if (trending !== undefined) conditions.push(eq(booksTable.trending, trending));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let orderBy;
  switch (sortBy) {
    case "price_asc": orderBy = asc(sql`${booksTable.price}::numeric`); break;
    case "price_desc": orderBy = desc(sql`${booksTable.price}::numeric`); break;
    case "rating": orderBy = desc(sql`${booksTable.rating}::numeric`); break;
    case "title": orderBy = asc(booksTable.title); break;
    default: orderBy = desc(booksTable.createdAt);
  }

  const offset = (page - 1) * limit;

  const [books, totalResult] = await Promise.all([
    db.select().from(booksTable).where(where).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(booksTable).where(where),
  ]);

  const total = totalResult[0]?.count ?? 0;

  res.json({
    books: books.map(formatBook),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

router.post("/books", async (req, res) => {
  const body = CreateBookBody.parse(req.body);
  const [book] = await db.insert(booksTable).values({
    title: body.title,
    author: body.author,
    description: body.description ?? "",
    category: body.category,
    price: String(body.price),
    originalPrice: String(body.originalPrice),
    imageUrl: body.imageUrl,
    rating: String(body.rating ?? 4.0),
    reviewCount: body.reviewCount ?? 0,
    featured: body.featured ?? false,
    trending: body.trending ?? false,
    stockQuantity: body.stockQuantity ?? 100,
    updatedAt: new Date(),
  }).returning();
  res.status(201).json(formatBook(book));
});

router.get("/books/trending", async (req, res) => {
  const query = GetTrendingBooksQueryParams.parse(req.query);
  const limit = query.limit ?? 10;
  const books = await db.select().from(booksTable)
    .where(eq(booksTable.trending, true))
    .orderBy(desc(sql`${booksTable.rating}::numeric`))
    .limit(limit);
  res.json(books.map(formatBook));
});

router.get("/books/featured", async (req, res) => {
  const query = GetFeaturedBooksQueryParams.parse(req.query);
  const limit = query.limit ?? 10;
  const books = await db.select().from(booksTable)
    .where(eq(booksTable.featured, true))
    .orderBy(desc(sql`${booksTable.rating}::numeric`))
    .limit(limit);
  res.json(books.map(formatBook));
});

router.get("/books/budget", async (req, res) => {
  const query = GetBudgetBooksQueryParams.parse(req.query);
  const maxPrice = query.maxPrice ?? 199;
  const limit = query.limit ?? 10;
  const books = await db.select().from(booksTable)
    .where(lte(sql`${booksTable.price}::numeric`, maxPrice))
    .orderBy(asc(sql`${booksTable.price}::numeric`))
    .limit(limit);
  res.json(books.map(formatBook));
});

router.get("/books/stats", async (_req, res) => {
  const [stats] = await db.select({
    totalBooks: sql<number>`count(*)::int`,
    totalCategories: sql<number>`count(distinct ${booksTable.category})::int`,
    avgPrice: sql<number>`round(avg(${booksTable.price}::numeric), 2)`,
    booksUnder199: sql<number>`count(*) filter (where ${booksTable.price}::numeric <= 199)::int`,
    trendingCount: sql<number>`count(*) filter (where ${booksTable.trending} = true)::int`,
    featuredCount: sql<number>`count(*) filter (where ${booksTable.featured} = true)::int`,
  }).from(booksTable);

  res.json({
    totalBooks: stats.totalBooks,
    totalCategories: stats.totalCategories,
    avgPrice: Number(stats.avgPrice),
    booksUnder199: stats.booksUnder199,
    trendingCount: stats.trendingCount,
    featuredCount: stats.featuredCount,
  });
});

router.get("/books/:id", async (req, res) => {
  const { id } = GetBookParams.parse(req.params);
  const [book] = await db.select().from(booksTable).where(eq(booksTable.id, id));
  if (!book) {
    res.status(404).json({ error: "NOT_FOUND", message: "Book not found" });
    return;
  }
  res.json(formatBook(book));
});

router.put("/books/:id", async (req, res) => {
  const { id } = UpdateBookParams.parse(req.params);
  const body = UpdateBookBody.parse(req.body);

  const updateData: Partial<typeof booksTable.$inferInsert> = { updatedAt: new Date() };
  if (body.title !== undefined) updateData.title = body.title;
  if (body.author !== undefined) updateData.author = body.author;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.price !== undefined) updateData.price = String(body.price);
  if (body.originalPrice !== undefined) updateData.originalPrice = String(body.originalPrice);
  if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
  if (body.rating !== undefined) updateData.rating = String(body.rating);
  if (body.reviewCount !== undefined) updateData.reviewCount = body.reviewCount;
  if (body.featured !== undefined) updateData.featured = body.featured;
  if (body.trending !== undefined) updateData.trending = body.trending;
  if (body.stockQuantity !== undefined) updateData.stockQuantity = body.stockQuantity;

  const [book] = await db.update(booksTable).set(updateData).where(eq(booksTable.id, id)).returning();
  if (!book) {
    res.status(404).json({ error: "NOT_FOUND", message: "Book not found" });
    return;
  }
  res.json(formatBook(book));
});

router.delete("/books/:id", async (req, res) => {
  const { id } = DeleteBookParams.parse(req.params);
  const [book] = await db.delete(booksTable).where(eq(booksTable.id, id)).returning();
  if (!book) {
    res.status(404).json({ error: "NOT_FOUND", message: "Book not found" });
    return;
  }
  res.json({ success: true, message: "Book deleted successfully" });
});

router.get("/books/:id/related", async (req, res) => {
  const { id } = GetRelatedBooksParams.parse(req.params);
  const query = GetRelatedBooksQueryParams.parse(req.query);
  const limit = query.limit ?? 6;

  const [currentBook] = await db.select().from(booksTable).where(eq(booksTable.id, id));
  if (!currentBook) {
    res.json([]);
    return;
  }

  const related = await db.select().from(booksTable)
    .where(and(eq(booksTable.category, currentBook.category), ne(booksTable.id, id)))
    .orderBy(desc(sql`${booksTable.rating}::numeric`))
    .limit(limit);

  res.json(related.map(formatBook));
});

router.get("/categories", async (_req, res) => {
  const results = await db.select({
    name: booksTable.category,
    bookCount: sql<number>`count(*)::int`,
  }).from(booksTable).groupBy(booksTable.category).orderBy(desc(sql`count(*)`));

  res.json(results.map((r) => ({
    name: r.name,
    bookCount: r.bookCount,
    slug: r.name.toLowerCase().replace(/\s+/g, "-"),
  })));
});

router.get("/admin/inventory", async (_req, res) => {
  const [stats] = await db.select({
    totalBooks: sql<number>`count(*)::int`,
    totalStock: sql<number>`sum(${booksTable.stockQuantity})::int`,
    lowStockCount: sql<number>`count(*) filter (where ${booksTable.stockQuantity} < 10 and ${booksTable.stockQuantity} > 0)::int`,
    outOfStockCount: sql<number>`count(*) filter (where ${booksTable.stockQuantity} = 0)::int`,
    totalCategories: sql<number>`count(distinct ${booksTable.category})::int`,
  }).from(booksTable);

  const recentlyAdded = await db.select().from(booksTable)
    .orderBy(desc(booksTable.createdAt))
    .limit(5);

  res.json({
    totalBooks: stats.totalBooks,
    totalStock: stats.totalStock ?? 0,
    lowStockCount: stats.lowStockCount,
    outOfStockCount: stats.outOfStockCount,
    totalCategories: stats.totalCategories,
    recentlyAdded: recentlyAdded.map(formatBook),
  });
});

export default router;

// Seed data reference — real Open Library cover images by ISBN
// Format: https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
// Books:
// 1  The Alchemist           9780062315007
// 2  Atomic Habits           9780735211292
// 3  Sapiens                 9780062316097
// 4  Rich Dad Poor Dad       9781612680194
// 5  To Kill a Mockingbird   9780061935466
// 6  The Power of Now        9781577314806
// 7  1984                    9780451524935
// 8  Brief History of Time   9780553380163
// 9  The Psychology of Money 9780857197689
// 10 Pride and Prejudice     9780141439518
// 11 Clean Code              9780132350884
// 12 The Subtle Art...       9780062457714
// 13 Elon Musk               9781982181284
// 14 Harry Potter #1         9780439708180
// 15 The Da Vinci Code       9780307474278
// 16 Zero to One             9780804139021
