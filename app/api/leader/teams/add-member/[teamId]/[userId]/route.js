import { auth } from "@/app/auth";
import TeamService from "@/app/services/TeamService";
import UserService from "@/app/services/UserService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(req, {params}) {

    const teamId = await params?.teamId || '';

    const userId = await params?.userId || '';

  try {
    

 if (!userId) {
   return NextResponse.json(
    { message: "You must be an authenticated user to create a team." },
     { status: 403 }
   );
}

      if (!teamId) {
          return NextResponse.json(
            { message: "You must be have a team Id" },
            { status: 403 }
          );
        }
     const newTeam =  await TeamService.assignUserToTeam(userId, teamId)

     await UserService.updateUserRole(userId, 'MEMBER');

     revalidatePath("/teams");

     return NextResponse.json(
       { message: "New User Assigned To The Team!", team: newTeam },
       { status: 201 }
     );
   } catch (error) {
     console.error("Error Assigning User to team:", error);
     return NextResponse.json(
       { message: "An error occurred while creating the team.", error: error.message },
       { status: 500 }
     );
   }
}
