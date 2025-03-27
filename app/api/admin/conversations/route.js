import AdminService from "@/app/services/AdminService";
import { NextResponse } from "next/server";


export async function GET(req) {

// const userId = req.nextUrl.searchParams?.get("userId"); // Get the userId from query params

// console.log('UserId', userId)

  try {

    const conversations = await AdminService.adminFetchAllConversations()

    return NextResponse.json({ data: conversations }, { status: 200 });

  } catch (error) {
    console.error("Error fetching conversations data in admin panel!", error);
    return NextResponse.json(
      { message: "An error occurred while fetching conversations data in admin panel!" },
      { status: 500 }
    );
  }
}
