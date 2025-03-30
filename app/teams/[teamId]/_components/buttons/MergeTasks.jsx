"use client";

import { useRouter } from "next/navigation";


const MergeTasks = ({teamId, leaderId}) => {

    const router = useRouter();

    const handleMergeTasks = async (teamId, leaderId) => {
        try {
          const res = await fetch(`/api/leader/tasks/merge-approved-tasks/${leaderId}/${teamId}`, {
              method: 'POST'
          });
    
          if(res.ok) {
             router.refresh()
             alert('Tasks Merged!!')
          } else {
            const errorData = await res.json()
            alert(errorData.message)
            console.log('Error Mergin Tasks', errorData.message)
          }
         
    
      
      } catch (error) {
          console.error('Error Mergin Tasks:', error.message);
      }

    }

  return (
    <div className="my-2 py-4 px-5 rounded-lg flex justify-center items-center">
        <button
            onClick={() => handleMergeTasks(teamId, leaderId)}
            className="px-10 py-3 rounded-xl text-white font-semibold transition-all duration-300 
                            bg-gradient-to-r from-gray-400 to-purple-900 shadow-lg 
                            hover:from-gray-500 hover:to-gray-800 hover:scale-105"
            >
            {"Merge Approved Tasks"}
        </button>
    </div>
  )
}

export default MergeTasks

