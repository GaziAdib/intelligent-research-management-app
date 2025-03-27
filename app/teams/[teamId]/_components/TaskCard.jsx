"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEllipsisV, FaTrash, FaEdit, FaUser } from "react-icons/fa";

const TaskCard = ({ task }) => {

  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuClick = (taskId) => {
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const router = useRouter();

  const handleDeleteTask = async (taskId) => {
    console.log('Task id', taskId)
    try {
    
      const res = await fetch(`/api/leader/tasks/delete-task/${taskId}`, {
          method: 'DELETE'
      });

      if(res.ok) {
         router.refresh()
         alert('Task Deleted Successfully')
      } else {
        const errorData = await res.json()
        alert(errorData.message)
        console.log('Error Deleting task', errorData.message)
      }
     

  
  } catch (error) {
      console.error('Error deleting task:', error.message);
  }
  }

  return (
    <div
      className="relative p-6 rounded-lg border border-transparent bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
            style={{
              background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to)`,
            }}
          >
            {/* Priority (Top Left) */}
            <div className="absolute top-2 left-2">
              <span
                className={`text-xs mx-2 font-semibold px-3 py-1 rounded-full ${
                  task.priority === "HIGH"
                    ? "bg-red-700"
                    : task.priority === "MEDIUM"
                    ? "bg-yellow-700"
                    : "bg-green-700"
                }`}
              >
                {task.priority}
              </span>
            </div>

            {/* Status (Top Right) */}
            <div className="absolute top-2 right-2">
              <span
                className={`text-md font-semibold px-2 py-1 rounded-md ${
                  task.status === "Approved"
                    ? "bg-green-500"
                    : task.status === "Pending"
                    ? "bg-yellow-500"
                    : task.status === "Draft"
                    ? "bg-orange-400 text-slate-900"
                    : "bg-red-500"
                }`}
              >
                {task.status}
              </span>
            </div>

            {/* Task Assigned By */}
            <div className="mt-8 mb-4 flex items-center space-x-2">
              {/* Profile Image or Fallback Icon */}
              {task?.taskAssignedBy?.profileImageUrl ? (
                <img
                  src={task?.taskAssignedBy.profileImageUrl}
                  alt={task?.taskAssignedBy.username}
                  className="w-10 h-10 shadow-2xl rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <FaUser className="text-gray-400" />
                </div>
              )}
              <span className="text-sm text-gray-400">
                Assigned:{" "}
                <span className="text-white font-medium">
                  {task?.taskAssignedBy?.username}
                </span>
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-2">{task?.taskTitle}</h3>

            {/* Description */}
            <p className="text-gray-400 mb-4">{task?.taskShortDescription}</p>

            {/* Created At */}
            <div className="text-sm text-gray-500 mb-6">
              Created:{" "}
              <span className="text-yellow-400">
                {formatDate(task?.createdAt)}
              </span>
            </div>

            {/* View Details Button */}
            <Link href={`/tasks/detail/${task.id}/${task?.teamId}`} className="w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
              View
            </Link>

            {/* Context Menu */}
            <div className="absolute bottom-2 right-2">
              <button
                onClick={() => handleMenuClick(task?.id)}
                className="p-2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-300"
              >
                <FaEllipsisV />
              </button>

              {/* Context Menu Options */}
              {openMenuId === task?.id && (
                <div className="absolute right-0 bottom-8 bg-gray-800 rounded-lg shadow-lg w-32 overflow-hidden animate-fade-in">
                  <button
                    onClick={() => console.log("Edit:", task?.id)}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-700 transition-colors duration-300"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
  )
}

export default TaskCard