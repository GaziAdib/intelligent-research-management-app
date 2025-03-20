import { auth } from "@/app/auth";
import ChatPopup from "@/app/components/ChatPopup";
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

// fetch messages 

// async function fetchConversationMessages(conversationId) {
//   const res = await fetch(`http://localhost:3000/api/messages/fetch-messages/${conversationId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch messages");

//   return res.json();
// }

const TaskEditPanel = async ({ params }) => {
  const session = await auth();
  const { taskId, teamId } = await params;

  let taskInfo = await fetchSingleTaskInfo(teamId, taskId);
  taskInfo = taskInfo?.data;

  console.log("Task Info", taskInfo);

  // let conversationId = taskInfo?.team?.conversation?.id;
  // const messages = await fetchConversationMessages(conversationId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mt-8 text-center mb-8">
          <h1 className="text-2xl lg:text-4xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200">
            Task Work Panel
          </h1>
          {/* <h2 className="text-xl lg:text-2xl md:text-xl font-semibold mt-4 py-4 text-blue-100">
            {taskInfo?.taskTitle}
          </h2> */}
        </div>

        {/* Task Work Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/10">
          <TaskWorkContainer task={taskInfo} />
        </div>

        <div className="chat panel">
            {/* <ChatPopup conversationId={conversationId} teamId={teamId} messages={messages?.data} /> */}
        </div>
      </div>
    </div>
  );
};

export default TaskEditPanel;









// import { auth } from "@/app/auth";
// import TaskWorkContainer from "@/app/tasks/_components/TaskWorkPanel";

// // Fetch task detail from backend
// async function fetchSingleTaskInfo(teamId, taskId) {
//     const res = await fetch(`http://localhost:3000/api/tasks/task-detail/${teamId}/${taskId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
  
//     if (!res.ok) throw new Error("Failed to fetch Task Info");
  
//     return res.json();
//   }

// const TaskEditPanel = async ({params}) => {

//   const session = await auth()
//   const {taskId, teamId} = await params;

//   let taskInfo = await fetchSingleTaskInfo(teamId, taskId);

//   taskInfo = taskInfo?.data


//   return (
//     <div className="min-h-screen bg-gray-950 text-white p-6">
//       <div className="mt-8 justify-between items-center mb-8">
//         <h1 className="text-4xl text-center font-bold">Task Work Panel</h1>
//         <h2 className="text-2xl text-center font-semibold my-4 py-4">{taskInfo?.taskTitle}</h2>
//       </div>

//       {/* Render the list of teams */}
//       <TaskWorkContainer task={taskInfo} />
//     </div>
//   );
// };

// export default TaskEditPanel;