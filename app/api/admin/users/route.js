import AdminService from "@/app/services/AdminService";
import { NextResponse } from "next/server";


export async function GET(req) {

// const userId = req.nextUrl.searchParams?.get("userId"); // Get the userId from query params

// console.log('UserId', userId)

  try {

    const users = await AdminService.adminFetchAllUsers()

    return NextResponse.json({ data: users }, { status: 200 });

  } catch (error) {
    console.error("Error fetching users data in admin panel!", error);
    return NextResponse.json(
      { message: "An error occurred while fetching users data in admin panel!" },
      { status: 500 }
    );
  }
}
