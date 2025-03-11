"use client";

const TeamMembers = ({ members }) => {
    return (
      <div className="mb-2">
      <h5 className="text-md text-start font-medium text-white mb-4 mt-1">
        See Current Members 🧑🏻‍🤝‍🧑🏼
      </h5>
      <div className="grid grid-cols-1  gap-2">
          {members && members?.length > 0 ? (
            members?.map((member) => (
            <div
              key={member?.id}
              className="flex items-center p-4 bg-gray-800 dark:bg-gray-900 shadow-lg rounded-xl transition-all duration-300 hover:scale-[1.03] hover:bg-gray-700 dark:hover:bg-gray-800"
            >
              {/* Profile Image */}
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={member?.user?.profileImageUrl || "/default-profile.jpg"}
                  alt={member?.user?.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-500 hover:border-gray-300 transition-all duration-300"
                />
              </div>
  
              {/* Vertical Line */}
              <div className="w-px h-12 bg-gray-600 dark:bg-gray-500 mx-4"></div>
  
              {/* User Details */}
              <div className="flex flex-col">
                <p className="text-sm text-gray-200 font-semibold hover:text-white transition-all duration-300">
                  {member?.user?.username}
                </p>
                <p className="text-xs text-gray-400 hover:text-gray-300 transition-all duration-300">
                  {member?.user?.email}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">No members found.</p>
        )}
      </div>
  
    </div>
    )
  }
  
  export default TeamMembers