
import { auth } from "@/app/auth";
import UserService from "@/app/services/UserService";
import { NextResponse } from "next/server";


export async function GET(req) {

  try {

    // const session = await auth()
   

    // if (!userId) {
    //   return NextResponse.json(
    //     { message: "Unauthorized access." },
    //     { status: 401 }
    //   );
    // }

    //const teams = await TeamService.fetchTeams(userId, userRole);
    const users = await UserService.fetchAllUsers()
    
    return NextResponse.json({data:users}, { status: 200 });
  } catch (error) {
    console.error("Error fetching users data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching users data." },
      { status: 500 }
    );
  }
}
