import { auth } from "@/app/auth";
import pusher from "@/app/libs/pusherConfig";
import NotificationService from "@/app/services/NotificationService";
import TaskService from "@/app/services/TaskService";
import TeamService from "@/app/services/TeamService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(req, {params}) {

    const session = await auth();

    const currentUserId = session?.user?.id

    const {memberId, taskId, teamId} = await params
    
  try {

    // get the task teamLeader

    const team  = await TeamService.fetchSingleTeam(teamId)

    if(team?.leaderId !== currentUserId) {
      return NextResponse.json(
        { message: "You are not Authorized to Assign a task to this Team!"},
        { status: 403 }
      );
    }

    const taskAssigned = await TaskService.assignTaskToTeamMember(memberId, taskId, teamId)

    // push notification that user is assigned with task 

    const receiversIds = taskAssigned?.taskAssignedTo?.map(memberId => memberId) || []
       
    const receiversEmails = taskAssigned?.team?.teamMembers
    .filter(member => receiversIds?.includes(member?.user?.userId))
    .map(member => member?.user?.email);
  


    let message = `New Task assigned by Leader: ${taskAssigned?.taskAssignedBy?.username} on topic: ${taskAssigned?.taskTitle}. Please check it out asap!!!`
    
    const newNotification = await NotificationService.sendNotification(
      taskAssigned?.teamId,
      taskAssigned?.id,
      message,
      "TASK_ASSIGNED",
      receiversIds,
      receiversEmails
    )


    await pusher.trigger(`user`, "send-notification", {
      notification: {
        id: newNotification?.id,
        message: newNotification?.message,
        type: newNotification?.type,
        taskId: newNotification?.taskId,
        teamId: newNotification?.teamId,
        createdAt: newNotification?.createdAt,
      },
    });


    revalidatePath(`/tasks/detail/${taskId}/${teamId}`);

    return NextResponse.json(
      { message: "Task Assigned successfully!", data: taskAssigned },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning task to memeber:", error);
    return NextResponse.json(
      { message: "An error occurred while assigning task to member", error: error.message },
      { status: 500 }
    );
  }
}
