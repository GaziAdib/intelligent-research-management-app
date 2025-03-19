"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const AssignedMemberLists = ({assignedMembersDetails, taskId, teamId, leaderId}) => {

    const session = useSession();
    
    const router = useRouter()
    
    const currentUserId = session?.data?.user?.id;


const handleRemoveAssignedMember = async (assignedMemberId) => {


        if(currentUserId !== leaderId) {
          alert('You are not allowed to do this')
        }
          try {
            const res = await fetch(`/api/leader/tasks/remove-assigned-member/${assignedMemberId}/${taskId}/${teamId}`, {
              method: "PUT",
              headers: {"Content-Type": "application/json"}
            });
            if (res.ok) {
              router.refresh();
              alert("Member Removed From Assigned Tasks Successfully");
            } else {
              alert("Error removing user from assigned tasks panel!!!");
            }
          } catch (error) {
            alert("Something went wrong!");
          }
    
      }


  return (
    <div className="grid grid-cols-1 gap-3 mb-8">
    {assignedMembersDetails && assignedMembersDetails?.length > 0 ? (
      assignedMembersDetails?.map((member) => (
        <div
          key={member?.id}
          className="flex items-center justify-between p-4 bg-gray-800 dark:bg-gray-900 shadow-lg rounded-2xl"
        >
          {/* Profile and details */}
          <div className="flex items-center">
            <img
              src={member?.user?.profileImageUrl || "/default-profile.jpg"}
              alt={member?.user?.username}
              className="w-14 h-14 rounded-full border-2 border-gray-500"
            />
            <div className="ml-4">
              <p className="text-sm font-semibold text-white">
                {member?.user?.username}
              </p>
              <p className="text-xs text-gray-400">{member?.user?.email}</p>
            </div>
          </div>
          {/* Already assigned label */}
          <button disabled={currentUserId !== leaderId} onClick={() => handleRemoveAssignedMember(member?.user?.id)} className={`px-3 py-1 text-xs cursor-pointer ${currentUserId === leaderId ? 'bg-red-700': 'bg-green-700'} text-white rounded-full`}>
            {currentUserId === leaderId ? 'Remove': 'Assigned'} 
          </button>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No members assigned yet.</p>
    )}
  </div>
  )
}

export default AssignedMemberLists