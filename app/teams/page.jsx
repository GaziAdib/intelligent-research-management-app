import { redirect } from "next/navigation";
import { auth } from "../auth";
import ModalButton from "./_components/buttons/ModalButton";
import TeamLists from "./_components/TeamLists";

// Fetch teams from backend
async function fetchTeamsByUserId(userid) {
  if (!userid) throw new Error("User ID is missing");

  // Use relative URL for server-side fetch
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/teams/fetch-teams/${userid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Always fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch teams");
  }

  return res.json();
}

const Teams = async () => {
  const session = await auth();

  // Redirect if user is not logged in
  if (!session || !session.user?.id) {
    return redirect("/login");
  }

  const userCurrentId = session.user.id;

  // Fetch teams safely
  let data;
  try {
    data = await fetchTeamsByUserId(userCurrentId);
  } catch (err) {
    console.error("Failed to fetch teams:", err);
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <h2 className="text-red-500 text-center mt-10">
          Failed to load teams. Please try again later.
        </h2>
      </div>
    );
  }

  const teams = data?.data || [];

  // Filter teams where user is a member
  const matchId =
    teams?.filter((team) =>
      team?.teamMembers?.some((member) => member?.userId === userCurrentId)
    ) || [];

  // Redirect ADMINs if they have no matching teams
  if (matchId.length === 0 && session.user.role === "ADMIN") {
    return redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex mt-8 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Teams</h1>
        <ModalButton buttonLabel={"+ Create team"} />
      </div>

      {teams.length === 0 ? (
        <div className="text-gray-400 text-center mt-10">
          <h2>You are not a member of any team.</h2>
        </div>
      ) : (
        <div className="container mx-auto flex justify-center items-center">
          <TeamLists teams={teams} />
        </div>
      )}
    </div>
  );
};

export default Teams;










// import { redirect } from "next/navigation";
// import { auth } from "../auth";
// import ModalButton from "./_components/buttons/ModalButton";
// import TeamLists from "./_components/TeamLists";

// // Fetch teams from backend
// async function fetchTeamsByUserId(userid) {
//   const res = await fetch(`${process.env.NEXTAUTH_URL}/api/teams/fetch-teams/${userid}`, {
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

// const Teams = async () => {


//   const session = await auth();
//   let userCurrentId =  session?.user?.id;

//   if(!session) {
//     return redirect('/login')
//   }


//   let data = await fetchTeamsByUserId(userCurrentId);
//   let teams =  data?.data 

//   const matchId = teams?.filter((team) => team?.teamMembers?.some((member) => member?.userId === userCurrentId))

//   if(matchId?.length === 0 && session?.user?.role === 'ADMIN') {
//     return redirect('/admin/dashboard')
//   }


//   return (
//     <div className="min-h-screen bg-black text-white p-6">
//       <div className="flex mt-8 justify-between items-center mb-8">
//         <h1 className="text-4xl font-bold">Teams</h1>
//         <ModalButton buttonLabel={"+ Create team"} />
//       </div>

//       {/* Show a message if no teams are available */}
//       {teams?.length === 0 && (
//         <div className="text-gray-400 text-center mt-10">
//           <h2>You are not a member of any team.</h2>
//         </div>
//       )}

//       {/* Render the list of teams */}
//       <div className="container mx-auto flex justify-center items-center">
//         <TeamLists teams={teams} />
//     </div>
//     </div>
//   );
// };

// export default Teams;