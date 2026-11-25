
import type { Product } from "../services/api";

interface Props {
  product: Product;
  searchQuery?: string;
}

function renderHighlightedTitle(title: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return title;
  }

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = title.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function ProductCard({ product, searchQuery = "" }: Props) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain mb-4"
      />

      <h3 className="font-medium text-gray-800 line-clamp-2">
        {renderHighlightedTitle(product.title, searchQuery)}
      </h3>

      <p className="text-lg font-bold mt-2">
        ${product.price}
      </p>

      <p className="text-sm text-gray-600 mt-1">
        ⭐ {product.rating.rate} ({product.rating.count} reviews)
      </p>

      <p className="text-xs text-gray-500 mt-2 capitalize">
        {product.category}
      </p>
    </div>
  );
}

export default ProductCard;
