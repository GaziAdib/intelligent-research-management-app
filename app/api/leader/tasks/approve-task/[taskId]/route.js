import { auth } from "@/app/auth";
import pusher from "@/app/libs/pusherConfig";
import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


export async function PUT(req, {params}) {

const { taskId } = await params;

const session = await auth();

const currentUserId = session?.user?.id;

  try {

    const task = await TaskService.fetchTaskById(taskId);

    if(task?.leaderId !== currentUserId) {
        return NextResponse.json(
            { message: "You Cannot Approve Task! You are not the leader!" },
            { status: 403 }
          );
    }

    const newUpdatedTask = await TaskService.approveTask(taskId);

    // http://localhost:3000/tasks/edit-panel/67ce1dfa613c9daebd9c472c/67ce0efc629cdce32d08eb57

    //revalidatePath(`/teams/${task?.teamId}`);


    await pusher.trigger(`team-${newUpdatedTask.teamId}`, "task-approved", {
        taskId: newUpdatedTask.id,
        status: newUpdatedTask.status,
        teamId: newUpdatedTask.teamId
     
      });

     revalidatePath(`/teams/${newUpdatedTask?.teamId}`);

    return NextResponse.json(
      { message: "Task Approved successfully!", data: newUpdatedTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error approving task:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the task.", error: error.message },
      { status: 500 }
    );
  }
}
