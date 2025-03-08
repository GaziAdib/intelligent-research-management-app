// fetch teams from backend 

import { auth } from "@/app/auth";
import ModalTaskButton from "./_components/buttons/ModalTaskButton";
import TaskLists from "./_components/TaskLists";
// import TaskLists from "./_components/TaskLists";


// async function fetchTeamsByUserId(userid) {
//   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
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

async function fetchSingleTeamInfo(teamid) {
    // const token = localStorage.getItem("token"); // Assuming you store your token in localStorage or sessionStorage
  
    const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch teams");
    }
  
    return res.json();
  }

// async function fetchTeamsByUserId(userid) {
//   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
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


async function fetchTasks(teamId) {
  const res = await fetch(`http://localhost:3000/api/tasks/${teamId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch teams");
  }

  return res.json();
} 

const TeamDetail = async ({params}) => {

  const {teamId} = await params

  const { user } = await auth();

  const currentUserId = user?.id;

  console.log('Current User Id', currentUserId);


  let teamInfo = await fetchSingleTeamInfo(teamId)
  teamInfo = teamInfo

  console.log('Team Detail Info', teamInfo)


    let data = await fetchTasks(teamId)
    let tasks = data?.data

    console.log('Tasks-----coming', tasks)

  return (
    <div className="min-h-screen bg-black text-white  p-6">
      <div className="flex mt-8 justify-between  items-center mb-8">
        <h1 className="text-4xl font-bold">Tasks</h1>
        <ModalTaskButton buttonLabel={'+ Add task'}  teamInfo={teamInfo} />
      </div>

      {/* {tasks?.length === 0 && <div className="text-gray-400 text-center mt-10">
        <h2>No tasks created yet.</h2>
      </div>} */}

        {/* <TaskLists tasks={tasks} /> */}
        <TaskLists tasks={tasks} />
      
    </div>
  );
};

export default TeamDetail;