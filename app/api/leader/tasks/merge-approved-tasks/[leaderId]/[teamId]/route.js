import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req, {params}) {

    const {leaderId} = await params;
    const {teamId} = await params;

    const session = await auth();
    const currentUserId = session?.user?.id;

  try {

    // const { taskTitle, taskShortDescription, priority, taskBgColor, taskTextColor } = await req.json();

    if(leaderId !== currentUserId) {
      return NextResponse.json(
        { message: "You Are Not Authorized to add task" },
        { status: 403 }
      );
    }

    const newMergedTask = await TaskService.leaderMergeApprovedTasks(leaderId, teamId)

    revalidatePath(`/teams/${teamId}`);

    return NextResponse.json(
      { message: "Tasks Merged successfully!", data: newMergedTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error merging tasks:", error);
    return NextResponse.json(
      { message: "An error occurred while mergin the tasks.", error: error.message },
      { status: 500 }
    );
  }
}
