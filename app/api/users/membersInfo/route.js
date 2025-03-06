
import UserService from "@/app/services/UserService";
import { NextResponse } from "next/server";


export async function POST(req) {

    const { userIds } = await req.json()

  try {

    if (!userIds || userIds.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided' });
      }

    
    //const teams = await TeamService.fetchTeams(userId, userRole);
    const users = await UserService.fetchAllUsers()

    const filteredUsers = users?.filter(user => userIds?.includes(user.id))

    if (filteredUsers.length === 0) {
        return NextResponse.json({ error: 'No users found for the provided IDs' }, { status: 404 });
      }

    // Return the filtered users
    return NextResponse.json({ data: filteredUsers }, { status: 200 });
    
    // return NextResponse.json({data:users}, { status: 200 });
  } catch (error) {
    console.error("Error fetching users data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching users data." },
      { status: 500 }
    );
  }
}
