import { auth } from "@/app/auth";
import ModalTaskButton from "./_components/buttons/ModalTaskButton";
import TaskLists from "./_components/TaskLists";
import MemberLists from "../_components/MemberLists";
import ModalConversationButton from "./_components/modals/ConversationModalButton";
import ChatPopup from "@/app/components/ChatPopup";
import Pagination from "./_components/pagination/Pagination";

async function fetchSingleTeamInfo(teamid) {
  const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch teams");

  return res.json();
}

async function fetchTasks(teamId, pageNumber) {
  // Use a ternary operator to conditionally construct the URL
  const url = pageNumber
    ? `http://localhost:3000/api/tasks/${teamId}?pageNumber=${pageNumber.toString()}`
    : `http://localhost:3000/api/tasks/${teamId}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
  });

  if (!res.ok) throw new Error("Failed to fetch tasks");

  return res.json();
}

async function fetchConversationMessages(conversationId, teamId) {
  const res = await fetch(`http://localhost:3000/api/messages/fetch-messages/${conversationId}/${teamId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch messages");

  return res.json();
}

const TeamDetail = async ({ params, searchParams }) => {

  const { teamId } = await params;
  const { user } = await auth();
  
  const currentUserId = user?.id;



  let { pageNumber } = await searchParams;

  console.log('page number', pageNumber)
  


  let teamInfo = await fetchSingleTeamInfo(teamId);
  teamInfo = teamInfo.data;

  // let currentPage = 1

  pageNumber = pageNumber ? pageNumber : 1



  let data = await fetchTasks(teamId, Number(pageNumber));
  let tasks = data?.data;
  let totalPages = data?.totalPages


  console.log('tasks length', tasks?.length)
  console.log('Total Pages', totalPages)


  
  let conversationsId = teamInfo?.conversation?.id;
  let messages = await fetchConversationMessages(conversationsId, teamId);


  return (
    <div className="min-h-screen  text-white p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-8">📋 Team Tasks</h1>
        <ModalConversationButton teamInfo={teamInfo} currentUserId={currentUserId} />
      </div>

      <div className="my-2 py-2 mx-10 px-2">
        <ModalTaskButton buttonLabel={'+ Add task'} teamInfo={teamInfo} />
      </div>


      

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Task List */}
        <div className="w-full lg:w-3/4  rounded-2xl p-6 shadow-xl  max-h-[80vh]">
          {tasks?.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">
              <h2 className="text-xl">No tasks created yet.</h2>
            </div>
          ) : (
            <>
              <TaskLists tasks={tasks} teamId={teamId} />
              <div className="my-10 py-10">
              {tasks?.length > 0 && <Pagination totalPages={totalPages} />} 
              </div>
            </>
          )}
        </div>
        

        <div>
      
          <ChatPopup conversationId={teamInfo?.conversation?.id} teamId={teamId} messages={messages.data} /> 
           
        </div>

        {/* Members List */}
        <div className="w-full lg:w-1/4 bg-[#1a1a1a] rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg  lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
          <MemberLists members={teamInfo?.teamMembers} />
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;


























// import { auth } from "@/app/auth";
// import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// import TaskLists from "./_components/TaskLists";
// import MemberLists from "../_components/MemberLists";
// import ModalConversationButton from "./_components/modals/ConversationModalButton";
// import ChatPopup from "@/app/components/ChatPopup";

// async function fetchSingleTeamInfo(teamid) {
//   const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch teams");

//   return res.json();
// }

// async function fetchTasks(teamId, pageNum) {
//   const res = await fetch(`http://localhost:3000/api/tasks/${teamId}?pageNumber=${pageNum}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch tasks");

//   return res.json();
// }


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

// const TeamDetail = async ({ params, searchParams }) => {

//   const { teamId } = await params;
//   const { user } = await auth();
  
//   const currentUserId = user?.id;

//   const { pageNumber } = await searchParams;
  
//   let teamInfo = await fetchSingleTeamInfo(teamId);
//   teamInfo = teamInfo.data;



//   let data = await fetchTasks(teamId, pageNumber);
//   let tasks = data?.data;

  

//   let conversationsId = teamInfo?.conversation?.id;
//   let messages = await fetchConversationMessages(conversationsId);


//   return (
//     <div className="min-h-screen  text-white p-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
//         <h1 className="text-3xl sm:text-4xl font-extrabold mt-8">📋 Team Tasks</h1>
//         <ModalConversationButton teamInfo={teamInfo} currentUserId={currentUserId} />
//       </div>

//       <div className="my-2 py-2 mx-10 px-2">
//         <ModalTaskButton buttonLabel={'+ Add task'} teamInfo={teamInfo} />
//       </div>


      

//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Task List */}
//         <div className="w-full lg:w-3/4  rounded-2xl p-6 shadow-xl  max-h-[80vh]">
//           {tasks?.length === 0 ? (
//             <div className="text-gray-400 text-center mt-10">
//               <h2 className="text-xl">No tasks created yet.</h2>
//             </div>
//           ) : (
//             <TaskLists tasks={tasks} teamId={teamId} />
//           )}
//         </div>
        

//         <div>
      
//           <ChatPopup conversationId={teamInfo?.conversation?.id} teamId={teamId} messages={messages.data} /> 
           
//         </div>

//         {/* Members List */}
//         <div className="w-full lg:w-1/4 bg-[#1a1a1a] rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
//           <h2 className="text-lg  lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
//           <MemberLists members={teamInfo?.teamMembers} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamDetail;









// // fetch teams from backend 

// import { auth } from "@/app/auth";
// import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// import TaskLists from "./_components/TaskLists";
// import MemberLists from "../_components/MemberLists";
// // import TaskLists from "./_components/TaskLists";


// // async function fetchTeamsByUserId(userid) {
// //   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) {
// //     throw new Error("Failed to fetch teams");
// //   }

// //   return res.json();
// // }

// async function fetchSingleTeamInfo(teamid) {
//     // const token = localStorage.getItem("token"); // Assuming you store your token in localStorage or sessionStorage
  
//     const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
  
//     if (!res.ok) {
//       throw new Error("Failed to fetch teams");
//     }
  
//     return res.json();
//   }

// // async function fetchTeamsByUserId(userid) {
// //   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) {
// //     throw new Error("Failed to fetch teams");
// //   }

// //   return res.json();
// // }  


// async function fetchTasks(teamId) {
//   const res = await fetch(`http://localhost:3000/api/tasks/${teamId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch teams");
//   }

//   return res.json();
// } 

// const TeamDetail = async ({params}) => {

//   const {teamId} = await params

//   const { user } = await auth();

//   const currentUserId = user?.id;


//   let teamInfo = await fetchSingleTeamInfo(teamId)
//    teamInfo = teamInfo.data

//    console.log('TeamInfo', teamInfo)



//     let data = await fetchTasks(teamId)
//     let tasks = data?.data

//     console.log('Tasks-----coming', tasks)

//   return (
//     <div className="min-h-screen bg-black text-white  p-6">
//       <div className="flex mt-8 justify-between  items-center mb-8">
//         <h1 className="text-4xl font-bold">Tasks</h1>
//         <ModalTaskButton buttonLabel={'+ Add task'}  teamInfo={teamInfo} />
//       </div>

//       {/* {tasks?.length === 0 && <div className="text-gray-400 text-center mt-10">
//         <h2>No tasks created yet.</h2>
//       </div>} */}

//         {/* <TaskLists tasks={tasks} /> */}
//         <div className="w-1/3">
//           <MemberLists members={teamInfo?.teamMembers} />
//         </div>


//         <TaskLists tasks={tasks} />

       
      
//     </div>
//   );
// };

// export default TeamDetail;














// import { auth } from "@/app/auth";
// import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// import TaskLists from "./_components/TaskLists";
// import MemberLists from "../_components/MemberLists";

// async function fetchSingleTeamInfo(teamid) {
//   const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch teams");

//   return res.json();
// }

// async function fetchTasks(teamId) {
//   const res = await fetch(`http://localhost:3000/api/tasks/${teamId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch tasks");

//   return res.json();
// }

// const TeamDetail = async ({ params }) => {
//   const { teamId } = params;
//   const { user } = await auth();
//   const currentUserId = user?.id;

//   let teamInfo = await fetchSingleTeamInfo(teamId);
//   teamInfo = teamInfo.data;

//   let data = await fetchTasks(teamId);
//   let tasks = data?.data;

//   return (
//     <div className="min-h-screen  text-white p-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
//         <h1 className="text-3xl sm:text-4xl font-extrabold mt-8">📋 Team Tasks</h1>
//         <ModalTaskButton buttonLabel={'+ Add task'} teamInfo={teamInfo} />
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Task List */}
//         <div className="w-full lg:w-3/4  rounded-2xl p-6 shadow-xl  max-h-[80vh]">
//           {tasks?.length === 0 ? (
//             <div className="text-gray-400 text-center mt-10">
//               <h2 className="text-xl">No tasks created yet.</h2>
//             </div>
//           ) : (
//             <TaskLists tasks={tasks} />
//           )}
//         </div>

//         {/* Members List */}
//         <div className="w-full lg:w-1/4 bg-[#1a1a1a] rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
//           <h2 className="text-lg  lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
//           <MemberLists members={teamInfo?.teamMembers} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamDetail;









// // // fetch teams from backend 

// // import { auth } from "@/app/auth";
// // import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// // import TaskLists from "./_components/TaskLists";
// // import MemberLists from "../_components/MemberLists";
// // // import TaskLists from "./_components/TaskLists";


// // // async function fetchTeamsByUserId(userid) {
// // //   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
// // //     method: "GET",
// // //     headers: {
// // //       "Content-Type": "application/json",
// // //     },
// // //   });

// // //   if (!res.ok) {
// // //     throw new Error("Failed to fetch teams");
// // //   }

// // //   return res.json();
// // // }

// // async function fetchSingleTeamInfo(teamid) {
// //     // const token = localStorage.getItem("token"); // Assuming you store your token in localStorage or sessionStorage
  
// //     const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
// //       method: "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //     });
  
// //     if (!res.ok) {
// //       throw new Error("Failed to fetch teams");
// //     }
  
// //     return res.json();
// //   }

// // // async function fetchTeamsByUserId(userid) {
// // //   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
// // //     method: "GET",
// // //     headers: {
// // //       "Content-Type": "application/json",
// // //     },
// // //   });

// // //   if (!res.ok) {
// // //     throw new Error("Failed to fetch teams");
// // //   }

// // //   return res.json();
// // // }  


// // async function fetchTasks(teamId) {
// //   const res = await fetch(`http://localhost:3000/api/tasks/${teamId}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) {
// //     throw new Error("Failed to fetch teams");
// //   }

// //   return res.json();
// // } 

// // const TeamDetail = async ({params}) => {

// //   const {teamId} = await params

// //   const { user } = await auth();

// //   const currentUserId = user?.id;


// //   let teamInfo = await fetchSingleTeamInfo(teamId)
// //    teamInfo = teamInfo.data

// //    console.log('TeamInfo', teamInfo)



// //     let data = await fetchTasks(teamId)
// //     let tasks = data?.data

// //     console.log('Tasks-----coming', tasks)

// //   return (
// //     <div className="min-h-screen bg-black text-white  p-6">
// //       <div className="flex mt-8 justify-between  items-center mb-8">
// //         <h1 className="text-4xl font-bold">Tasks</h1>
// //         <ModalTaskButton buttonLabel={'+ Add task'}  teamInfo={teamInfo} />
// //       </div>

// //       {/* {tasks?.length === 0 && <div className="text-gray-400 text-center mt-10">
// //         <h2>No tasks created yet.</h2>
// //       </div>} */}

// //         {/* <TaskLists tasks={tasks} /> */}
// //         <div className="w-1/3">
// //           <MemberLists members={teamInfo?.teamMembers} />
// //         </div>


// //         <TaskLists tasks={tasks} />

       
      
// //     </div>
// //   );
// // };

// // export default TeamDetail;