import { redirect } from "next/navigation";
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


  const session = await auth();
  let userCurrentId = session?.user?.id;

  if(!session) {
    return redirect('/login')
  }


  let data = await fetchTeamsByUserId(userCurrentId);
  let teams =  data?.data 

  const matchId = teams?.filter((team) => team?.teamMembers?.some((member) => member?.userId === userCurrentId))

  if(matchId?.length === 0 && session?.user?.role === 'ADMIN') {
    return redirect('/admin/dashboard')
  }


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
      <div className="container mx-auto flex justify-center items-center">
        <TeamLists teams={teams} />
    </div>
    </div>
  );
};

export default Teams;