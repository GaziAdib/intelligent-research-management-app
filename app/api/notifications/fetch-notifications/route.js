import NotificationService from "@/app/services/NotificationService";
import { NextResponse } from "next/server";


export async function GET(req) {

  
  const userId = req?.nextUrl?.searchParams?.get("userId");

  try {

    const notifications = await NotificationService.fetchUserNotifications(userId)

    return NextResponse.json({ data: notifications }, { status: 200 });

  } catch (error) {
    console.error("Error fetching notifications data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching ntifications data." },
      { status: 500 }
    );
  }
}
