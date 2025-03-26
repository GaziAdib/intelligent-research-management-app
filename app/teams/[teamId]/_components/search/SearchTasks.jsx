"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchTasks = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");

  // Debounced Search Function
  const handleSearch = useCallback(
    (query) => {
      const params = new URLSearchParams(searchParams);

      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }

      replace(`${pathName}?${params.toString()}`);
    },
    [searchParams, pathName, replace]
  );

  // Debounce Effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500); 

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

  return (
    <input
      type="text"
      placeholder="🔍 Search tasks..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full p-2 text-white bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SearchTasks;






