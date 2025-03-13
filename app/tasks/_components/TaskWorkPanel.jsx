import { AiOutlineClockCircle, AiOutlineFlag, AiOutlineCheckCircle } from 'react-icons/ai';
import TaskEditForm from './forms/TaskEditForm';

const TaskWorkContainer = ({ task }) => {
  const {
    id,
    taskTitle,
    taskShortDescription,
    priority,
    status,
    taskBgColor,
    taskTextColor,
    createdAt,
    team,
    leaderId,
    taskAssignedTo,
  } = task || {};

  return (
    <div
      className={`w-full mx-auto border-1 border-gray-300 rounded-2xl shadow-xl overflow-hidden p-6 space-y-6`}
    //   style={{ backgroundColor: taskBgColor || '#f3f4f6', color: taskTextColor || '#000000' }}
    >
      {/* Task Title and Team Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{taskTitle}</h1>
        {team && (
          <span
            className={`px-4 py-1 rounded-full bg-blue-800 text-sm font-semibold`}
            // style={{ backgroundColor: team.teamBgColor, color: team.teamTextColor }}
          >
            {team?.teamName}
          </span>
        )}
      </div>

      {/* Task Short Description */}
      <p className="text-lg leading-relaxed">{taskShortDescription}</p>

      {/* Task Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
        <div className="flex items-center gap-2">
          <AiOutlineFlag className="w-6 h-6" />
          <span className="font-medium">Priority:</span>
          <span>{priority}</span>
        </div>
        <div className="flex items-center gap-2">
          <AiOutlineClockCircle className="w-6 h-6" />
          <span className="font-medium">Status:</span>
          <span>{status}</span>
        </div>
        <div className="flex items-center gap-2">
          <AiOutlineCheckCircle className="w-6 h-6" />
          <span className="font-medium">Created:</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className='my-2 py-2'>
         <TaskEditForm initialData={task} />
      </div>  
      

     
    </div>
  );
};

export default TaskWorkContainer;
