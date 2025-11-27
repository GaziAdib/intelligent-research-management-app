import { auth } from "@/app/auth";
import TaskContainer from "@/app/tasks/_components/TaskContainer";
import { redirect } from "next/navigation";

// Fetch task detail from backend
async function fetchSingleTaskInfo(teamId, taskId) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/tasks/task-detail/${teamId}/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) throw new Error("Failed to fetch Task Info");
  
    return res.json();
  }

const TaskDetail = async ({params}) => {

  const session = await auth()

    if(!session) {
        return redirect('/login')
      }
  
    if(session?.user?.role === 'ADMIN') {
      return redirect('/admin/dashboard')
    }
      
    if(session?.user?.role === 'USER') {
      return redirect('/')
    }  

  const {taskId, teamId} = await params;

  let taskInfo = await fetchSingleTaskInfo(teamId, taskId);

  taskInfo = taskInfo?.data

  let teamMembers = taskInfo?.team?.teamMembers

  const exist = teamMembers?.filter((member) => member?.userId === session?.user?.id)

  if(!exist) {
    return redirect('/')
  }

  console.log('Task Info', taskInfo)

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mt-8 justify-between items-center mb-8">
        <h2 className="text-4xl text-center font-bold">Task Detail</h2>
      </div>

      {/* Show a message if no teams are available */}
      {/* {teams?.length === 0 && (
        <div className="text-gray-400 text-center mt-10">
          <h2>You are not a member of any team.</h2>
        </div>
      )} */}

      {/* Render the list of teams */}
      <TaskContainer task={taskInfo} teamMembers={teamMembers} />
    </div>
  );
};

export default TaskDetail;