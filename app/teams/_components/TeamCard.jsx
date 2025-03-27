"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MemberLists from "./MemberLists";
import Link from "next/link";
import { useSession } from "next-auth/react";


async function fetchAllUsers() {
  const res = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch all users");
  }

  return res.json();
}

const TeamCard = ({ team }) => {

  const router = useRouter()

  const session = useSession();

  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const currentUserId = session?.data?.user?.id

  const { id:teamId, teamName, teamShortDescription, leader, createdAt, teamMembers } = team || {};


  // // Fetch team members
  // useEffect(() => {
  //   if (teamMembers && teamMembers.length > 0) {
  //     fetchUserDetails(teamMembers)
  //       .then((data) => {
  //         setMembers(data?.data);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         setError(err.message);
  //         setLoading(false);
  //       });
  //   } else {
  //     setLoading(false);
  //   }
  // }, [teamMembers]);

  // Fetch all users when modal is opened
  const handleAddMembersClick = async () => {
    try {
      const data = await fetchAllUsers();
      setAllUsers(data?.data); // Assuming the API returns { data: [...] }
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter out users who are already in the team
  const usersNotInTeam = allUsers.filter(
    (user) => !teamMembers.some((member) => member?.userId === user?.id)
  );

  // Handle assigning a user to the team
  const handleAssignUserToTeam = async (userId, teamId) => {
      try {
        const res = await fetch(`/api/leader/teams/add-member/${teamId}/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (res.ok) {
            // toast.success("Registration successful!");
            router.refresh()
            setIsModalOpen(false)
            alert('new member added to team Successfully')
        } else {
            const errorData = await res.json();
            alert('Error happened!', errorData?.message)
            // toast.error(errorData.message);
        }
    } catch (error) {
        alert('Something went wrong!', error)
        // toast.error("Something went wrong");
    }

   
    setIsModalOpen(false); // Close the modal after assigning
  };


  const handleDeleteTeam = async (teamId) => {
    try {
    
      const res = await fetch(`/api/leader/teams/delete-team/${teamId}`, {
          method: 'DELETE'
      });

      if(res.ok) {
         router.refresh()
         alert('Team Deleted Successfully')
      } else {
        const errorData = await res.json()
        alert(errorData.message)
        console.log('Error Deleting Team', errorData.message)
      }
     
  } catch (error) {
      console.error('Error deleting team:', error.message);
  }

  }

  return (
    <div className="relative bg-gray-800/30 p-6 rounded-lg shadow-2xl backdrop-blur-md border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-800/20 backdrop-blur-sm rounded-lg -z-10"></div>

      {/* Team Name and Leader */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-semibold text-white">{teamName}</h3>
        <p className="text-sm text-green-300 bg-gray-800 inline-block px-2 py-0.5 rounded-xl mt-1">
          Leader: {leader?.username}
        </p>
      </div>

      {/* Team Description */}
      <p className="text-gray-300 text-sm mb-4">{teamShortDescription}</p>

      {/* Team Members Grid */}
      
      <MemberLists members={teamMembers} />

      {/* Created At */}
      <p className="text-gray-400 text-xs mb-2 mt-1">
        Created on: {new Date(createdAt).toLocaleDateString()}
      </p>

      {/* Add Members Button */}
      {
        leader?.id === currentUserId && 
        <button
          onClick={handleAddMembersClick}
          className="w-full mt-3 mb-4 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white font-semibold p-1 rounded-lg transition duration-200"
        >
          Add Members
      </button>
      }

      <Link href={`/teams/${teamId}`} className="w-full text-center block mt-5 bg-gradient-to-r from-gray-500 to-gray-950 hover:opacity-90 text-white font-semibold p-1 rounded-lg transition duration-200">
          Details
      </Link>

     {
        leader?.id === currentUserId && 
        <button
          onClick={() => handleDeleteTeam(teamId)}
          className="w-full mt-3 mb-4 bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90 text-white font-semibold p-1 rounded-lg transition duration-200"
        >
          X Remove Team 
      </button>
     }

      {/* Modal for Adding Members */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[1000]">
          <div className="bg-gray-900  max-w-2xl p-4 rounded-lg shadow-lg">
            <h3 className="text-white text-xl mb-4 font-semibold">Add New Members</h3>
            {!loading ? (
              <p className="text-gray-400">Loading users...</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {usersNotInTeam?.map((user) => (
                  <button
                    key={user?.id}
                    className="block w-full text-white text-left p-3 rounded hover:bg-gray-800 transition"
                    onClick={() => handleAssignUserToTeam(user?.id, teamId)}
                  >
                    <div
                      key={user?.id}
                      className="flex items-center p-1 rounded-lg transition-all duration-300"
                    >
                      {/* Profile Image */}
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={user?.profileImageUrl || "/default-profile.jpg"}
                          alt={user?.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600 transition-all duration-300"
                        />
                      </div>

                      {/* Vertical Line */}
                      <div className="w-px h-12 bg-gray-600 dark:bg-gray-600 mx-2"></div>

                      {/* Username and Email */}
                      <div className="flex flex-col justify-center mb-5">
                        <p className="text-sm text-gray-300 py-0.5 font-medium hover:text-gray-200 transition-all duration-300">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-400 hover:text-gray-300 transition-all duration-300">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-sm bg-white text-slate-950  px-2 py-0.5 rounded hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default TeamCard;