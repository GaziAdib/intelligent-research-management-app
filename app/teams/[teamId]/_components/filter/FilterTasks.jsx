"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const FilterTasks = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  // Get initial status from URL (if exists)
  const initialStatus = searchParams.get("status") || "";

  const [status, setStatus] = useState(initialStatus);

  const handleChange = (e) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus); // Update state properly

    console.log("Selected Status:", selectedStatus); // Debugging

    const params = new URLSearchParams(searchParams);
    
    if (selectedStatus) {
      params.set("status", selectedStatus);
    } else {
      params.delete("status");
    }

    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      className="w-full md:w-48 p-2 text-white bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">📌 All Status</option>
      <option value="Approved">✅ Approved</option>
      <option value="Pending">⏳ Pending</option>
      <option value="Rejected">👎 Rejected</option>
      <option value="Draft">📄 Draft</option>
    </select>
  );
};

export default FilterTasks;
