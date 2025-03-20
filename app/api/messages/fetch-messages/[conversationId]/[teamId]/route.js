import ChatMessageService from "@/app/services/ChatMessageService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {

  const { conversationId, teamId } = await params;

  let messages;

  try {
    // Fetch chat messages

    try {
      // Fetch team details, including members and conversation
      const teamDetails = await ChatMessageService.checkTeamMembersavailable(teamId);
    
      // Check if the team has members and a valid conversation
      if (teamDetails?.teamMembers?.length > 0 && teamDetails?.conversation?.id) {
        // Fetch messages only if the team has members and a valid conversation
        messages = await ChatMessageService.fetchChatMessages(conversationId);
      } else {
        console.error("Cannot fetch messages: Team has no members or no valid conversation.");
        // Handle the case where messages cannot be fetched (e.g., return an empty array or throw an error)
        messages = [];
      }
    } catch (error) {
      console.error("Error checking team members or fetching messages:", error);
      throw new Error("Failed to fetch messages: " + error.message);
    }
    
    

   // Check if messages exist
    // if (!messages || messages?.length === 0) {
    //   return NextResponse.json(
    //     { message: "No messages found for this conversation." },
    //     { status: 404 }
    //   );
    // }

    // Check if the conversation has a team and team members
    // const team = messages[0]?.conversation?.team;
    // const teamMembers = checkMemberInteam?.teamMembers;

    // if (!team || !teamMembers || teamMembers?.length === 0) {
    //   return NextResponse.json(
    //     { message: "This team has no members. You cannot see messages!" },
    //     { status: 403 }
    //   );
    // }

    // // Check if all message receivers are team members
    // const messageReceivers = messages[0]?.receivers?.map((r) => r); // Extract receiver IDs
    // const teamMemberIds = teamMembers?.map((m) => m?.userId); // Extract user IDs from team members

    // const areAllReceiversTeamMembers = messageReceivers?.every((receiverId) =>
    //   teamMemberIds?.includes(receiverId)
    // );

    // if (!areAllReceiversTeamMembers) {
    //   return NextResponse.json(
    //     { message: "You cannot see messages!" },
    //     { status: 403 }
    //   );
    // }

    // Revalidate the team page

    revalidatePath(`/teams/${teamId}`);

    return NextResponse.json(
      { message: "Messages", data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Messages:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching Messages",
        error: error.message,
      },
      { status: 500 }
    );
  }
}





// import ChatMessageService from "@/app/services/ChatMessageService";
// import { revalidatePath } from "next/cache";
// import { NextResponse } from "next/server";

// export async function GET(req, {params}) {

// const { conversationId } = await params;
//   try {

//     const messages = await ChatMessageService.fetchChatMessages(conversationId);

//     if (messages[0]?.receivers?.length < 0) {
//         return NextResponse.json(
//           { message: "You Cannot see messages!"},
//           { status: 403 }
//         );
      
//     }
    
//     // const messageReceivers = messages[0]?.receivers?.map(r => r); // Extract receiver IDs

//     // const teamMemberIds = messages[0]?.conversation?.team?.teamMembers?.map(m => m?.userId); // Extract user IDs from team members

//     // //const areAllReceiversTeamMembers = messageReceivers?.every(receiverId => teamMemberIds.includes(receiverId))

//     // const areAllReceiversTeamMembers = messageReceivers?.some(receiverId => teamMemberIds?.includes(receiverId))

//       const messageReceivers = messages[0]?.receivers?.map(r => r); // Extract receiver IDs

//       const teamMemberIds = messages[0]?.conversation?.team?.teamMembers?.map(m => m?.userId); // Extract user IDs from team members
  
//       //const areAllReceiversTeamMembers = messageReceivers?.every(receiverId => teamMemberIds.includes(receiverId))
  
//       const areAllReceiversTeamMembers = messageReceivers?.some(receiverId => teamMemberIds?.includes(receiverId))

//     if(!areAllReceiversTeamMembers) {
//         return NextResponse.json(
//             { message: "You Cannot see messages!"},
//             { status: 403 }
//           );
//     }

//     const teamId = messages[0]?.conversation?.teamId;
   
//     revalidatePath(`/teams/${teamId}`);

//     return NextResponse.json(
//       { message: "Messages", data: messages },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching Messages:", error);
//     return NextResponse.json(
//       { message: "An error occurred while fetching Messages", error: error.message },
//       { status: 500 }
//     );
//   }
// }
