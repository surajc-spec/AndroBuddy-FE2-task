# ShopSphere

A simple React + TypeScript product discovery app using the Fake Store API. Users can search, filter, and sort products with URL sync and saved sort preferences.

## Features

- Product listing from Fake Store API (`GET /products`, `GET /products/categories`)
- Search with 300ms debounce and title highlighting
- Multi-category, min/max price, and minimum rating filters
- Sorting: Relevance, Price (Low to High / High to Low), Rating (High to Low), Name (A–Z)
- Removable active filter chips and Clear All button
- URL query parameter sync for filters and sorting
- `localStorage` persistence for the last used sort option (URL takes priority)
- Responsive desktop sidebar and mobile filter drawer (Apply / Close)
- Empty state with Reset Filters button

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router (`useSearchParams`)
- Vitest

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   ```env
   VITE_PRODUCT_API_URL=https://fakestoreapi.com
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — Start development server
- `npm test` — Run Vitest unit tests (6 tests in `src/utils/applyFilters.test.ts`)
- `npm run build` — Type-check and build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint
