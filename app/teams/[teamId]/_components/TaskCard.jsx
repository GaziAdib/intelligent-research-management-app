"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEllipsisV, FaTrash, FaEdit, FaUser, FaCalendarAlt, FaEye } from "react-icons/fa";


const TaskCard = ({ task }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleMenuClick = (taskId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteTask = async (taskId) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/leader/tasks/delete-task/${taskId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Task deleted successfully')
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to delete task')
      }
    } catch (error) {
      alert('an error occurred while deleting the task')
      console.error('Error deleting task:', error.message);
    } finally {
      setIsDeleting(false);
      setOpenMenuId(null);
    }
  };

  const priorityColors = {
    HIGH: "bg-red-600/90",
    MEDIUM: "bg-amber-500/90",
    LOW: "bg-emerald-500/90"
  };

  const statusColors = {
    Approved: "bg-green-500/90",
    Pending: "bg-yellow-500/90",
    Draft: "bg-orange-400/90 text-slate-900",
    Rejected: "bg-red-500/90"
  };

  return (
    <div className="relative p-6 rounded-xl bg-gray-800/50 border-2 border-gray-600 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden">
      {/* Glow effect based on priority */}
      <div className={`absolute inset-0 opacity-10 ${priorityColors[task.priority]} rounded-xl pointer-events-none`}></div>
      
      {/* Priority and Status Badges */}
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${priorityColors[task.priority]} text-white`}>
          {task?.priority}
        </span>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[task.status]}`}>
          {task?.status}
        </span>
      </div>

      {/* Task Assigned By */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          {task?.taskAssignedBy?.profileImageUrl ? (
            <img
              src={task?.taskAssignedBy.profileImageUrl}
              alt={task?.taskAssignedBy.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
              <FaUser className="text-gray-400 text-sm" />
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 bg-gray-800 border-2 border-gray-700 rounded-full w-5 h-5 flex items-center justify-center">
            <span className="text-xs">👑</span>
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-400">Assigned by</p>
          <p className="text-sm font-medium text-white">{task?.taskAssignedBy?.username || "Unknown"}</p>
        </div>
      </div>

      {/* Task Content */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
        {task?.taskTitle?.length > 20 
          ? `${task.taskTitle.substring(0, 20)}...` 
          : task?.taskTitle}
      </h3>
      <p className="text-gray-400 text-sm line-clamp-3">
        {task?.taskShortDescription?.length > 30
          ? `${task.taskShortDescription.substring(0, 30)}...`
          : task?.taskShortDescription}
      </p>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-400 text-sm">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          <span className="text-xs md:text-sm lg:text-md">{formatDate(task?.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href={`/tasks/detail/${task.id}/${task?.teamId}`} 
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-md"
          >
            <FaEye size={12} />
            <span>View</span>
          </Link>

          {/* Context Menu */}
          <div className="relative">
            <button
              onClick={(e) => handleMenuClick(task?.id, e)}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors duration-300"
            >
              <FaEllipsisV size={14} />
            </button>

            {openMenuId === task?.id && (
              <div className="absolute right-0 bottom-10 bg-gray-800 rounded-lg shadow-xl w-40 overflow-hidden border border-gray-700 z-10 animate-fade-in">
                <button
                  onClick={() => {
                    setOpenMenuId(null);
                    console.log("Edit:", task?.id);
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/80 transition-colors duration-200"
                >
                  <FaEdit className="mr-3 text-blue-400" size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={isDeleting}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700/80 transition-colors duration-200"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash className="mr-3" size={12} />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;








// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { FaEllipsisV, FaTrash, FaEdit, FaUser } from "react-icons/fa";

// const TaskCard = ({ task }) => {

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

//   const router = useRouter();

//   const handleDeleteTask = async (taskId) => {
//     console.log('Task id', taskId)
//     try {
    
//       const res = await fetch(`/api/leader/tasks/delete-task/${taskId}`, {
//           method: 'DELETE'
//       });

//       if(res.ok) {
//          router.refresh()
//          alert('Task Deleted Successfully')
//       } else {
//         const errorData = await res.json()
//         alert(errorData.message)
//         console.log('Error Deleting task', errorData.message)
//       }
     

  
//   } catch (error) {
//       console.error('Error deleting task:', error.message);
//   }
//   }

//   return (
//     <div
//       className="relative p-6 rounded-lg border border-transparent bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
//             style={{
//               background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to)`,
//             }}
//           >
//             {/* Priority (Top Left) */}
//             <div className="absolute top-2 left-2">
//               <span
//                 className={`text-xs mx-2 font-semibold px-3 py-1 rounded-full ${
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
//                 className={`text-md font-semibold px-2 py-1 rounded-md ${
//                   task.status === "Approved"
//                     ? "bg-green-500"
//                     : task.status === "Pending"
//                     ? "bg-yellow-500"
//                     : task.status === "Draft"
//                     ? "bg-orange-400 text-slate-900"
//                     : "bg-red-500"
//                 }`}
//               >
//                 {task.status}
//               </span>
//             </div>

//             {/* Task Assigned By */}
//             <div className="mt-8 mb-4 flex items-center space-x-2">
//               {/* Profile Image or Fallback Icon */}
//               {task?.taskAssignedBy?.profileImageUrl ? (
//                 <img
//                   src={task?.taskAssignedBy.profileImageUrl}
//                   alt={task?.taskAssignedBy.username}
//                   className="w-10 h-10 shadow-2xl rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
//                   <FaUser className="text-gray-400" />
//                 </div>
//               )}
//               <span className="text-sm text-gray-400">
//                 Assigned:{" "}
//                 <span className="text-white font-medium">
//                   {task?.taskAssignedBy?.username}
//                 </span>
//               </span>
//             </div>

//             {/* Title */}
//             <h3 className="text-xl font-bold mb-2">{task?.taskTitle}</h3>

        

//             {/* Description */}
//             <p className="text-gray-400 mb-4">{task?.taskShortDescription}</p>

//             {/* Created At */}
//             <div className="text-sm text-gray-500 mb-6">
//               Created:{" "}
//               <span className="text-yellow-400">
//                 {formatDate(task?.createdAt)}
//               </span>
//             </div>

//             {/* View Details Button */}
//             <Link href={`/tasks/detail/${task.id}/${task?.teamId}`} className="w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
//               View
//             </Link>

//             {/* Context Menu */}
//             <div className="absolute bottom-2 right-2">
//               <button
//                 onClick={() => handleMenuClick(task?.id)}
//                 className="p-2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-300"
//               >
//                 <FaEllipsisV />
//               </button>

//               {/* Context Menu Options */}
//               {openMenuId === task?.id && (
//                 <div className="absolute right-0 bottom-8 bg-gray-800 rounded-lg shadow-lg w-32 overflow-hidden animate-fade-in">
//                   <button
//                     onClick={() => console.log("Edit:", task?.id)}
//                     className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300"
//                   >
//                     <FaEdit className="mr-2" /> Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteTask(task.id)}
//                     className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-700 transition-colors duration-300"
//                   >
//                     <FaTrash className="mr-2" /> Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//   )
// }

// export default TaskCard