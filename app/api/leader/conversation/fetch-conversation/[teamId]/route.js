import ChatMessageService from "@/app/services/ChatMessageService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {

    const teamId = await params?.teamId || "";

  try {

    const conversation = await ChatMessageService.fetchConversation(teamId);
   
    revalidatePath(`/teams/${teamId}`);

    return NextResponse.json(
      { message: "Conversation", data: conversation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching conversation.", error: error.message },
      { status: 500 }
    );
  }
}
