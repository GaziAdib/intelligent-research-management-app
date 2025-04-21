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


    if(leaderId !== currentUserId) {
      return NextResponse.json(
        { message: "You Are Not Authorized to Merge tasks On Leader can Merge!" },
        { status: 403 }
      );
    }

    const newMergedTask = await TaskService.leaderMergeApprovedTasks(leaderId, teamId)
    
    if(newMergedTask?.status === 'already_merged') {
      revalidatePath(`/teams/${newMergedTask?.teamId}`);
      return NextResponse.json(
        { message: "Tasks Already Merged!", data: newMergedTask},
        { status: 200 }
      );
    }

    if (newMergedTask?.message) {
      return NextResponse.json(
        { message: "No Tasks Are Approved"},
        { status: 404 }
      );
    }
    
    revalidatePath(`/teams/${newMergedTask?.teamId}`);

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
