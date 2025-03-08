import { auth } from "../auth";
import ModalButton from "./_components/buttons/ModalButton";
import TeamLists from "./_components/TeamLists";

// Fetch teams from backend
async function fetchTeamsByUserId(userid) {
  const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
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

const Teams = async () => {
  // Fetch teams data

  const session = await auth();
  let userCurrentId = session?.user?.id;

  let data = await fetchTeamsByUserId(userCurrentId);
  let teams =  data?.data 

  console.log("Fetched teams:", teams); // Debugging

  // // Get the current user's session
  // const session = await auth();
  // const currentUserId = session?.user?.id;

  // console.log("Current user ID:", currentUserId); // Debugging

  // // Filter teams where the current user is NOT a member
  // const userInTeams = teams.filter(
  //   (team) => team.teamMembers.some((m) => m === currentUserId)
  // );

  //console.log("Teams where user is NOT a member:", userInTeams); // Debugging

  // If the user is not a member of any team, set teams to an empty array
  // if (userNotInTeams.length === teams.length) {
  //   teams = [];
  // }

  //console.log("Final teams to display:", teams); // Debugging

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex mt-8 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Teams</h1>
        <ModalButton buttonLabel={"+ Create team"} />
      </div>

      {/* Show a message if no teams are available */}
      {teams?.length === 0 && (
        <div className="text-gray-400 text-center mt-10">
          <h2>You are not a member of any team.</h2>
        </div>
      )}

      {/* Render the list of teams */}
      <TeamLists teams={teams} />
    </div>
  );
};

export default Teams;