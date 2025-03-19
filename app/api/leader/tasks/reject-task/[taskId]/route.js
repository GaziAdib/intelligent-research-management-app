import { auth } from "@/app/auth";
import pusher from "@/app/libs/pusherConfig";
import NotificationService from "@/app/services/NotificationService";
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
            { message: "You Cannot Reject Task! You are not the leader!" },
            { status: 403 }
          );
    }

      const newUpdatedTask = await TaskService.rejectTask(taskId);

      await pusher.trigger(`team-${newUpdatedTask.teamId}`, "task-rejected", {
          taskId: newUpdatedTask.id,
          status: newUpdatedTask.status,
          teamId: newUpdatedTask.teamId
        });

           // send notification

           const receiversIds = task?.taskAssignedTo?.map(memberId => memberId) || []
       
           const receiversEmails = task.team.teamMembers
           .filter(member => receiversIds?.includes(member?.user?.id))
           .map(member => member?.user?.email);
         
    
           console.log('email', receiversEmails)
    
           //let teamName = task?.team?.teamName;
        
           //let message = `Your task ${task?.taskTitle} in team ${teamName} has been approved ❤️ by leader: ${task?.taskAssignedBy?.username}`;
           
           let message = `Your Task Got Rejected by Leader: ${task?.taskAssignedBy?.username} on topic: ${task?.taskTitle}. Please check the leader remarks for your tasks in edit panel and fix the issues`
    
          const newNotification = await NotificationService.sendNotification(
            newUpdatedTask?.teamId,
            newUpdatedTask?.id,
            message,
            "TASK_REJECTED",
            receiversIds,
            receiversEmails
          
          )
    
          // console.log('Notification', newNotification)
    
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

     revalidatePath(`/teams/${newUpdatedTask?.teamId}`);

    return NextResponse.json(
      { message: "Task Rejected successfully!", data: newUpdatedTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error rejecting task:", error);
    return NextResponse.json(
      { message: "An error occurred while rejecting the task.", error: error.message },
      { status: 500 }
    );
  }
}
