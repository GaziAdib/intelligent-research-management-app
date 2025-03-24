"use client";
import { useState } from "react";

const SearchTasks = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
   
  };

  return (
    <input
      type="text"
      placeholder="🔍 Search tasks..."
      value={query}
      onChange={handleSearch}
      className="w-full md:w-64 p-2 text-white bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SearchTasks;
