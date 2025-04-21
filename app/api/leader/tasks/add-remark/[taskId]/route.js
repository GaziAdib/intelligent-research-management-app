import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


export async function PUT(req, {params}) {

const { taskId } = await params;

const session = await auth();

const currentUserId = session?.user?.id;

const { remarkByLeader } = await req.json();

  try {

    const task = await TaskService.fetchTaskById(taskId);

    if(task?.leaderId !== currentUserId) {
        return NextResponse.json(
            { message: "You Cannot Add Remark On this Task! You are not the leader!" },
            { status: 403 }
          );
    }

    const newUpdatedTask = await TaskService.addRemarkToTask(
            task.leaderId,
            taskId,
            remarkByLeader
        );


    revalidatePath(`/teams/${task?.teamId}`);

    return NextResponse.json(
      { message: "Added Remark To Task!", data: newUpdatedTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding remark to task :", error);
    return NextResponse.json(
      { message: "An error occurred while adding remark to task.", error: error.message },
      { status: 500 }
    );
  }
}
