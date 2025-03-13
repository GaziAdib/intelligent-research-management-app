import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(req, {params}) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const { taskId } = await params;

    const task = await TaskService.fetchTaskById(taskId)

    if (!task.taskAssignedTo.includes(currentUserId)) {
      return NextResponse.json(
          { message: "You Are No Suitable to Update Task" },
          { status: 403 }
        );
  }

  if (task?.leaderId === currentUserId) {
      return NextResponse.json(
          { message: "Leader is No Suitable to Update members Task" },
          { status: 403 }
        );
  }
    const { taskTitle, taskShortDescription, taskMemberDraftContent, taskMemberFinalContent, aiGeneratedText, aiGeneratedCode } = await req.json();
    
    const newEditedTask = await TaskService.updateTask(
      taskId,
      taskTitle,
      taskShortDescription,
      taskMemberDraftContent,
      taskMemberFinalContent,
      aiGeneratedCode,
      aiGeneratedText
    );

    const teamId = newEditedTask?.teamId;

    revalidatePath(`/tasks/edit-panel/${taskId}/${teamId}`);

    return NextResponse.json(
      { message: "Task Update successfully!", data: newEditedTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "An error occurred while updating task.", error: error.message },
      { status: 500 }
    );
  }
}
