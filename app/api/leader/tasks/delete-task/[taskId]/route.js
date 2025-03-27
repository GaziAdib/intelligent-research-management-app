import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(req, {params}) {

    const session = await auth()

    const currentUser = session?.user?.id

    const { taskId } = await params


  try {

    const task = await TaskService.fetchTaskById(taskId);

    if(task.leaderId !== currentUser) {
        return NextResponse.json(
            { message: "Are Are not Authorized to delete this tasks!" },
            { status: 403 }
          );
    } 
    
    // then delete this task by leader only
    await TaskService.DeleteTask(taskId)

    revalidatePath(`/teams/${task.teamId}`);

    return NextResponse.json(
      { message: "Task Deleted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the task.", error: error.message },
      { status: 500 }
    );
  }
}
