"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const MergeTasks = ({ teamId, leaderId, mergedData }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isMerged, setIsMerged] = useState(!!mergedData);

    // Check for merge status from the server on component mount and at intervals
    // useEffect(() => {
    //     // Set initial state based on prop
    //     if (mergedData) {
    //         setIsMerged(true);
    //     }

    //     // Function to check merge status from the server
    //     const checkMergeStatus = async () => {
    //         try {
    //             const response = await fetch(`/api/team/merge-status/${teamId}`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Cache-Control': 'no-cache'
    //                 }
    //             });
                
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 // Update the isMerged state based on server response
    //                 setIsMerged(!!data.isMerged || !!data.mergedData);
    //             }
    //         } catch (error) {
    //             console.error('Error checking merge status:', error);
    //         }
    //     };

    //     // Check immediately on mount
    //     checkMergeStatus();

    //     // Set up polling to periodically check merge status (every 30 seconds)
    //     const intervalId = setInterval(checkMergeStatus, 30000);

    //     // Clean up interval on component unmount
    //     return () => clearInterval(intervalId);
    // }, [teamId, mergedData]);

    const handleMergeTasks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `/api/leader/tasks/merge-approved-tasks/${leaderId}/${teamId}`,
                { method: 'POST' }
            );
            
            const data = await res.json();

            if (res.ok) {
                console.log('data', data.data.status);
                
                // Set local merged state
                setIsMerged(true);
                
                // Refresh the page to get updated data from server
                router.refresh();
                
                alert(data.message);
            } else {
                alert(data.message || 'Failed to merge tasks');
            }
        } catch (error) {
            console.error('Error merging tasks:', error);
            alert('An error occurred while merging tasks');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="my-2 py-4 px-5 rounded-lg flex justify-center items-center">
            <button
                onClick={isMerged ? null : handleMergeTasks}
                disabled={isMerged || isLoading}
                className={`px-10 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg
                    ${
                        isMerged 
                            ? 'bg-gray-500 cursor-not-allowed'
                            : isLoading
                                ? 'bg-gray-600 cursor-wait'
                                : 'bg-gradient-to-r from-gray-400 to-purple-900 hover:from-gray-500 hover:to-gray-800 hover:scale-105'
                    }`}
            >
                {isMerged ? "Already Merged" : "Merge Approved Tasks"}
            </button>
        </div>
    );
};

export default MergeTasks;





















// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const MergeTasks = ({ teamId, leaderId, mergedDataId }) => {
//     const router = useRouter();
//     const [isMerged, setIsMerged] = useState(!!mergedDataId);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleMergeTasks = async () => {
//         setIsLoading(true);
//         try {
//             const res = await fetch(
//                 `/api/leader/tasks/merge-approved-tasks/${leaderId}/${teamId}`,
//                 { method: 'POST' }
//             );
            
//             const data = await res.json();
            
//             if (res.ok) {
//                 router.refresh();
//                 // Check if the response indicates tasks were already merged
//                 console.log('data', data)
//                 if (data.data.status === 'already_merged') {
//                     setIsMerged(true);
//                 }
//                 alert(data.message);
//             } else {
//                 alert(data.message || 'Failed to merge tasks');
//             }
//         } catch (error) {
//             console.error('Error merging tasks:', error);
//             alert('An error occurred while merging tasks');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//       <div className="my-2 py-4 px-5 rounded-lg flex justify-center items-center">
//       <button
//           onClick={isMerged ? null : handleMergeTasks}
//           disabled={isMerged || isLoading}
//           className={`px-10 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg
//               ${
//                   isMerged 
//                       ? 'bg-gray-500 cursor-not-allowed'
//                       : isLoading
//                           ? 'bg-gray-600 cursor-wait'
//                           : 'bg-gradient-to-r from-gray-400 to-purple-900 hover:from-gray-500 hover:to-gray-800 hover:scale-105'
//               }`}
//       >
//           {isMerged ? "Already Merged" : isLoading ? "Merging..." : "Merge Approved Tasks"}
//       </button>
//   </div>
//     );
// };

// export default MergeTasks;





// "use client";

// import { useRouter } from "next/navigation";


// const MergeTasks = ({teamId, leaderId}) => {

//     const router = useRouter();

//     const handleMergeTasks = async (teamId, leaderId) => {
//         try {
//           const res = await fetch(`/api/leader/tasks/merge-approved-tasks/${leaderId}/${teamId}`, {
//               method: 'POST'
//           });
    
//           if(res.ok) {
//              router.refresh()
//              const data = await res.json()
//              console.log('data', data.message)
//              alert(data.message)
//           } else {
//             const errorData = await res.json()
//             alert(errorData.message)
//             console.log('Error Mergin Tasks', errorData.message)
//           }
      
//       } catch (error) {
//           console.error('Error Mergin Tasks:', error.message);
//       }

//     }

//   return (
//     <div className="my-2 py-4 px-5 rounded-lg flex justify-center items-center">
//         <button
//             onClick={() => handleMergeTasks(teamId, leaderId)}
//             className="px-10 py-3 rounded-xl text-white font-semibold transition-all duration-300 
//                             bg-gradient-to-r from-gray-400 to-purple-900 shadow-lg 
//                             hover:from-gray-500 hover:to-gray-800 hover:scale-105"
//             >
//             {/* {"Merge Approved Tasks"} */}
//             { 'Merge Approved Tasks'}
//         </button>
//     </div>
//   )
// }

// export default MergeTasks

