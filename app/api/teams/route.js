import { auth } from "@/app/auth";
import TeamService from "@/app/services/TeamService";
import { NextResponse } from "next/server";

export async function GET(req) {

  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized access." },
        { status: 401 }
      );
    }

    const teams = await TeamService.fetchTeams(userId, userRole);
    
    return NextResponse.json({ teams }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching teams data." },
      { status: 500 }
    );
  }
}
