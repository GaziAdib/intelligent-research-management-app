import TaskService from "@/app/services/TaskService";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {


  // const session = await auth();
  const { teamId } = await params

  // const {user} = await auth()

  // let userId = user?.id

  // use pagination 

  let pageNumber = req.nextUrl?.searchParams?.get("pageNumber");

  pageNumber = Number(pageNumber);

  let limit = 2

  try {

    //  const currentUserId = session?.user?.id

    // it will return true if user in team or false if not
    // let checkUserInTeam = await TeamService.checkUserInTeam(userId, teamId)

    // console.log('USER IN Team',checkUserInTeam);

    // if(!checkUserInTeam) {
    //     return NextResponse.json({message: 'You Are not in this team so you cannot see tasks'}, { status: 404 });
    // }


    const tasks = await TaskService.fetchTasks(teamId, limit, pageNumber)

    console.log('tasks', tasks)
    
    return NextResponse.json({ data: tasks?.tasks, totalPages:tasks?.totalPages  }, { status: 200 });

    
  } catch (error) {
    console.error("Error fetching tasks data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching tasks data." },
      { status: 500 }
    );
  }
}
