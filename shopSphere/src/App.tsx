
import { useEffect, useState } from "react";
import { getProducts, getCategories } from "./services/api";
import type { Product } from "./services/api";
import ProductList from "./components/ProductList";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([products, categories]) => {
        setProducts(products);
        setCategories(categories);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h2>Loading products...</h2>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">ShopSphere</h1>

      <h2 className="text-xl font-semibold mb-3">Categories</h2>

      <div className="mb-6">
        {categories.map((category) => (
          <p key={category} className="capitalize">
            {category}
          </p>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">
        Products ({products.length})
      </h2>

      <ProductList products={products} />
    </div>
  );
}

export default App;
