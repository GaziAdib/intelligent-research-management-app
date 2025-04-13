"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const AssignedMemberLists = ({ assignedMembersDetails, taskId, teamId, leaderId }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const session = useSession();
  const router = useRouter();
  const currentUserId = session?.data?.user?.id;

  const handleRemoveAssignedMember = async (assignedMemberId) => {
    if (currentUserId !== leaderId) {
      alert('You are not authorized to perform this action')
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [assignedMemberId]: true }));

    try {
      const res = await fetch(
        `/api/leader/tasks/remove-assigned-member/${assignedMemberId}/${taskId}/${teamId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        router.refresh();
        alert('Member removed from task successfully!')
      } else {
        throw new Error("Failed to remove member");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [assignedMemberId]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 mb-8">
      {assignedMembersDetails && assignedMembersDetails?.length > 0 ? (
        assignedMembersDetails?.map((member) => (
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
            {/* Remove button */}
            <button
              disabled={currentUserId !== leaderId || loadingStates[member?.user?.id]}
              onClick={() => handleRemoveAssignedMember(member?.user?.id)}
              className={`px-4 py-2 cursor-pointer ${
                currentUserId === leaderId
                  ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                  : "bg-green-700 cursor-default"
              } text-white rounded-full text-xs lg:text-md md:text-md flex items-center justify-center min-w-[50px] ${
                loadingStates[member?.user?.id] ? "opacity-70" : ""
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
                  Removing...
                </>
              ) : currentUserId === leaderId ? (
                "Remove"
              ) : (
                "Assigned"
              )}
            </button>
          </div>
        ))
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-400">No members assigned yet.</p>
        </div>
      )}
    </div>
  );
};

export default AssignedMemberLists;






// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";


// const AssignedMemberLists = ({assignedMembersDetails, taskId, teamId, leaderId}) => {

//     const session = useSession();
    
//     const router = useRouter()
    
//     const currentUserId = session?.data?.user?.id;


// const handleRemoveAssignedMember = async (assignedMemberId) => {


//         if(currentUserId !== leaderId) {
//           alert('You are not allowed to do this')
//         }
//           try {
//             const res = await fetch(`/api/leader/tasks/remove-assigned-member/${assignedMemberId}/${taskId}/${teamId}`, {
//               method: "PUT",
//               headers: {"Content-Type": "application/json"}
//             });
//             if (res.ok) {
//               router.refresh();
//               alert("Member Removed From Assigned Tasks Successfully");
//             } else {
//               alert("Error removing user from assigned tasks panel!!!");
//             }
//           } catch (error) {
//             alert("Something went wrong!");
//           }
    
//       }


//   return (
//     <div className="grid grid-cols-1 gap-3 mb-8">
//     {assignedMembersDetails && assignedMembersDetails?.length > 0 ? (
//       assignedMembersDetails?.map((member) => (
//         <div
//           key={member?.id}
//           className="flex items-center justify-between p-4 bg-gray-800 dark:bg-gray-900 shadow-lg rounded-2xl"
//         >
//           {/* Profile and details */}
//           <div className="flex items-center">
//             <img
//               src={member?.user?.profileImageUrl || "/default-profile.jpg"}
//               alt={member?.user?.username}
//               className="w-14 h-14 rounded-full border-2 border-gray-500"
//             />
//             <div className="ml-4">
//               <p className="text-sm font-semibold text-white">
//                 {member?.user?.username}
//               </p>
//               <p className="text-xs text-gray-400">{member?.user?.email}</p>
//             </div>
//           </div>
//           {/* Already assigned label */}
//           <button disabled={currentUserId !== leaderId} onClick={() => handleRemoveAssignedMember(member?.user?.id)} className={`px-3 py-1 text-xs cursor-pointer ${currentUserId === leaderId ? 'bg-red-700': 'bg-green-700'} text-white rounded-full`}>
//             {currentUserId === leaderId ? 'Remove': 'Assigned'} 
//           </button>
//         </div>
//       ))
//     ) : (
//       <p className="text-gray-400">No members assigned yet.</p>
//     )}
//   </div>
//   )
// }

// export default AssignedMemberLists