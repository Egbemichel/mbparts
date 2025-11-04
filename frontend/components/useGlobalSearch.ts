import { useState, useRef, useEffect } from "react";

export interface ProductResult {
  id: number;
  slug?: string;
  name: string;
  category: string;
  category_slug?: string;
  category_name?: string;
  price: number;
  stars?: number | null;
  stock_status: boolean;
  image_url?: string | null;
  warranty: number;
  delivery_days: number;
  return_days: number;
  description?: string;
}
export interface CategoryResult {
  id: number;
  name: string;
  slug: string;
}

export function useGlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    products: ProductResult[];
    categories: CategoryResult[];
    productCount: number;
    categoryCount: number;
    next: string | null;
    previous: string | null;
    count: number;
  }>({
    products: [],
    categories: [],
    productCount: 0,
    categoryCount: 0,
    next: null,
    previous: null,
    count: 0,
  });
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!showSearchOverlay) return;
    function handleClick(e: MouseEvent) {
      if (overlayRef.current && !(overlayRef.current as HTMLElement).contains(e.target as Node)) {
        setShowSearchOverlay(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSearchOverlay]);

  const handleSearchOverlay = async (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    url?: string,
    pageSize?: number,
    append?: boolean,
    forceFetchAll?: boolean // internal flag to avoid recursive re-fetch
  ) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      let endpoint = url || `${process.env.NEXT_PUBLIC_API_URL}/parts/search/?q=${encodeURIComponent(
        searchQuery
      )}`;
      if (pageSize && pageSize > 0) {
        // Append page_size safely
        endpoint += endpoint.includes("?") ? `&page_size=${pageSize}` : `?page_size=${pageSize}`;
      }
      const res = await fetch(endpoint);
      const data = res.ok ? await res.json() : { products: [], categories: [], product_count: 0, category_count: 0 };
      const results = data.results || data;

      if (append) {
        setSearchResults((prev) => ({
          products: [...(prev.products || []), ...(results.products || [])],
          categories: results.categories || prev.categories || [],
          productCount: results.product_count || prev.productCount || 0,
          categoryCount: results.category_count || prev.categoryCount || 0,
          next: results.next || null,
          previous: results.previous || null,
          count: results.count || prev.count || 0,
        }));
      } else {
        setSearchResults({
          products: results.products || [],
          categories: results.categories || [],
          productCount: results.product_count || 0,
          categoryCount: results.category_count || 0,
          next: results.next || null,
          previous: results.previous || null,
          count: results.count || 0,
        });
      }

      // If API indicates more products via product_count but didn't provide `next`,
      // try fetching all results in one request by requesting page_size=product_count.
      // Avoid repeating this if forceFetchAll is true to prevent loops.
      const returnedCount = (results.products || []).length;
      const totalCount = results.product_count || results.count || 0;
      if (!results.next && totalCount > returnedCount && !pageSize && !forceFetchAll) {
        try {
          await handleSearchOverlay(undefined, undefined, totalCount, false, true);
        } catch (err) {
          // swallow — we already set partial results
          console.error('Failed to fetch expanded search results', err);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all pages by following `next` links and appending results. Useful for "Load all" behavior.
  const loadAllSearchResults = async (startUrl?: string) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      let endpoint = startUrl || `${process.env.NEXT_PUBLIC_API_URL}/parts/search/?q=${encodeURIComponent(
        searchQuery
      )}`;
      // ask for larger page size to reduce number of requests
      endpoint += endpoint.includes('?') ? '&page_size=100' : '?page_size=100';

      // Start by resetting results
      setSearchResults((prev) => ({ ...prev, products: [], categories: [], next: null, previous: null, count: 0 }));

      while (endpoint) {
        const res = await fetch(endpoint);
        if (!res.ok) break;
        const data = await res.json();
        const results = data.results || data;

        setSearchResults((prev) => ({
          products: [...(prev.products || []), ...(results.products || [])],
          categories: results.categories || prev.categories || [],
          productCount: results.product_count || prev.productCount || 0,
          categoryCount: results.category_count || prev.categoryCount || 0,
          next: results.next || null,
          previous: results.previous || null,
          count: results.count || prev.count || 0,
        }));

        endpoint = results.next || null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    showSearchOverlay,
    setShowSearchOverlay,
    searchResults,
    setSearchResults,
    activeTab,
    setActiveTab,
    isLoading,
    setIsLoading,
    hasSearched,
    setHasSearched,
    overlayRef,
    handleSearchOverlay,
    loadAllSearchResults,
    //ProductResult,
    //CategoryResult,
    //PropertyResult,
  };
}
