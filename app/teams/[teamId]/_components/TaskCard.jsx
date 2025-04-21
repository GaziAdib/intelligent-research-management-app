"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEllipsisV, FaTrash, FaEdit, FaUser, FaCalendarAlt, FaEye } from "react-icons/fa";
import { toast } from "sonner";


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
        toast.success('Task deleted successfully!')
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to delete task')
      }
    } catch (error) {
      toast.error('Error deleting task:', error.message);
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
              src={task?.taskAssignedBy?.profileImageUrl}
              alt={task?.taskAssignedBy?.username}
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
        <h3 className="text-md lg:text-xl md:text-lg font-bold text-white mb-2 line-clamp-2">
        {task?.taskTitle?.length > 30 
          ? `${task.taskTitle.substring(0,30)}...` 
          : task?.taskTitle}
      </h3>
      <p className="text-gray-400 text-sm line-clamp-3">
        {task?.taskShortDescription?.length > 40
          ? `${task.taskShortDescription.substring(0, 40)}...`
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







