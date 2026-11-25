import type { Product } from "../services/api";

export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "name-asc";

export interface ProductFilters {
  search: string;
  categories: string[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
  sortBy: SortOption;
}

export const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  categories: [],
  minPrice: "",
  maxPrice: "",
  minRating: 0,
  sortBy: "relevance",
};

export function applyFilters(
  products: Product[],
  filters: ProductFilters
): Product[] {
  const searchTerm = filters.search.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" || product.title.toLowerCase().includes(searchTerm);

    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    const matchesPrice =
      (filters.minPrice === "" || product.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === "" || product.price <= Number(filters.maxPrice));

    const matchesRating =
      Number(product.rating?.rate ?? 0) >= filters.minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  if (filters.sortBy === "relevance") {
    return filtered;
  }

  return [...filtered].sort((a, b) => {
    if (filters.sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (filters.sortBy === "price-desc") {
      return b.price - a.price;
    }
    if (filters.sortBy === "rating-desc") {
      return Number(b.rating?.rate ?? 0) - Number(a.rating?.rate ?? 0);
    }
    if (filters.sortBy === "name-asc") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
}
