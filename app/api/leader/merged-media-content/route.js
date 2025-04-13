import TaskService from "@/app/services/TaskService";
import { NextResponse } from "next/server";


export async function GET(req) {

  const userId = req.nextUrl.searchParams?.get("userId");

  const teamId = req.nextUrl.searchParams?.get("teamId");

  try {

    const mergedMediaContent = await TaskService.leaderFetchMergedMediaContents(teamId, userId);

    console.log('Server Media contents----', mergedMediaContent)

    return NextResponse.json({ data: mergedMediaContent }, { status: 200 });

  } catch (error) {
    console.error("Error fetching merged media content data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching merged media content data." },
      { status: 500 }
    );
  }
}
