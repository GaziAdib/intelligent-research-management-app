"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

const AdminManageUsers = ({ users }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [userData, setUserData] = useState(users);

  const router = useRouter();

  const deleteUser = async (userId) => {
    try {
      const res= await fetch(`/api/admin/users/remove-user/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert('User Deleted!')
        router.refresh()
      } else {
        const errData = await res.json()
        alert(errData.message)
      }
      // Remove the deleted user from the state
      setUserData((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      {
        accessorKey: "profileImageUrl",
        header: "Avatar",
        cell: ({ getValue }) => (
          <img
            src={getValue() || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
      },
      { accessorKey: "username", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role", header: "Role" },
      {
        id: "delete",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => deleteUser(row.original.id)}
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
    data: userData,
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
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
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

export default AdminManageUsers;










// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
// } from "@tanstack/react-table";

// const AdminManageUsers = ({ users }) => {
//   const [sorting, setSorting] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");

//   const columns = useMemo(
//     () => [
//       { accessorKey: "id", header: "ID" },
//       {
//         accessorKey: "profileImageUrl",
//         header: "Avatar",
//         cell: ({ getValue }) => (
//           <img
//             src={getValue() || "https://via.placeholder.com/40"}
//             alt="Profile"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//         ),
//       },
//       { accessorKey: "username", header: "Name" },
//       { accessorKey: "email", header: "Email" },
//       { accessorKey: "role", header: "Role" },
//     ],
//     []
//   );

//   const table = useReactTable({
//     data: users,
//     columns,
//     state: { sorting, globalFilter },
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onSortingChange: setSorting,
//   });

//   return (
//     <div className="min-h-screen p-10 bg-gray-900 text-white">
//       <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
//       <input
//         type="text"
//         placeholder="Search..."
//         value={globalFilter}
//         onChange={(e) => setGlobalFilter(e.target.value)}
//         className="mb-4 p-2 rounded w-full bg-gray-800 text-white"
//       />
//       <div className="overflow-x-auto bg-gray-800 rounded-lg p-4">
//         <table className="w-full text-white">
//           <thead className="bg-gray-700">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <th
//                     key={header.id}
//                     className="px-4 py-2 text-left cursor-pointer"
//                     onClick={header.column.getToggleSortingHandler()}
//                   >
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.map((row) => (
//               <tr
//                 key={row.id}
//                 className="border-b border-gray-600 hover:bg-gray-700"
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <td key={cell.id} className="px-4 py-2">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="flex justify-between mt-4">
//           <button
//             className="px-4 py-2 bg-gray-700 rounded"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </button>
//           <span>
//             Page {table.getState().pagination.pageIndex + 1} of {" "}
//             {table.getPageCount()}
//           </span>
//           <button
//             className="px-4 py-2 bg-gray-700 rounded"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminManageUsers;








// "use client";
// import React, { useMemo } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
// } from "@tanstack/react-table";

// const AdminManageUsers = ({ users }) => {
//   const columns = useMemo(
//     () => [
//       { accessorKey: "id", header: "ID" },
//       { accessorKey: "profileImageUrl", header: "Avatar" },
//       { accessorKey: "username", header: "Name" },
//       { accessorKey: "email", header: "Email" },
//       { accessorKey: "role", header: "Role" },
//     ],
//     []
//   );

//   const table = useReactTable({
//     data: users,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <div className="min-h-screen p-10 bg-gray-900 text-white">
//       <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
//       <div className="overflow-x-auto bg-gray-800 rounded-lg p-4">
//         <table className="w-full text-white">
//           <thead className="bg-gray-700">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <th key={header.id} className="px-4 py-2 text-left">
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.map((row) => (
//               <tr key={row.id} className="border-b border-gray-600 hover:bg-gray-700">
//                 {row.getVisibleCells().map((cell) => (
//                   <td key={cell.id} className="px-4 py-2">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminManageUsers;
