import { auth } from "@/app/auth";
import AdminService from "@/app/services/AdminService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(req, {params}) {

    const session = await auth()

    const currentUser = session?.user?.id

    const role = session?.user?.role;

    const { teamId } = await params

  try {

    if(role !== 'ADMIN') {
        return NextResponse.json(
                { message: "Are Are not Authorized to delete this tasks!" },
                { status: 403 }
                );
            }
    
    // then delete this task by leader only
    await AdminService.adminDeleteTeam(teamId)

    revalidatePath(`/admin/dashboard`);

    return NextResponse.json(
      { message: "Team Deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the team.", error: error.message },
      { status: 500 }
    );
  }
}
