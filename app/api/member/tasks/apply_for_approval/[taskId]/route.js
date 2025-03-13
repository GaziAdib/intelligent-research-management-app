import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(req, {params}) {
  try {
    const session = await auth()
    const currentUserId = session?.user?.id;

    const { taskId } = await params;

    console.log({taskId})

    // if (!userId) {
    //   return NextResponse.json(
    //     { message: "You must be an authenticated user to create a team." },
    //     { status: 403 }
    //   );
    // }


    const task = await TaskService.fetchTaskById(taskId)

    console.log('TASK', task)


    if (!task.taskAssignedTo.includes(currentUserId)) {
        return NextResponse.json(
            { message: "You Are No Suitable to Apply for Task Approval" },
            { status: 403 }
          );
    }

    if (task?.leaderId === currentUserId) {
        return NextResponse.json(
            { message: "Leader You Cannot Apply for Task Approval" },
            { status: 403 }
          );
    }

    const newEditedTask = await TaskService.requestForTaskApproval(taskId)

    const teamId = newEditedTask?.teamId

     revalidatePath(`/tasks/edit-panel/${taskId}/${teamId}`);

    return NextResponse.json(
      { message: "Task Update successfully!", data: newEditedTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "An error occurred while applying for approval", error: error.message },
      { status: 500 }
    );
  }
}
