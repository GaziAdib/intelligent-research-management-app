import { auth } from "@/app/auth";
import ChatMessageService from "@/app/services/ChatMessageService";
import TaskService from "@/app/services/TaskService";
import TeamService from "@/app/services/TeamService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req, {params}) {

const teamId = await params?.teamId || "";

const session = await auth()
const currentUserId =  session?.user?.id

  try {

    const { title } = await req.json();


    const team  = await TeamService.fetchSingleTeam(teamId);

    if(team.leaderId !== currentUserId) {
        return NextResponse.json(
            { message: "You are not Authorized to Create Conversation!"},
            { status: 403 }
          );
    }

    const creatorId = team.leaderId;
    
    const newConversation = await ChatMessageService.createConversation(
        teamId, creatorId, title
    )


    revalidatePath(`/tasks/${teamId}`);

    return NextResponse.json(
      { message: "New Conversation Created successfully!", data: newConversation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conversations:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the conversation.", error: error.message },
      { status: 500 }
    );
  }
}
