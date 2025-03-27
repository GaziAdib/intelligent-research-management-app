import TeamService from "@/app/services/TeamService";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {

  const { teamId } = await params

  try {

    const team = await TeamService.fetchSingleTeam(teamId)

    return NextResponse.json({data:team}, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching teams data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching teams data." },
      { status: 500 }
    );
  }
}
