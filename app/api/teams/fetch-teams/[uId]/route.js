
import TeamService from "@/app/services/TeamService";

import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { uId } = await params;

  

  try {
    let teams;

    if (uId) {
      // If a specific user ID is provided, fetch teams for that user
      teams = await TeamService.fetchTeamsByUserId(uId);
    } else {
      // If no user ID is provided, return all teams (for admin)
      teams = await TeamService.fetchAllTeams();
    }

    return NextResponse.json({ data: teams }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching teams data." },
      { status: 500 }
    );
  }
}
