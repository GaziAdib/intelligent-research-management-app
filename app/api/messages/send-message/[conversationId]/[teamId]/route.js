import { auth } from "@/app/auth";
import ChatMessageService from "@/app/services/ChatMessageService";
import TeamService from "@/app/services/TeamService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(req, {params}) {

    const session = await auth()

    const currentUserId = session?.user?.id;

  try {

    const { conversationId, teamId } = await params;

    const {content} = await req.json();



    let teamInfo = await TeamService.fetchSingleTeam(teamId);

     let teamMembersIds = teamInfo?.teamMembers.map((member) => member.userId) || [];

     if(teamMembersIds?.includes(currentUserId) || teamInfo?.leaderId === currentUserId) {

        const newMessage = await ChatMessageService.sendMessage(conversationId,
          currentUserId, teamMembersIds, content
        )

        revalidatePath(`/tasks/${teamId}`);

        return NextResponse.json(
          { message: "Message Sent!", data: newMessage},
          { status: 201 }
        );

     } else {

        return NextResponse.json(
          { message: "You cannot send messages!", error: error.message },
          { status: 403 }
        );
     }


  
 
  } catch (error) {
    console.error("Error Sending Message:", error);
    return NextResponse.json(
      { message: "Error Sending Messages", error: error.message },
      { status: 500 }
    );
  }
}
