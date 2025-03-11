import TaskService from "@/app/services/TaskService";

import { NextResponse } from "next/server";

// http://localhost:3000/api/tasks/task-detail/67ce0efc629cdce32d08eb57/67ce17fc613c9daebd9c4720

export async function GET(req, {params}) {

  const { teamId, taskId } = await params

  try {

    //  const currentUserId = session?.user?.id

    // it will return true if user in team or false if not
    // let checkUserInTeam = await TeamService.checkUserInTeam(userId, teamId)

    // console.log('USER IN Team',checkUserInTeam);

    // if(!checkUserInTeam) {
    //     return NextResponse.json({message: 'You Are not in this team so you cannot see tasks'}, { status: 404 });
    // }

 
    const taskDetail = await TaskService.fetchSingleTask(teamId, taskId)
    
    return NextResponse.json({ data:taskDetail }, { status: 200 });

  } catch (error) {
    console.error("Error fetching task details data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching task details data." },
      { status: 500 }
    );
  }
}
