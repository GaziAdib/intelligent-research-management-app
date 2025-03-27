import AdminService from "@/app/services/AdminService";
import { NextResponse } from "next/server";


export async function GET(req) {

// const userId = req.nextUrl.searchParams?.get("userId"); // Get the userId from query params

// console.log('UserId', userId)

  try {

    const notifications = await AdminService.adminFetchAllNotifications();

    return NextResponse.json({ data: notifications }, { status: 200 });

  } catch (error) {
    console.error("Error fetching notifications data in admin panel!", error);
    return NextResponse.json(
      { message: "An error occurred while fetching notifications data in admin panel!" },
      { status: 500 }
    );
  }
}
