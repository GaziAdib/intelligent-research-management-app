"use client"

import { useEffect, useState } from "react";


async function fetchUserDetails(userIds) {
  const res = await fetch("/api/users/membersInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userIds }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user details");
  }

  return res.json();
}



const TeamCard = ({ team }) => {


  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id, teamName, teamShortDescription, leader, createdAt, teamMembers } = team || [];

  console.log('Members Info', members)

  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      fetchUserDetails(teamMembers)
        .then((data) => {
          setMembers(data?.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [teamMembers]);

  if (loading) {
    return <p>Loading members...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }


  return (
    <div className="relative bg-gray-800/30 p-6 rounded-lg shadow-2xl backdrop-blur-md border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-800/20 backdrop-blur-sm rounded-lg -z-10"></div>

      {/* Team Name and Leader */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-semibold text-white">{teamName}</h3>
        <p className="text-sm text-green-300 bg-gray-800 inline-block px-2 py-0.5 rounded-xl mt-1">Leader: {leader?.username}</p>
      </div>

      {/* Team Description */}
      <p className="text-gray-300 text-sm mb-4">{teamShortDescription}</p>

      {/* Team Members Grid */}
      <div className="mb-4">
        <h5 className="text-md text-start font-medium text-white mb-4 mt-1">See Current Members 🧑🏻‍🤝‍🧑🏼 </h5>
        <div className="grid grid-cols-4 gap-4">
          {members && members?.length > 0 ? (
            members?.map((user, index) => (

              <>
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center p-2 bg-gray-700/50 rounded-lg"
              >
                <img
                  src={user.profileImageUrl || "/default-profile.jpg"} // Default profile image if none provided
                  alt={user.username}
                  className="w-full rounded-full object-cover border-2 border-gray-600"
                />

              
                
              </div>

              <div>
                <span> 📧 {user.username}</span>
                
                <span>  {user.email}</span>
              </div>

              </>
              
            ))
          ) : (
            <p className="text-gray-400 col-span-4">No members found.</p>
          )}
        </div>
      </div>

      {/* Created At */}
      <p className="text-gray-400 text-xs">Created on: {new Date(createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default TeamCard;
