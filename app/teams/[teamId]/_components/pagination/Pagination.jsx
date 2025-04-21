"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ totalPages }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { replace, refresh } = useRouter()

  // Ensure pageNumber defaults to 1 if not present
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams);

    if(newPage) {
        params.set("pageNumber", newPage.toString()); // Set the page number as a string
        replace(`${pathname}?${params.toString()}`);
    } else {
        params.delete("pageNumber");
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
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

