# BooksInBudget

A premium full-stack bookstore web application built with React+Vite, Express/Node.js, PostgreSQL, and Drizzle ORM.

## Architecture

**Monorepo** managed by pnpm with three main artifacts:
- `artifacts/books-in-budget` — React+Vite frontend (preview path: `/`)
- `artifacts/api-server` — Express 5 API server (preview path: `/api`)
- `artifacts/mockup-sandbox` — Design sandbox (internal)

**Shared Libraries:**
- `lib/db` — Drizzle ORM schema + PostgreSQL client (`@workspace/db`)
- `lib/api-spec` — OpenAPI spec + Orval codegen config (`@workspace/api-spec`)
- `lib/api-zod` — Zod validation schemas generated from OpenAPI (`@workspace/api-zod`)
- `lib/api-client-react` — TanStack Query hooks generated from OpenAPI (`@workspace/api-client-react`)

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Wouter routing, TanStack Query, lucide-react
- **Backend**: Express 5, Drizzle ORM, PostgreSQL, Pino logging, Zod validation
- **Fonts**: Playfair Display (headings/serif) + Inter (body/sans)
- **Currency**: Indian Rupees (₹)
- **Primary color**: Warm amber/orange (HSL 25 90% 48%)

## Features

- **Home Page**: Animated hero with floating book visuals, search bar, stats, featured/trending/budget book sections, category grid, CTA
- **Browse Books** (`/books`): Full-text search, category/price/featured/trending filters, sort options, pagination
- **Book Detail** (`/books/:id`): Full book info, add to cart, wishlist, related books
- **Cart** (`/cart`): Context API state, quantity controls, order summary, checkout simulation
- **Wishlist** (`/wishlist`): localStorage persistence, add-to-cart from wishlist
- **Contact** (`/contact`): WhatsApp, Instagram, Phone, Email, Location contact cards
- **Admin Dashboard** (`/admin`): Inventory stats, recently added books
- **Admin Books** (`/admin/books`): Full CRUD table with search, edit, delete with confirmation
- **Admin Book Form** (`/admin/books/new`, `/admin/books/:id/edit`): Create/edit books with image preview

## Navigation

- Top contact strip: phone + email + WhatsApp CTA (desktop)
- Navbar: Home, Browse, Wishlist, Contact links + WhatsApp button + search/wishlist/cart/admin icons
- Footer: 4-column layout — brand/social, shop links, contact info, order CTAs
- Contact details: WhatsApp/Phone +919876543210, email hello@booksinbudget.in, Instagram @booksinbudget, Bandra West Mumbai

## Image System

**BookCover component** (`src/components/BookCover.tsx`):
- 3-phase fallback: primary URL → fallbackSrc → styled text card
- Uses inline `style` for opacity fade-in to avoid Tailwind `transition-property` conflicts with parent's `transition-transform` hover zoom
- Smooth skeleton animation while loading

**Image sources (by book)**:
- Books 1-10, 12-14: Open Library ISBN `-L.jpg` (~400px, high quality, English editions)
- Books 11 (Clean Code), 15 (Da Vinci Code), 16 (Zero to One): Google Books zoom=1 (reliable, always works)
- All books have Google Books zoom=1 fallback via `GB_FALLBACK_COVERS` map (`src/utils/coverFallbacks.ts`)

**CSS**: `object-cover object-center` with `bg-stone-100` container background. Fixed `3/4` aspect ratio on all cards.

## API Endpoints

All endpoints prefixed with `/api`:
- `GET /books` — List books with filters (search, category, minPrice, maxPrice, featured, trending, sortBy, page, limit)
- `POST /books` — Create book
- `GET /books/trending` — Trending books
- `GET /books/featured` — Featured books
- `GET /books/budget` — Budget books (under maxPrice)
- `GET /books/stats` — Aggregate statistics
- `GET /books/:id` — Single book
- `PUT /books/:id` — Update book
- `DELETE /books/:id` — Delete book
- `GET /books/:id/related` — Related books by category
- `GET /categories` — All categories with book counts
- `GET /admin/inventory` — Admin inventory overview

## Database Schema

Table: `books`
- id, title, author, description, category
- price, originalPrice (numeric strings)
- imageUrl, rating, reviewCount
- featured (boolean), trending (boolean)
- stockQuantity, createdAt, updatedAt

## Code Generation

After updating `lib/api-spec/openapi.yaml`:
```bash
pnpm --filter @workspace/api-spec run codegen
```

This regenerates:
- `lib/api-zod/src/generated/api.ts` — Zod schemas
- `lib/api-client-react/src/generated/` — TanStack Query hooks

## Seeded Data

16 books: The Alchemist, Atomic Habits, Sapiens, Rich Dad Poor Dad, To Kill a Mockingbird, The Power of Now, 1984, Brief History of Time, The Psychology of Money, Pride and Prejudice, Clean Code, The Subtle Art of Not Giving a F*ck, Elon Musk, Harry Potter and the Sorcerer's Stone, The Da Vinci Code, Zero to One.
