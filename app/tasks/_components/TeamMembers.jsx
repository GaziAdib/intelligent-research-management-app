"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AssignedMemberLists from "./grid/AssignedMemberLists";
import { toast } from "sonner";


const TeamMembers = ({ members, taskId, teamId, leaderId, assignedMembers }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const session = useSession();
  const router = useRouter();
  const currentUserId = session?.data?.user?.id;

  // Assigned members with full details
  const assignedMembersDetails = members?.filter((member) =>
    assignedMembers?.includes(member?.user?.id)
  );

  // Available members to assign
  const availableMembers = members?.filter(
    (member) => !assignedMembers?.includes(member?.user?.id)
  );

  const handleAssignMemberToTask = async (memberId) => {
    if (currentUserId !== leaderId) {
      toast.info('You are not authorized to perform this action')
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [memberId]: true }));

    try {
      const res = await fetch(
        `/api/leader/tasks/assign-task/${memberId}/${taskId}/${teamId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        toast.success('Member assigned to task successfully!')
        router.refresh();
      } else {
        const errData = await res.json()
        toast.error(errData.message || 'Failed To assign member to task!');
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  return (
    <div className="mb-4">
      {/* Assigned Members Section */}
      <h5 className="text-lg text-start font-semibold text-white mb-4 mt-1">
        Assigned Members ({assignedMembersDetails?.length})
      </h5>

      <AssignedMemberLists
        assignedMembersDetails={assignedMembersDetails}
        taskId={taskId}
        teamId={teamId}
        leaderId={leaderId}
      />

      {/* Available Members Section */}
      <h5 className="text-lg text-start font-semibold text-white mb-4 mt-1">
        Available Members to Assign ({availableMembers?.length}) 🧑🏻‍🤝‍🧑🏼
      </h5>
      <div className="grid grid-cols-1 gap-3">
        {availableMembers && availableMembers?.length > 0 ? (
          availableMembers?.map((member) => (
            <div
              key={member?.id}
              className="flex items-center justify-between p-4 bg-gray-800 dark:bg-gray-900 shadow-lg rounded-2xl hover:bg-gray-700 transition-colors duration-200"
            >
              {/* Profile and details */}
              <div className="flex items-center">
                <img
                  src={member?.user?.profileImageUrl || "/default-profile.jpg"}
                  alt={member?.user?.username}
                  className="w-14 h-14 rounded-full border-2 border-gray-500 object-cover"
                />
                <div className="ml-4">
                  <p className="text-sm font-semibold text-white">
                    {member?.user?.username}
                  </p>
                  <p className="text-xs text-gray-400">{member?.user?.email}</p>
                </div>
              </div>
              {/* Assign button */}
              <button
                disabled={currentUserId !== leaderId || loadingStates[member?.user?.id]}
                onClick={() => handleAssignMemberToTask(member?.user?.id)}
                className={`px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-xs lg:text-md md:text-md flex items-center justify-center min-w-[80px] ${
                  currentUserId !== leaderId ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  loadingStates[member?.user?.id] ? "opacity-70" : "hover:opacity-90"
                } transition-all`}
              >
                {loadingStates[member?.user?.id] ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Assigning...
                  </>
                ) : (
                  "Assign"
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400">No available members to assign.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;



