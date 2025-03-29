"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

const AdminManageTasks = ({ tasks }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [taskData, setTaskData] = useState(tasks);

  const router = useRouter()
  
    const deleteTask = async (taskId) => {
      try {
        const res= await fetch(`/api/admin/tasks/remove-task/${taskId}`, {
          method: "DELETE",
        });
  
        if (res.ok) {
          alert('Task Deleted!')
          router.refresh()
        } else {
          const errData = await res.json()
          alert(errData.message)
        }
        // Remove the deleted user from the state
        setTaskData((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting tasks:", error);
      }
    };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "taskTitle", header: "Name" },
      { accessorKey: "priority", header: "Email" },
      { accessorKey: "status", header: "Role" },
      {
        accessorKey: "taskAssignedBy?.username",
        header: "Leader Name",
        cell: ({ row }) => row?.original?.taskAssignedBy?.username || "N/A",
      },
      {
        id: "delete",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => deleteTask(row.original.id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );


  const table = useReactTable({
    data: taskData,
    columns,
    state: { sorting, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter
  });

  return (
    <div className="min-h-screen p-10 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Tasks</h2>
      <input
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 p-2 rounded w-full bg-gray-800 text-white"
      />
      <div className="overflow-x-auto bg-gray-800 rounded-lg p-4">
        <table className="w-full text-white">
          <thead className="bg-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-600 hover:bg-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-700 rounded"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {" "}
            {table.getPageCount()}
          </span>
          <button
            className="px-4 py-2 bg-gray-700 rounded"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminManageTasks;








