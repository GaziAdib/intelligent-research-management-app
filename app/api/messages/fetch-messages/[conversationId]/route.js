import ChatMessageService from "@/app/services/ChatMessageService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {

    const conversationId = await params?.conversationId || "";

  try {

    const messages = await ChatMessageService.fetchChatMessages(conversationId);
    
    const messageReceivers = messages[0]?.receivers?.map(r => r); // Extract receiver IDs
    const teamMemberIds = messages[0]?.conversation?.team?.teamMembers?.map(m => m?.userId); // Extract user IDs from team members


    const areAllReceiversTeamMembers = messageReceivers?.every(receiverId => teamMemberIds.includes(receiverId))

    if(!areAllReceiversTeamMembers) {
        return NextResponse.json(
            { message: "You Cannot see messages!"},
            { status: 403 }
          );
    }

    const teamId = messages[0]?.conversation?.teamId;
   
    revalidatePath(`/tasks/${teamId}`);

    return NextResponse.json(
      { message: "Messages", data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Messages:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching Messages", error: error.message },
      { status: 500 }
    );
  }
}
