"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AssignedMemberLists from "./grid/AssignedMemberLists";


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
      alert('You are not authorized to perform this action')
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
        alert('Member assigned to task successfully!')
        router.refresh();
      } else {
        throw new Error("Failed to assign member");
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
          availableMembers.map((member) => (
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



// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import AssignedMemberLists from "./grid/AssignedMemberLists";

// const TeamMembers = ({ members, taskId, teamId, leaderId, assignedMembers }) => {

//   // find session 

//   const session = useSession();

//   const router = useRouter()

//   const currentUserId = session?.data?.user?.id;

//   // Assigned members with full details
//   const assignedMembersDetails = members?.filter((member) =>
//     assignedMembers?.includes(member?.user?.id)
//   );

//   // Available members to assign
//   const availableMembers = members?.filter(
//     (member) => !assignedMembers?.includes(member?.user?.id)
//   );


//   const handleAssignMemberToTask = async (memberId) => {

//     if(currentUserId !== leaderId) {
//       alert('You are not allowed to do this')
//     }
//       try {
//         const res = await fetch(`/api/leader/tasks/assign-task/${memberId}/${taskId}/${teamId}`, {
//           method: "PUT",
//           headers: {"Content-Type": "application/json"}
//         });
//         if (res.ok) {
//           router.refresh();
//           alert("Member  Assigned To Task Successfully done!");
//         } else {
//           alert("Error Adding Member to Task !!!");
//         }
//       } catch (error) {
//         alert("Something went wrong!");
//       }
//   }

//   return (
//     <div className="mb-4">
//       {/* Assigned Members Section */}
//       <h5 className="text-lg text-start font-semibold text-white mb-4 mt-1">
//         Assigned Members ({assignedMembersDetails?.length})
//       </h5>

//       <AssignedMemberLists assignedMembersDetails={assignedMembersDetails} taskId={taskId} teamId={teamId} leaderId={leaderId} />
     

//       {/* Available Members Section */}
//       <h5 className="text-lg text-start font-semibold text-white mb-4 mt-1">
//         Available Members to Assign ({availableMembers?.length}) 🧑🏻‍🤝‍🧑🏼
//       </h5>
//       <div className="grid grid-cols-1 gap-3">
//         {availableMembers && availableMembers?.length > 0 ? (
//           availableMembers.map((member) => (
//             <div
//               key={member?.id}
//               className="flex items-center justify-between p-4 bg-gray-800 dark:bg-gray-900 shadow-lg rounded-2xl"
//             >
//               {/* Profile and details */}
//               <div className="flex items-center">
//                 <img
//                   src={member?.user?.profileImageUrl || "/default-profile.jpg"}
//                   alt={member?.user?.username}
//                   className="w-14 h-14 rounded-full border-2 border-gray-500"
//                 />
//                 <div className="ml-4">
//                   <p className="text-sm font-semibold text-white">
//                     {member?.user?.username}
//                   </p>
//                   <p className="text-xs text-gray-400">{member?.user?.email}</p>
//                 </div>
//               </div>
//               {/* Assign button */}
//               <button disabled={currentUserId !== leaderId} onClick={() => handleAssignMemberToTask(member?.user?.id)} className="px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-xs lg:text-md md:text-md">
//                 Assign
//               </button>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400">No available members to assign.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeamMembers;













// "use client";

// import { useRouter } from "next/navigation";

// const TeamMembers = ({ members, taskId, teamId }) => {

//     const router = useRouter();

//     const handleAddToTask = async (userId) => {
//         console.log('clicked', userId)
//         // api {userId, taskId, teamId}
//         ///api/leader/tasks/assign-task/${userId}/${taskId}/{teamId}

//         try {
//             const res = await fetch(`/api/leader/tasks/assign-task/${userId}/${taskId}/${teamId}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 }
//             });
//             if (res.ok) {
//                 // toast.success("Registration successful!");
//                 router.refresh()
//                 alert('new member added to tasks successfully')
//             } else {
//                 const errorData = await res.json();
//                 alert('Error happened!', errorData?.message)
//                 // toast.error(errorData.message);
//             }
//         } catch (error) {
//             alert('Something went wrong!', error)
//             // toast.error("Something went wrong");
//         }
    


//     }



//   return (
//     <div className="mb-4">
//       <h5 className="text-lg mb-6 text-start font-semibold text-white mt-1">
//         Available Team Members ({members?.length}) 🧑🏻‍🤝‍🧑🏼
//       </h5>

//       <div className="grid grid-cols-1 gap-3">
//         {members && members?.length > 0 ? (
//           members.map((member) => (
//             <div
//               key={member?.id}
//               className="flex items-center p-4 bg-gray-800 dark:bg-gray-900 shadow-lg rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:bg-gray-700 dark:hover:bg-gray-800"
//             >
//               {/* Profile Image */}
//               <div className="w-16 h-16 flex-shrink-0">
//                 <img
//                   src={member?.user?.profileImageUrl || "/default-profile.jpg"}
//                   alt={member?.user?.username}
//                   className="w-14 h-14 rounded-full object-cover border-2 border-gray-500 hover:border-gray-300 transition-all duration-300"
//                 />
//               </div>

//               {/* Vertical Line */}
//               <div className="w-px h-12 bg-gray-600 dark:bg-gray-500 mx-4"></div>

//               {/* User Details */}
//               <div className="flex flex-col flex-grow">
//                 <p className="text-sm text-gray-200 font-semibold hover:text-white transition-all duration-300">
//                   {member?.user?.username}
//                 </p>
//                 <p className="text-xs text-gray-400 hover:text-gray-300 transition-all duration-300">
//                   {member?.user?.email}
//                 </p>
//               </div>

//               {/* Add to Task Button */}
//               <button
//                 onClick={() => handleAddToTask(member?.user?.id)}
//                 className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
//               >
//                 Add to Task
//               </button>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400 text-center col-span-full">
//             No members found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeamMembers;




// // "use client";

// // const TeamMembers = ({ members }) => {

// //     //assign member?.user?.id into assignedTasks
// //     return (
// //       <div className="mb-2">
// //       <h5 className="text-md text-start font-medium text-white mb-4 mt-1">
// //         See Current Members 🧑🏻‍🤝‍🧑🏼
// //       </h5>
// //       <div className="grid grid-cols-1  gap-2">
// //           {members && members?.length > 0 ? (
// //             members?.map((member) => (
// //             <div
// //               key={member?.id}
// //               className="flex items-center p-4 bg-gray-800 dark:bg-gray-900 shadow-lg rounded-xl transition-all duration-300 hover:scale-[1.03] hover:bg-gray-700 dark:hover:bg-gray-800"
// //             >
// //               {/* Profile Image */}
// //               <div className="w-16 h-16 flex-shrink-0">
// //                 <img
// //                   src={member?.user?.profileImageUrl || "/default-profile.jpg"}
// //                   alt={member?.user?.username}
// //                   className="w-14 h-14 rounded-full object-cover border-2 border-gray-500 hover:border-gray-300 transition-all duration-300"
// //                 />
// //               </div>
  
// //               {/* Vertical Line */}
// //               <div className="w-px h-12 bg-gray-600 dark:bg-gray-500 mx-4"></div>
  
// //               {/* User Details */}
// //               <div className="flex flex-col">
// //                 <p className="text-sm text-gray-200 font-semibold hover:text-white transition-all duration-300">
// //                   {member?.user?.username}
// //                 </p>
// //                 <p className="text-xs text-gray-400 hover:text-gray-300 transition-all duration-300">
// //                   {member?.user?.email}
// //                 </p>

// //                 <button>Add user to do task</button>
                
// //               </div>
// //             </div>
// //           ))
// //         ) : (
// //           <p className="text-gray-400 text-center col-span-full">No members found.</p>
// //         )}
// //       </div>
  
// //     </div>
// //     )
// //   }
  
// //   export default TeamMembers

