import TeamService from "@/app/services/TeamService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(req, {params}) {

    const teamId = await params?.teamId || '';

    const userId = await params?.userId || '';

  try {
    
        if (!userId) {
        return NextResponse.json(
            { message: "You must be an authenticated User" },
            { status: 403 }
        );
        }
     
     const kickedMemberFromTeam =  await TeamService.kickMemberFromTeam(userId, teamId)

     revalidatePath("/teams");

     return NextResponse.json(
       { message: "Member Kicked out from the Team!", },
       { status: 201 }
     );
   } catch (error) {
     console.error("Error Assigning User to team:", error);
     return NextResponse.json(
       { message: "An error occurred while creating the team.", error: error.message },
       { status: 500 }
     );
   }
}
