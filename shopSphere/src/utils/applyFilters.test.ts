import { describe, it, expect } from "vitest";
import { applyFilters, DEFAULT_FILTERS } from "./applyFilters";
import type { Product } from "../services/api";

const mockProducts: Product[] = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    price: 59.99,
    description: "Noise cancelling headphones",
    category: "electronics",
    image: "headphones.jpg",
    rating: { rate: 4.5, count: 120 },
  },
  {
    id: 2,
    title: "Classic Cotton T-Shirt",
    price: 19.99,
    description: "Comfortable cotton shirt",
    category: "men's clothing",
    image: "tshirt.jpg",
    rating: { rate: 3.8, count: 80 },
  },
  {
    id: 3,
    title: "Gold Plated Necklace",
    price: 149.99,
    description: "Elegant necklace",
    category: "jewelery",
    image: "necklace.jpg",
    rating: { rate: 4.9, count: 45 },
  },
  {
    id: 4,
    title: "Mechanical Gaming Keyboard",
    price: 89.99,
    description: "RGB backlit keyboard",
    category: "electronics",
    image: "keyboard.jpg",
    rating: { rate: 2.9, count: 30 },
  },
];

describe("applyFilters", () => {
  it("filters products by search term case-insensitively", () => {
    const result = applyFilters(mockProducts, {
      ...DEFAULT_FILTERS,
      search: "cotton",
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("filters products by multiple selected categories", () => {
    const result = applyFilters(mockProducts, {
      ...DEFAULT_FILTERS,
      categories: ["electronics", "jewelery"],
    });

    expect(result.map((p) => p.id)).toEqual([1, 3, 4]);
  });

  it("filters products by minimum and maximum price", () => {
    const result = applyFilters(mockProducts, {
      ...DEFAULT_FILTERS,
      minPrice: "50",
      maxPrice: "100",
    });

    expect(result.map((p) => p.id)).toEqual([1, 4]);
  });

  it("filters products by minimum rating", () => {
    const result = applyFilters(mockProducts, {
      ...DEFAULT_FILTERS,
      minRating: 4,
    });

    expect(result.map((p) => p.id)).toEqual([1, 3]);
  });

  it("sorts products without mutating the original array", () => {
    const originalOrder = mockProducts.map((p) => p.id);

    const priceAsc = applyFilters(mockProducts, {
      ...DEFAULT_FILTERS,
      sortBy: "price-asc",
    });
    expect(priceAsc.map((p) => p.id)).toEqual([2, 1, 4, 3]);

    const priceDesc = applyFilters(mockProducts, {
      ...DEFAULT_FILTERS,
      sortBy: "price-desc",
    });
    expect(priceDesc.map((p) => p.id)).toEqual([3, 4, 1, 2]);

    const ratingDesc = applyFilters(mockProducts, {
      ...DEFAULT_FILTERS,
      sortBy: "rating-desc",
    });
    expect(ratingDesc.map((p) => p.id)).toEqual([3, 1, 2, 4]);

    const nameAsc = applyFilters(mockProducts, {
      ...DEFAULT_FILTERS,
      sortBy: "name-asc",
    });
    expect(nameAsc.map((p) => p.id)).toEqual([2, 3, 4, 1]);

    expect(mockProducts.map((p) => p.id)).toEqual(originalOrder);
  });

  it("combines search, category, price, rating, and sorting filters", () => {
    const result = applyFilters(mockProducts, {
      search: "e",
      categories: ["electronics", "jewelery"],
      minPrice: "50",
      maxPrice: "160",
      minRating: 4,
      sortBy: "price-desc",
    });

    expect(result.map((p) => p.id)).toEqual([3, 1]);
  });
});
