
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "./services/api";
import type { Product } from "./services/api";
import ProductList from "./components/ProductList";
import ActiveFilterChips from "./components/ActiveFilterChips";
import FilterPanel from "./components/FilterPanel";
import { applyFilters } from "./utils/applyFilters";
import type { SortOption } from "./utils/applyFilters";

const VALID_SORTS: SortOption[] = [
  "relevance",
  "price-asc",
  "price-desc",
  "rating-desc",
  "name-asc",
];

const SORT_STORAGE_KEY = "shopsphere_sort";

function hasValidSortParam(value: string | null): value is SortOption {
  return value !== null && VALID_SORTS.includes(value as SortOption);
}

function parseSort(value: string | null): SortOption {
  if (hasValidSortParam(value)) {
    return value;
  }
  return "relevance";
}

function getStoredSort(): SortOption {
  try {
    return parseSort(localStorage.getItem(SORT_STORAGE_KEY));
  } catch {
    return "relevance";
  }
}

function saveStoredSort(value: SortOption) {
  try {
    localStorage.setItem(SORT_STORAGE_KEY, value);
  } catch {
    return;
  }
}

function parseRating(value: string | null): number {
  if (!value) {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const urlSearch = searchParams.get("q") ?? "";
  const selectedCategories = searchParams.getAll("category");
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const minRating = parseRating(searchParams.get("minRating"));
  const urlSortParam = searchParams.get("sort");
  const sortBy = hasValidSortParam(urlSortParam)
    ? urlSortParam
    : getStoredSort();

  const [search, setSearch] = useState(urlSearch);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [draftCategories, setDraftCategories] = useState<string[]>(selectedCategories);
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice);
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice);
  const [draftMinRating, setDraftMinRating] = useState(minRating);

  const openDrawer = () => {
    setDraftCategories(selectedCategories);
    setDraftMinPrice(minPrice);
    setDraftMaxPrice(maxPrice);
    setDraftMinRating(minRating);
    setIsDrawerOpen(true);
  };

  const applyDrawerFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    draftCategories.forEach((item) => next.append("category", item));
    if (draftMinPrice) {
      next.set("minPrice", draftMinPrice);
    } else {
      next.delete("minPrice");
    }
    if (draftMaxPrice) {
      next.set("maxPrice", draftMaxPrice);
    } else {
      next.delete("maxPrice");
    }
    if (draftMinRating > 0) {
      next.set("minRating", String(draftMinRating));
    } else {
      next.delete("minRating");
    }
    setSearchParams(next);
    setIsDrawerOpen(false);
  };

  const handleDraftCategoryChange = (category: string) => {
    setDraftCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const draftInvalidPrice =
    draftMinPrice !== "" &&
    draftMaxPrice !== "" &&
    Number(draftMinPrice) > Number(draftMaxPrice);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch data");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== urlSearch) {
        const next = new URLSearchParams(searchParams);
        if (search.trim()) {
          next.set("q", search);
        } else {
          next.delete("q");
        }
        setSearchParams(next, { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, urlSearch, searchParams, setSearchParams]);

  const handleCategoryChange = (category: string) => {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll("category");
    next.delete("category");
    const updated = current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category];
    updated.forEach((item) => next.append("category", item));
    setSearchParams(next);
  };

  const handleMinPriceChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("minPrice", value);
    } else {
      next.delete("minPrice");
    }
    setSearchParams(next);
  };

  const handleMaxPriceChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("maxPrice", value);
    } else {
      next.delete("maxPrice");
    }
    setSearchParams(next);
  };

  const handleMinRatingChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    if (value > 0) {
      next.set("minRating", String(value));
    } else {
      next.delete("minRating");
    }
    setSearchParams(next);
  };

  const handleSortChange = (value: SortOption) => {
    saveStoredSort(value);
    const next = new URLSearchParams(searchParams);
    if (value !== "relevance") {
      next.set("sort", value);
    } else {
      next.delete("sort");
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    saveStoredSort("relevance");
    setSearch("");
    setSearchParams(new URLSearchParams());
  };

  const invalidPrice =
    minPrice !== "" &&
    maxPrice !== "" &&
    Number(minPrice) > Number(maxPrice);

  const sortedProducts = useMemo(
    () =>
      applyFilters(products, {
        search: urlSearch,
        categories: selectedCategories,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
      }),
    [products, urlSearch, selectedCategories, minPrice, maxPrice, minRating, sortBy]
  );

  if (loading) {
    return <h2 className="p-6">Loading products...</h2>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">ShopSphere</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <button
          type="button"
          onClick={openDrawer}
          className="lg:hidden px-4 py-2 border rounded-lg font-medium bg-white hover:bg-gray-50 shrink-0"
        >
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="border rounded-lg p-4 bg-white">
            <FilterPanel
              categories={categories}
              selectedCategories={selectedCategories}
              minPrice={minPrice}
              maxPrice={maxPrice}
              minRating={minRating}
              invalidPrice={invalidPrice}
              onCategoryChange={handleCategoryChange}
              onMinPriceChange={handleMinPriceChange}
              onMaxPriceChange={handleMaxPriceChange}
              onMinRatingChange={handleMinRatingChange}
            />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {invalidPrice ? (
            <p className="text-red-500 mt-4">
              Please enter a valid price range.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold">
                  Products ({sortedProducts.length})
                </h2>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="border rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Rating: High to Low</option>
                    <option value="name-asc">Name: A–Z</option>
                  </select>
                </div>
              </div>

              <ActiveFilterChips
                search={urlSearch}
                categories={selectedCategories}
                minPrice={minPrice}
                maxPrice={maxPrice}
                minRating={minRating}
                sortBy={sortBy}
                onRemoveSearch={() => {
                  setSearch("");
                  const next = new URLSearchParams(searchParams);
                  next.delete("q");
                  setSearchParams(next);
                }}
                onRemoveCategory={(category) => handleCategoryChange(category)}
                onRemoveMinPrice={() => handleMinPriceChange("")}
                onRemoveMaxPrice={() => handleMaxPriceChange("")}
                onRemoveMinRating={() => handleMinRatingChange(0)}
                onRemoveSort={() => handleSortChange("relevance")}
                onClearAll={clearAllFilters}
              />

              {sortedProducts.length > 0 ? (
                <ProductList products={sortedProducts} searchQuery={urlSearch} />
              ) : (
                <div className="border rounded-lg p-8 text-center mt-6 bg-gray-50">
                  <p className="text-gray-700 font-medium mb-2">
                    No products match your current filters.
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Try adjusting your search or filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative ml-auto w-80 max-w-full bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <FilterPanel
                categories={categories}
                selectedCategories={draftCategories}
                minPrice={draftMinPrice}
                maxPrice={draftMaxPrice}
                minRating={draftMinRating}
                invalidPrice={draftInvalidPrice}
                onCategoryChange={handleDraftCategoryChange}
                onMinPriceChange={setDraftMinPrice}
                onMaxPriceChange={setDraftMaxPrice}
                onMinRatingChange={setDraftMinRating}
              />
            </div>

            <div className="p-4 border-t flex gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-1/2 py-2 border rounded-lg font-medium hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                disabled={draftInvalidPrice}
                onClick={applyDrawerFilters}
                className="w-1/2 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
