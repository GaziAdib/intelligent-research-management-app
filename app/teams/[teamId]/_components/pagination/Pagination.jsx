"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Ensure pageNumber defaults to 1 if not present
  const pageNumber = Number(searchParams.get("pageNumber")) || 0;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams);
    params.set("pageNumber", newPage.toString()); // Set the page number as a string

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(pageNumber - 1)}
        disabled={pageNumber === 1}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg transition-all duration-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Number Display */}
      <span className="px-4 py-2 bg-gray-900 text-white rounded-lg text-lg font-semibold shadow-lg">
        Page {pageNumber} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(pageNumber + 1)}
        disabled={pageNumber >= totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg transition-all duration-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;

// "use client";

// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { useState } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const Pagination = ({ totalPages }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   const[myNumber, setNumber] = useState(1);

//   // Ensure pageNumber defaults to 1 if not present
//   const pageNumber = Number(searchParams.get("pageNumber")) || 1;

//   const handlePageChange = (newPage) => {
//     setNumber(newPage);
//     const pageStr = String(newPage); // Ensure it's treated as a string

//     if (Number(pageStr) < 1 || Number(pageStr) > totalPages) return;

//     const params = new URLSearchParams(searchParams);
//     params.set("pageNumber", myNumber?.toString()); // Set the page number as a string

//     router.replace(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <div className="flex items-center justify-center gap-4 mt-8">
//       {/* Previous Button */}
//       <button
//         onClick={() => handlePageChange(pageNumber - 1)}
//         //disabled={pageNumber === 1}
//         className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg transition-all duration-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         <FaChevronLeft />
//         <span className="hidden sm:inline">Previous</span>
//       </button>

//       {/* Page Number Display */}
//       <span className="px-4 py-2 bg-gray-900 text-white rounded-lg text-lg font-semibold shadow-lg">
//         Page {pageNumber} of {totalPages}
//       </span>

//       {/* Next Button */}
//       <button
//         onClick={() => handlePageChange(pageNumber + 1)}
//         //disabled={pageNumber >= totalPages}
//         className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg transition-all duration-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         <span className="hidden sm:inline">Next</span>
//         <FaChevronRight />
//       </button>
//     </div>
//   );
// };

// export default Pagination;



// "use client";

// import { useRouter, useSearchParams } from "next/navigation";

// const Pagination = ({ totalPages }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pageNumber = Number(searchParams.get("pageNumber")) || 1;

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     const params = new URLSearchParams(searchParams);
//     params.set("pageNumber", newPage);
//     router.push(`?${params.toString()}`);
//   };

//   return (
//     <div className="flex mb-10 bg-gray-200 items-center justify-center gap-4 mt-6">
//       <button
//         onClick={() => handlePageChange(pageNumber - 1)}
//         disabled={pageNumber === 1}
//         className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
//       >
//         Previous
//       </button>
//       <span className="text-white text-lg">
//         Page {pageNumber} of {totalPages}
//       </span>
//       <button
//         onClick={() => handlePageChange(pageNumber + 1)}
//         disabled={pageNumber >= totalPages}
//         className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default Pagination;
