
import { useEffect, useState } from "react";
import { getProducts, getCategories } from "./services/api";
import type { Product } from "./services/api";
import ProductList from "./components/ProductList";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);

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
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const invalidPrice =
    minPrice !== "" &&
    maxPrice !== "" &&
    Number(minPrice) > Number(maxPrice);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesPrice =
      (minPrice === "" || product.price >= Number(minPrice)) &&
      (maxPrice === "" || product.price <= Number(maxPrice));

    const matchesRating =
      Number(product.rating?.rate ?? 0) >= minRating;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesRating
    );
  });

  if (loading) {
    return <h2 className="p-6">Loading products...</h2>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">ShopSphere</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3 mb-6"
      />

      <h2 className="font-semibold mb-3">Categories</h2>

      {categories.map((category) => (
        <label
          key={category}
          className="flex items-center gap-2 mb-2 capitalize"
        >
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryChange(category)}
          />
          {category}
        </label>
      ))}

      <h2 className="font-semibold mt-6 mb-3">Price Range</h2>

      <div className="flex gap-2 mb-2">
        <input
          type="number"
          min="0"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded p-2 w-1/2"
        />

        <input
          type="number"
          min="0"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded p-2 w-1/2"
        />
      </div>

      {invalidPrice && (
        <p className="text-red-500 text-sm mb-4">
          Minimum price cannot exceed maximum price.
        </p>
      )}

      <h2 className="font-semibold mt-6 mb-3">Minimum Rating</h2>

      <select
        value={minRating}
        onChange={(e) => setMinRating(Number(e.target.value))}
        className="border rounded-lg p-2 w-full"
      >
        <option value={0}>All Ratings</option>
        <option value={1}>1+ Stars</option>
        <option value={2}>2+ Stars</option>
        <option value={3}>3+ Stars</option>
        <option value={4}>4+ Stars</option>
      </select>

      {invalidPrice ? (
        <p className="text-red-500 mt-4">
          Please enter a valid price range.
        </p>
      ) : (
        <>
          <h2 className="text-xl font-bold mt-6 mb-4">
            Products ({filteredProducts.length})
          </h2>

          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <p className="text-gray-500 mt-6">
              No products found.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
