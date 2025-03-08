// fetch teams from backend 

import TeamLists from "../_components/TeamLists";
import ModalTaskButton from "./_components/buttons/ModalTaskButton";


async function fetchTeams() {
  // const token = localStorage.getItem("token"); // Assuming you store your token in localStorage or sessionStorage

  const res = await fetch("http://localhost:3000/api/teams", {
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

const TeamDetail = async ({params}) => {

  const teamId = await params?.teamId || "";


  let teamInfo = await fetchSingleTeamInfo(teamId)
  teamInfo = teamInfo

  console.log('Team Detail Info', teamInfo)

  let data = await fetchTeams()
  let teams = data?.data


  return (
    <div className="min-h-screen bg-black text-white  p-6">
      <div className="flex mt-8 justify-between  items-center mb-8">
        <h1 className="text-4xl font-bold">Tasks</h1>
        <ModalTaskButton buttonLabel={'+ Add task'}  teamInfo={teamInfo} />
      </div>

      {teams?.length === 0 && <div className="text-gray-400 text-center mt-10">
        <h2>No teams created yet.</h2>
      </div>}

        <TeamLists teams={teams} />
      
    </div>
  );
};

export default TeamDetail;