import type { SortOption } from "../utils/applyFilters";

interface Props {
  search: string;
  categories: string[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
  sortBy: SortOption;
  onRemoveSearch: () => void;
  onRemoveCategory: (category: string) => void;
  onRemoveMinPrice: () => void;
  onRemoveMaxPrice: () => void;
  onRemoveMinRating: () => void;
  onRemoveSort: () => void;
  onClearAll: () => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "rating-desc": "Rating: High to Low",
  "name-asc": "Name: A–Z",
};

function ActiveFilterChips({
  search,
  categories,
  minPrice,
  maxPrice,
  minRating,
  sortBy,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveMinPrice,
  onRemoveMaxPrice,
  onRemoveMinRating,
  onRemoveSort,
  onClearAll,
}: Props) {
  const hasSearch = search.trim() !== "";
  const hasSort = sortBy !== "relevance";
  const hasActiveFilters =
    hasSearch ||
    categories.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minRating > 0 ||
    hasSort;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {hasSearch && (
        <button
          type="button"
          onClick={onRemoveSearch}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 border"
        >
          <span>Search: {search}</span>
          <span aria-hidden="true">&times;</span>
        </button>
      )}

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onRemoveCategory(category)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 border capitalize"
        >
          <span>{category}</span>
          <span aria-hidden="true">&times;</span>
        </button>
      ))}

      {minPrice !== "" && (
        <button
          type="button"
          onClick={onRemoveMinPrice}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 border"
        >
          <span>Min: ${minPrice}</span>
          <span aria-hidden="true">&times;</span>
        </button>
      )}

      {maxPrice !== "" && (
        <button
          type="button"
          onClick={onRemoveMaxPrice}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 border"
        >
          <span>Max: ${maxPrice}</span>
          <span aria-hidden="true">&times;</span>
        </button>
      )}

      {minRating > 0 && (
        <button
          type="button"
          onClick={onRemoveMinRating}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 border"
        >
          <span>{minRating}+ Stars</span>
          <span aria-hidden="true">&times;</span>
        </button>
      )}

      {hasSort && (
        <button
          type="button"
          onClick={onRemoveSort}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 border"
        >
          <span>Sort: {SORT_LABELS[sortBy]}</span>
          <span aria-hidden="true">&times;</span>
        </button>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="text-sm font-medium text-blue-600 hover:text-blue-800 ml-1"
      >
        Clear All
      </button>
    </div>
  );
}

export default ActiveFilterChips;
