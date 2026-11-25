
import { useEffect, useState } from "react";
import { getProducts, getCategories } from "./services/api";
import type { Product } from "./services/api";

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
    <div>
      <h1>ShopSphere</h1>

      <h2>Categories</h2>
      {categories.map((category) => (
        <p key={category}>{category}</p>
      ))}

      <h2>Products ({products.length})</h2>

      {products.map((product) => (
        <div key={product.id}>
          <img src={product.image} alt={product.title} width="120" />
          <h3>{product.title}</h3>
          <p>Price: ${product.price}</p>
          <p>Rating: {product.rating.rate} ⭐</p>
        </div>
      ))}
    </div>
  );
}

export default App;
