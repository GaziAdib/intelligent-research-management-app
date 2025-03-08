import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import TeamService from "@/app/services/TeamService";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {


  // const session = await auth();
  const { teamId } = await params

  // const {user} = await auth()

  // let userId = user?.id



  try {

    //  const currentUserId = session?.user?.id

    // it will return true if user in team or false if not
    // let checkUserInTeam = await TeamService.checkUserInTeam(userId, teamId)

    // console.log('USER IN Team',checkUserInTeam);

    // if(!checkUserInTeam) {
    //     return NextResponse.json({message: 'You Are not in this team so you cannot see tasks'}, { status: 404 });
    // }

    const tasks = await TaskService.fetchTasks(teamId)

    console.log('Tasks', tasks)
    
    return NextResponse.json({data:tasks}, { status: 200 });

    
  } catch (error) {
    console.error("Error fetching tasks data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching tasks data." },
      { status: 500 }
    );
  }
}
