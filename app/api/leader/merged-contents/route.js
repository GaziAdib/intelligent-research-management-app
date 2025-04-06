import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


export async function GET(req) {

  const leaderId = req.nextUrl.searchParams?.get("userId");

  try {

    const mergedContent = await TaskService.leaderFetchMergedContents(leaderId);

    return NextResponse.json({ data: mergedContent?.mergedContent }, { status: 200 });

  } catch (error) {
    console.error("Error fetching merged content data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching merged content data." },
      { status: 500 }
    );
  }
}
