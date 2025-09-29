"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const loading = loadingCount > 0;

  const startLoading = React.useCallback(() => setLoadingCount((count) => count + 1), []);
  const stopLoading = React.useCallback(() => setLoadingCount((count) => Math.max(0, count - 1)), []);

  const contextValue = React.useMemo(() => ({ loading, startLoading, stopLoading }), [loading, startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within LoadingProvider");
  return context;
};
