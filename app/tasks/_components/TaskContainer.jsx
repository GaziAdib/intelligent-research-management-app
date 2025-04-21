import { AiOutlineClockCircle, AiOutlineFlag, AiOutlineCheckCircle } from 'react-icons/ai';
import TeamMembers from './TeamMembers';
import Link from 'next/link';

const TaskContainer = ({ task, teamMembers }) => {
  const {
    id,
    taskTitle,
    taskShortDescription,
    priority,
    status,
    createdAt,
    team,
    leaderId,
    taskAssignedTo
  } = task || {};

  const getStatusColor = () => {
    if (status === 'Approved') return 'text-green-400 border-green-400/30';
    if (status === 'Rejected') return 'text-red-400 border-red-400/30';
    return 'text-orange-400 border-orange-400/30';
  };
  

  return (
    <div className="w-full max-w-4xl mx-auto border border-gray-700 rounded-xl shadow-lg overflow-hidden p-6 md:p-8 space-y-6 bg-gray-900 text-gray-100">
      {/* Task Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-white">{taskTitle}</h1>
        {team && (
          <span className="px-3 py-1 rounded-full bg-indigo-700 text-indigo-100 text-sm font-semibold w-fit">
            {team?.teamName}
          </span>
        )}
      </div>

      {/* Task Description */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border-l-2 border-blue-500">
          <p className="text-gray-300 text-sm lg:text-xl leading-relaxed">{taskShortDescription}</p>
      </div>

      {/* Task Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <AiOutlineFlag className="w-5 h-5 text-red-400" />
          <span className="font-medium">Priority:</span>
          <span className="capitalize font-semibold px-2 rounded-full">{priority}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <AiOutlineClockCircle className="w-5 h-5 text-blue-400" />
          <span className="font-medium">Status:</span>
          <span className={`capitalize font-semibold border px-2 rounded-full ${getStatusColor()}`}>
            {status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <AiOutlineCheckCircle className="w-5 h-5 text-green-400" />
          <span className="font-medium">Created:</span>
          <span className=''>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Team Members */}
      <div className="team-members my-4">
        <TeamMembers 
          members={teamMembers} 
          teamId={team?.id} 
          leaderId={leaderId} 
          taskId={id} 
          assignedMembers={taskAssignedTo} 
        />
      </div>

      {/* Action Button */}
      <Link 
        href={`/tasks/edit-panel/${id}/${team?.id}`} 
        className="block w-full text-center mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
      >
        Work On Task
      </Link>
    </div>
  );
};

export default TaskContainer;


// import { AiOutlineClockCircle, AiOutlineFlag, AiOutlineCheckCircle } from 'react-icons/ai';
// import TeamMembers from './TeamMembers';
// import Link from 'next/link';

// const TaskContainer = ({ task, teamMembers }) => {
//   const {
//     id,
//     taskTitle,
//     taskShortDescription,
//     priority,
//     status,
//     createdAt,
//     team,
//     leaderId,
//     taskAssignedTo
//   } = task || {};

//   return (
//     <div
//       className={`w-full max-w-4xl mx-auto border-1 border-gray-700 rounded-2xl shadow-xl overflow-hidden p-6 space-y-6`}
//     //   style={{ backgroundColor: taskBgColor || '#f3f4f6', color: taskTextColor || '#000000' }}
//     >
//       {/* Task Title and Team Badge */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <h1 className="text-xl lg:text-3xl md:text-2xl font-bold">{taskTitle}</h1>
//         {team && (
//           <span
//             className={`px-4 py-1 rounded-full bg-blue-800 text-sm font-semibold`}
//             // style={{ backgroundColor: team.teamBgColor, color: team.teamTextColor }}
//           >
//             {team?.teamName}
//           </span>
//         )}
//       </div>

//       {/* Task Short Description */}
//       <p className="text-lg leading-relaxed">{taskShortDescription} {taskShortDescription} {taskShortDescription} {taskShortDescription}{taskShortDescription}</p>

//       {/* Task Metadata */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
//         <div className="flex items-center gap-2">
//           <AiOutlineFlag className="w-6 h-6" />
//           <span className="font-medium">Priority:</span>
//           <span>{priority}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <AiOutlineClockCircle className="w-6 h-6" />
//           <span className="font-medium">Status:</span>
//           <span>{status}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <AiOutlineCheckCircle className="w-6 h-6" />
//           <span className="font-medium">Created:</span>
//           <span>{new Date(createdAt).toLocaleDateString()}</span>
//         </div>
//       </div>

  
//       <div className='team-members my-4'>
//         <TeamMembers members={teamMembers} teamId={team?.id} leaderId={leaderId} taskId={id} assignedMembers={taskAssignedTo} />
//       </div>

//       <Link href={`/tasks/edit-panel/${id}/${team?.id}`} className="w-full text-center block mt-5 bg-gradient-to-r from-blue-500 to-purple-950 hover:opacity-90 text-white font-semibold p-1 rounded-lg transition duration-200">
//           Work On Task
//       </Link>
//     </div>
//   );
// };

// export default TaskContainer;
