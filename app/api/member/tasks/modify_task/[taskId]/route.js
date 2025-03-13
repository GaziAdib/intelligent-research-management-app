import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(req, {params}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { taskId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "You must be an authenticated user to create a team." },
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
