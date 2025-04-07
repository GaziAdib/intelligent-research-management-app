import TeamCard from "./TeamCard"

const TeamLists = ({teams}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {teams?.map((team) => (
              <TeamCard key={team?.id} team={team} />
          ))}
      </div>
  )
}

export default TeamLists