import { auth } from "@/app/auth";
import TeamService from "@/app/services/TeamService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(req, {params}) {

    const session = await auth()

    const currentUser = session?.user?.id

    const { teamId  } = await params;


  try {

    const team = await TeamService.fetchSingleTeam(teamId)

    if(team.leaderId !== currentUser) {
        return NextResponse.json(
            { message: "Are Are not Authorized to delete this team!" },
            { status: 403 }
          );
    } 
    
    // then delete this team by leader of the team
    await TeamService.deleteTeam(team.id)

    revalidatePath(`/teams`);

    return NextResponse.json(
      { message: "Team Deleted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the team.", error: error.message },
      { status: 500 }
    );
  }
}
