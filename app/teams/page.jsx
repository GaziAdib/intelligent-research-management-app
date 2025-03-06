import ModalButton from "./_components/buttons/ModalButton";
import TeamCard from "./_components/TeamCard";


// fetch teams from backend 

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

const Teams = async () => {


  let data = await fetchTeams()
  let teams = data?.data


  return (
    <div className="min-h-screen bg-black text-white  p-6">
      <div className="flex mt-8 justify-between  items-center mb-8">
        <h1 className="text-4xl font-bold">Teams</h1>
        <ModalButton />
      </div>

      {teams?.length === 0 && <div className="text-gray-400 text-center mt-10">
        <h2>No teams created yet.</h2>
      </div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {teams?.map((team) => (
              <TeamCard key={team?.id} team={team} />
          ))}
        </div>
    </div>
  );
};

export default Teams;