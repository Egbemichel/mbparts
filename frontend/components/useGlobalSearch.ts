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
export interface PropertyResult {
  id: number;
  name: string;
}

export function useGlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    products: ProductResult[];
    categories: CategoryResult[];
    properties: PropertyResult[];
    productCount: number;
    categoryCount: number;
    next: string | null;
    previous: string | null;
    count: number;
  }>({
    products: [],
    categories: [],
    properties: [],
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
    url?: string
  ) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      const endpoint = url || `${process.env.NEXT_PUBLIC_API_URL}/parts/search/?q=${searchQuery}`;
      const res = await fetch(endpoint);
      const data = res.ok ? await res.json() : { products: [], categories: [], product_count: 0, category_count: 0 };
      const results = data.results || data;
      setSearchResults({
        products: results.products || [],
        categories: results.categories || [],
        properties: [],
        productCount: results.product_count || 0,
        categoryCount: results.category_count || 0,
        next: results.next || null,
        previous: results.previous || null,
        count: results.count || 0,
      });
      console.log("Search results:", results);
    } catch {
      setSearchResults({ products: [], categories: [], properties: [], productCount: 0, categoryCount: 0, next: null, previous: null, count: 0 });
    }
    setIsLoading(false);
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
    //ProductResult,
    //CategoryResult,
    //PropertyResult,
  };
}
