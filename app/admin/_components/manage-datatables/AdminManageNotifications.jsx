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

const AdminManageNotifications = ({ notifications }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [notificationData, setNotificationData] = useState(notifications);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const router = useRouter();

  // Toggle selection of a single notification
  const toggleSelection = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  // Toggle all notifications selection
  const toggleSelectAll = () => {
    if (selectedNotifications.length === notificationData.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notificationData.map((n) => n.id));
    }
  };

  // Delete single notification
  const deleteNotification = async (notificationId) => {
    try {
      const res = await fetch(`/api/admin/notifications/remove-notification/${notificationId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Notification Deleted!");
        setNotificationData((prev) => prev.filter((n) => n.id !== notificationId));
        setSelectedNotifications((prev) => prev.filter((id) => id !== notificationId));
        router.refresh();
      } else {
        const errData = await res.json();
        alert(errData.message);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Bulk delete selected notifications
  const deleteSelectedNotifications = async () => {
    if (selectedNotifications.length === 0) return alert("No notifications selected!");

    try {
      const res = await fetch(`/api/admin/notifications/remove-multiple-notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: selectedNotifications }),
      });

      if (res.ok) {
        alert("Selected notifications deleted!");
        setNotificationData((prev) => prev.filter((n) => !selectedNotifications.includes(n.id)));
        setSelectedNotifications([]);
        router.refresh();
      } else {
        const errData = await res.json();
        alert(errData.message);
      }
    } catch (error) {
      console.error("Error deleting multiple notifications:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={selectedNotifications.length === notificationData.length}
            onChange={toggleSelectAll}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedNotifications.includes(row.original.id)}
            onChange={() => toggleSelection(row.original.id)}
          />
        ),
      },
      { accessorKey: "id", header: "ID" },
      { accessorKey: "message", header: "Message" },
      { accessorKey: "type", header: "Type" },
      {
        accessorKey: "team.teamName",
        header: "Team",
        cell: ({ row }) => row?.original?.team?.teamName || "N/A",
      },
      {
        id: "delete",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => deleteNotification(row.original.id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        ),
      },
    ],
    [selectedNotifications]
  );

  const table = useReactTable({
    data: notificationData,
    columns,
    state: { sorting, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="p-10 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Notifications</h2>

      <input
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 p-2 rounded w-full bg-gray-800 text-white"
      />

      <button
        onClick={deleteSelectedNotifications}
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-600"
        disabled={selectedNotifications.length === 0}
      >
        Delete Selected ({selectedNotifications.length})
      </button>

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
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-600 hover:bg-gray-700">
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
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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

export default AdminManageNotifications;











// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   flexRender,
// } from "@tanstack/react-table";
// import { useRouter } from "next/navigation";

// const AdminManageNotifications = ({ notifications }) => {
//   const [sorting, setSorting] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [notificationData, setNotificationData] = useState(notifications);

//   const router = useRouter()
  
//     const deleteNotification = async (notificationId) => {
//       try {
//         const res= await fetch(`/api/admin/notifications/remove-notification/${notificationId}`, {
//           method: "DELETE",
//         });
  
//         if (res.ok) {
//           alert('Notifications Deleted!')
//           router.refresh()
//         } else {
//           const errData = await res.json()
//           alert(errData.message)
//         }
//         // Remove the deleted user from the state
//         setNotificationData((prevNotifications) => prevNotifications.filter((notification) => notification.id !== notificationId));
//       } catch (error) {
//         console.error("Error deleting notifications:", error);
//       }
//     };

//   const columns = useMemo(
//     () => [
//       { accessorKey: "id", header: "ID" },
//       { accessorKey: "message", header: "Message" },
//       { accessorKey: "type", header: "type" },
//       {
//         accessorKey: "team.teamName",
//         header: "Team",
//         cell: ({ row }) => row?.original?.team?.teamName || "N/A",
//       },
//       {
//         id: "delete",
//         header: "Actions",
//         cell: ({ row }) => (
//           <button
//             onClick={() => deleteNotification(row.original.id)}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Delete
//           </button>
//         ),
//       },
//     ],
//     []
//   );



//   const table = useReactTable({
//     data: notificationData,
//     columns,
//     state: { sorting, globalFilter },
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onSortingChange: setSorting,
//     getFilteredRowModel: getFilteredRowModel(),
//     onGlobalFilterChange: setGlobalFilter
//   });

//   return (
//     <div className="min-h-screen p-10 bg-gray-900 text-white">
//       <h2 className="text-2xl font-bold mb-4">Manage Notifications</h2>
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

// export default AdminManageNotifications;








