import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req, {params}) {

    const leaderId = await params?.leaderId || "";
    const teamId = await params?.teamId || "";

    console.log(teamId, leaderId)

  try {


    const { taskTitle, taskShortDescription, priority, taskBgColor, taskTextColor } = await req.json();
    
    const newTask = await TaskService.addTaskToTeam(
        leaderId,
        teamId,
        taskTitle,
        taskShortDescription,
        priority,
        taskBgColor,
        taskTextColor
    )


     revalidatePath(`/teams/${teamId}`);

    return NextResponse.json(
      { message: "New Task created successfully!", data: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the task.", error: error.message },
      { status: 500 }
    );
  }
}
