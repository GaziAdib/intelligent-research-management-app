// "use client";

// import { useState } from "react";
// import { FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa";

// const TaskLists = ({ tasks }) => {
//   const [openMenuId, setOpenMenuId] = useState(null);

//   const handleMenuClick = (taskId) => {
//     setOpenMenuId(openMenuId === taskId ? null : taskId);
//   };

//   // Function to format the date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-dark text-white p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {tasks.map((task) => (
//           <div
//             key={task?.id}
//             className="relative p-6 rounded-lg border border-transparent bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
//             style={{
//               background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to)`,
//             }}
//           >
//             {/* Priority (Top Left) */}
//             <div className="absolute top-2 left-2">
//               <span
//                 className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                   task.priority === "High"
//                     ? "bg-red-500"
//                     : task.priority === "Medium"
//                     ? "bg-yellow-500"
//                     : "bg-green-500"
//                 }`}
//               >
//                 {task.priority}
//               </span>
//             </div>

//             {/* Status (Top Right) */}
//             <div className="absolute top-2 right-2">
//               <span
//                 className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                   task.status === "Completed"
//                     ? "bg-green-500"
//                     : task.status === "In Progress"
//                     ? "bg-yellow-500"
//                     : "bg-red-500"
//                 }`}
//               >
//                 {task.status}
//               </span>
//             </div>

//             {/* Title */}
//             <h3 className="text-xl font-bold mt-8 mb-2">{task.taskTitle}</h3>

//             {/* Description */}
//             <p className="text-gray-400 mb-4">{task.taskShortDescription}</p>

//             {/* Created At */}
//             <div className="text-sm text-gray-500 mb-6">
//               Created:{" "}
//               <span className="text-yellow-400">
//                 {formatDate(task.createdAt)}
//               </span>
//             </div>

//             {/* View Details Button */}
//             <button className="w-1/3 bg-gray-200 text-slate-900 font-medium py-1 px-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300">
//               View
//             </button>

//             {/* Context Menu */}
//             <div className="absolute bottom-2 right-2">
//               <button
//                 onClick={() => handleMenuClick(task.id)}
//                 className="p-2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-300"
//               >
//                 <FaEllipsisV />
//               </button>

//               {/* Context Menu Options */}
//               {openMenuId === task.id && (
//                 <div className="absolute right-0 bottom-8 bg-gray-800 rounded-lg shadow-lg w-32 overflow-hidden animate-fade-in">
//                   <button
//                     onClick={() => console.log("Edit:", task.id)}
//                     className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300"
//                   >
//                     <FaEdit className="mr-2" /> Edit
//                   </button>
//                   <button
//                     onClick={() => console.log("Delete:", task.id)}
//                     className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-700 transition-colors duration-300"
//                   >
//                     <FaTrash className="mr-2" /> Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TaskLists

// // export default TaskLists;
// // "use client";

// // import { useState } from "react";
// // import { FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa";

// // const TaskLists = ({ tasks }) => {
// //   const [openMenuId, setOpenMenuId] = useState(null);

// //   const handleMenuClick = (taskId) => {
// //     setOpenMenuId(openMenuId === taskId ? null : taskId);
// //   };

// //   // Function to format the date
// //   const formatDate = (dateString) => {
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString("en-US", {
// //       year: "numeric",
// //       month: "short",
// //       day: "numeric",
// //     });
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-950 text-white p-6">
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {tasks.map((task) => (
// //           <div
// //             key={task?.id}
// //             className="relative p-6 rounded-lg border border-transparent bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
// //             style={{
// //               background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to)`,
// //             }}
// //           >
// //             {/* Priority (Top Left) */}
// //             <div className="absolute top-2 left-2">
// //               <span
// //                 className={`text-xs font-semibold px-3 mx-3 py-1 rounded-full ${
// //                   task.priority === "HIGH"
// //                     ? "bg-red-700"
// //                     : task.priority === "MEDIUM"
// //                     ? "bg-yellow-700"
// //                     : "bg-green-700"
// //                 }`}
// //               >
// //                 {task.priority}
// //               </span>
// //             </div>

// //             {/* Status (Top Right) */}
// //             <div className="absolute top-2 right-2">
// //               <span
// //                 className={`text-xs font-semibold px-2 py-1 rounded-full ${
// //                   task.status === "Approved"
// //                     ? "bg-green-500"
// //                     : task.status === "Pending"
// //                     ? "bg-yellow-500"
// //                     : "bg-red-500"
// //                 }`}
// //               >
// //                 {task.status}
// //               </span>
// //             </div>

// //             <p className="mt-3 py-2">Task By: {task?.taskAssignedBy?.username}</p>

// //             {/* Title */}
// //             <h3 className="text-xl font-bold mt-4 mb-2">{task.taskTitle}</h3>

// //             {/* Description */}
// //             <p className="text-gray-400 mb-4">{task.taskShortDescription}</p>

// //             {/* Created At */}
// //             <div className="text-sm text-gray-500 mb-6">
// //               Created:{" "}
// //               <span className="text-yellow-400">
// //                 {formatDate(task.createdAt)}
// //               </span>
// //             </div>

// //             {/* View Details Button */}
// //             <button className="w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
// //               View
// //             </button>

// //             {/* Context Menu */}
// //             <div className="absolute bottom-2 right-2">
// //               <button
// //                 onClick={() => handleMenuClick(task.id)}
// //                 className="p-2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-300"
// //               >
// //                 <FaEllipsisV />
// //               </button>

// //               {/* Context Menu Options */}
// //               {openMenuId === task.id && (
// //                 <div className="absolute right-0 bottom-8 bg-gray-800 rounded-lg shadow-lg w-32 overflow-hidden animate-fade-in">
// //                   <button
// //                     onClick={() => console.log("Edit:", task.id)}
// //                     className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300"
// //                   >
// //                     <FaEdit className="mr-2" /> Edit
// //                   </button>
// //                   <button
// //                     onClick={() => console.log("Delete:", task.id)}
// //                     className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-700 transition-colors duration-300"
// //                   >
// //                     <FaTrash className="mr-2" /> Delete
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default TaskLists;


// "use client";

// import { useState } from "react";
// import { FaEllipsisV, FaTrash, FaEdit, FaUser } from "react-icons/fa";

// const TaskLists = ({ tasks }) => {
//   const [openMenuId, setOpenMenuId] = useState(null);

//   const handleMenuClick = (taskId) => {
//     setOpenMenuId(openMenuId === taskId ? null : taskId);
//   };

//   // Function to format the date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 text-white p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {tasks.map((task) => (
//           <div
//             key={task?.id}
//             className="relative p-6 rounded-lg border border-transparent bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
//             style={{
//               background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to)`,
//             }}
//           >
//             {/* Priority (Top Left) */}
//             <div className="absolute top-2 left-2">
//               <span
//                 className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                   task.priority === "HIGH"
//                     ? "bg-red-700"
//                     : task.priority === "MEDIUM"
//                     ? "bg-yellow-700"
//                     : "bg-green-700"
//                 }`}
//               >
//                 {task.priority}
//               </span>
//             </div>

//             {/* Status (Top Right) */}
//             <div className="absolute top-2 right-2">
//               <span
//                 className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                   task.status === "Approved"
//                     ? "bg-green-500"
//                     : task.status === "Pending"
//                     ? "bg-yellow-500"
//                     : "bg-red-500"
//                 }`}
//               >
//                 {task.status}
//               </span>
//             </div>

//             {/* Task Assigned By */}
//             <div className="mt-8 mb-4 flex items-center space-x-2">
//               <FaUser className="text-gray-400" />
//               <span className="text-sm text-gray-400">
//                 Assigned: {" "}
//                 <span className="text-white font-medium">
//                   {task?.taskAssignedBy?.username}
//                 </span>
//               </span>
//             </div>

//             {/* Title */}
//             <h3 className="text-xl font-bold mb-2">{task.taskTitle}</h3>

//             {/* Description */}
//             <p className="text-gray-400 mb-4">{task.taskShortDescription}</p>

//             {/* Created At */}
//             <div className="text-sm text-gray-500 mb-6">
//               Created:{" "}
//               <span className="text-yellow-400">
//                 {formatDate(task.createdAt)}
//               </span>
//             </div>

//             {/* View Details Button */}
//             <button className="w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
//               View
//             </button>

//             {/* Context Menu */}
//             <div className="absolute bottom-2 right-2">
//               <button
//                 onClick={() => handleMenuClick(task.id)}
//                 className="p-2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-300"
//               >
//                 <FaEllipsisV />
//               </button>

//               {/* Context Menu Options */}
//               {openMenuId === task.id && (
//                 <div className="absolute right-0 bottom-8 bg-gray-800 rounded-lg shadow-lg w-32 overflow-hidden animate-fade-in">
//                   <button
//                     onClick={() => console.log("Edit:", task.id)}
//                     className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300"
//                   >
//                     <FaEdit className="mr-2" /> Edit
//                   </button>
//                   <button
//                     onClick={() => console.log("Delete:", task.id)}
//                     className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-700 transition-colors duration-300"
//                   >
//                     <FaTrash className="mr-2" /> Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TaskLists;

// "use client";

// import { useEffect, useState } from "react";
// import TaskCard from "./TaskCard";
// import Pusher from "pusher-js";

// const TaskLists = ({ tasks: initialTasks, teamId }) => {

//   const [tasks, setTasks] = useState([...initialTasks]); // State to handle task list

//   useEffect(() => {
//     const pusher = new Pusher("fbd04a7c8844115f0fd9", {
//       cluster: "us3",
//       forceTLS: true,
//       enabledTransports: ["ws", "wss"], // Ensure WebSockets are used
//     });

//     const channel = pusher.subscribe(`team-${teamId}`);

//    console.log("Subscribed to channel:", `team-${teamId}`);

//   channel.bind("task-approved", (data) => {
//     console.log("Received event data:", JSON.stringify(data));
//     setTasks((prevTasks) =>
//       prevTasks.map((task) =>
//         task.id === data.taskId ? { ...task, status: data.status } : task
//       )
//     );
//   });

//   channel.bind("task-rejected", (data) => {
//     console.log("Received event data:", JSON.stringify(data));
//     setTasks((prevTasks) =>
//       prevTasks.map((task) =>
//         task.id === data.taskId ? { ...task, status: data.status } : task
//       )
//     );
//   });



    

//   return () => {
//     channel.unbind_all();
//     channel.unsubscribe();
//     pusher.disconnect(); 
//   };


//   },[teamId])

//   return (
//     <div className="min-h-screen  text-white p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {tasks?.map((task) => (
//           <TaskCard key={task.id} task={task} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TaskLists;

"use client";

import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import Pusher from "pusher-js";

const TaskLists = ({ tasks: initialTasks, teamId }) => {
  // Initialize state with initialTasks, defaulting to an empty array if undefined
  const [tasks, setTasks] = useState(initialTasks || []);

  useEffect(() => {
    // Ensure initialTasks is used to update state if it changes
    setTasks(initialTasks || []);
  }, [initialTasks]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher("fbd04a7c8844115f0fd9", {
      cluster: "us3",
      forceTLS: true,
      enabledTransports: ["ws", "wss"], // Ensure WebSockets are used
    });

    // Subscribe to the team channel
    const channel = pusher.subscribe(`team-${teamId}`);
    console.log("Subscribed to channel:", `team-${teamId}`);

    // Bind to task-approved event
    channel.bind("task-approved", (data) => {
      console.log("Received event data:", JSON.stringify(data));
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === data.taskId ? { ...task, status: data.status } : task
        )
      );
    });

    // Bind to task-rejected event
    channel.bind("task-rejected", (data) => {
      console.log("Received event data:", JSON.stringify(data));
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === data.taskId ? { ...task, status: data.status } : task
        )
      );
    });

    // Cleanup function
    return () => {
      channel.unbind_all();
      channel.unsubscribe(); 
      pusher.disconnect();
    };
  }, [teamId]); 

  return (
    <div className="min-h-screen text-white p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskLists;