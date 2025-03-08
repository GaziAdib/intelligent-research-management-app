import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import TeamService from "@/app/services/TeamService";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {

const teamId = await params?.teamId || "";

  try {

    const session = await auth();

     const currentUserId = session?.user?.id

    // it will return true if user in team or false if not
    let checkUserInTeam = await TeamService.checkUserInTeam(currentUserId, teamId)

    if(!checkUserInTeam) {
        return NextResponse.json({message: 'You Are not in this team so you cannot see tasks'}, { status: 404 });
    }

    const tasks = await TaskService.fetchTasks(teamId)

    console.log('Tasks', tasks)
    
    return NextResponse.json({data:tasks}, { status: 200 });

    
  } catch (error) {
    console.error("Error fetching users data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching users data." },
      { status: 500 }
    );
  }
}
