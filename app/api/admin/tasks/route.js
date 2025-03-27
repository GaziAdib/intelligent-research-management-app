import AdminService from "@/app/services/AdminService";
import { NextResponse } from "next/server";


export async function GET(req) {

// const userId = req.nextUrl.searchParams?.get("userId"); // Get the userId from query params

// console.log('UserId', userId)

  try {

    const tasks = await AdminService.adminFetchAllTasks()

    return NextResponse.json({ data: tasks }, { status: 200 });

  } catch (error) {
    console.error("Error fetching tasks data in admin panel!", error);
    return NextResponse.json(
      { message: "An error occurred while fetching tasks data in admin panel!" },
      { status: 500 }
    );
  }
}
