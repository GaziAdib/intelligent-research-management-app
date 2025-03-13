import { auth } from "@/app/auth";
import TaskWorkContainer from "@/app/tasks/_components/TaskWorkPanel";

// Fetch task detail from backend
async function fetchSingleTaskInfo(teamId, taskId) {
    const res = await fetch(`http://localhost:3000/api/tasks/task-detail/${teamId}/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) throw new Error("Failed to fetch Task Info");
  
    return res.json();
  }

const TaskEditPanel = async ({params}) => {

  const session = await auth()
  const {taskId, teamId} = await params;

  let taskInfo = await fetchSingleTaskInfo(teamId, taskId);

  taskInfo = taskInfo?.data

//   let teamMembers = taskInfo?.team?.teamMembers

  console.log('Task Info', taskInfo)

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="mt-8 justify-between items-center mb-8">
        <h1 className="text-4xl text-center font-bold">Task Work Panel</h1>
        <h2 className="text-2xl text-center font-semibold my-4 py-4">{taskInfo?.taskTitle}</h2>
      </div>

      {/* Render the list of teams */}
      <TaskWorkContainer task={taskInfo} />
    </div>
  );
};

export default TaskEditPanel;