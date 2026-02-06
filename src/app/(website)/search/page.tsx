"use client";

import SearchResultsPage from "@/components/Search/SearchResultsPage";
import { Suspense } from "react";

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <SearchResultsPage />
    </Suspense>
  );
};

export default SearchPage;

