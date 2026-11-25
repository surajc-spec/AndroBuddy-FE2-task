interface Props {
  categories: string[];
  selectedCategories: string[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
  invalidPrice: boolean;
  onCategoryChange: (category: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onMinRatingChange: (value: number) => void;
}

function FilterPanel({
  categories,
  selectedCategories,
  minPrice,
  maxPrice,
  minRating,
  invalidPrice,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onMinRatingChange,
}: Props) {
  return (
    <div>
      <h2 className="font-semibold mb-3">Categories</h2>

      {categories.map((category) => (
        <label
          key={category}
          className="flex items-center gap-2 mb-2 capitalize cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => onCategoryChange(category)}
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
          onChange={(e) => onMinPriceChange(e.target.value)}
          className="border rounded p-2 w-1/2"
        />

        <input
          type="number"
          min="0"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
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
        onChange={(e) => onMinRatingChange(Number(e.target.value))}
        className="border rounded-lg p-2 w-full bg-white"
      >
        <option value={0}>All Ratings</option>
        <option value={1}>1+ Stars</option>
        <option value={2}>2+ Stars</option>
        <option value={3}>3+ Stars</option>
        <option value={4}>4+ Stars</option>
      </select>
    </div>
  );
}

export default FilterPanel;
