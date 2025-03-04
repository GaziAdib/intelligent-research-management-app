import { auth } from "@/app/auth";
import TeamService from "@/app/services/TeamService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "You must be an authenticated user to create a team." },
        { status: 403 }
      );
    }

    const { teamName, teamShortDescription, teamBgColor, teamTextColor, teamLogoUrl } = await req.json();
    
    const newTeam = await TeamService.createTeam(
      userId,
      teamName,
      teamShortDescription,
      teamBgColor,
      teamTextColor,
      teamLogoUrl
    );

    revalidatePath("/add-team");

    return NextResponse.json(
      { message: "New team created successfully!", team: newTeam },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the team.", error: error.message },
      { status: 500 }
    );
  }
}
