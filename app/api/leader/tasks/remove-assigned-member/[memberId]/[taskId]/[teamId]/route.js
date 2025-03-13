import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import TeamService from "@/app/services/TeamService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(req, {params}) {

    const session = await auth();

    const currentUserId = session?.user?.id

    const { memberId, taskId, teamId } = await params;

    console.log({memberId, taskId, teamId})
    
  try {

    // get the task teamLeader

    const team  = await TeamService.fetchSingleTeam(teamId)

    if(team?.leaderId !== currentUserId) {
      return NextResponse.json(
        { message: "You are not Authorized to Remove member from Assigned task panel"},
        { status: 403 }
      );
    }

    const assignedTaskRemovedFromMembers = await TaskService.removeMemberFromAssignedTask(memberId, taskId, teamId)

    revalidatePath(`/tasks/detail/${taskId}/${teamId}`);
    
    return NextResponse.json(
      { message: "Removed Member From Assigned Tasks Panel!", data: assignedTaskRemovedFromMembers },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error removing member from assigned tasks panel:", error);
    return NextResponse.json(
      { message: "Error removing member from assigned tasks panelr", error: error.message },
      { status: 500 }
    );
  }
}
