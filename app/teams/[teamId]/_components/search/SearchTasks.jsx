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
      className="w-full md:w-64 p-2 text-white bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SearchTasks;






// "use client";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";


// const SearchTasks = () => {
  
//   const searchParams = useSearchParams();

//   const pathName = usePathname()
  
//   const {replace} = useRouter()



//   const handleSearch = (searchQuery) => {
    
//     const params = new URLSearchParams(searchParams);

//         if (searchQuery) {
//             params.set('query', searchQuery);
//         } else {
//             params.delete('query');
//         }

//         replace(`${pathName}?${params.toString()}`) //http://localhost:3000/blogs?query=science

   
//   };

//   return (
//     <input
//       type="text"
//       placeholder="🔍 Search tasks..."
//       onChange={(e) => handleSearch(e.target.value) }
//       className="w-full md:w-64 p-2 text-white bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//   );
// };

// export default SearchTasks;
