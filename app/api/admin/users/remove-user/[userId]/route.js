import { auth } from "@/app/auth";
import AdminService from "@/app/services/AdminService";
import TaskService from "@/app/services/TaskService";
import UserService from "@/app/services/UserService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { use } from "react";

export async function DELETE(req, {params}) {

    const session = await auth()

    const role = session?.user?.role

    const { userId } = await params


  try {

    const user = await UserService.findUserById(userId)

    if(role !== 'ADMIN') {
        return NextResponse.json(
            { message: "Are Are not Authorized to remove this user!" },
            { status: 403 }
          );
    } 
    
    if(!userId) {
        return NextResponse.json(
            { message: "User Not Found!" },
            { status: 404 }
          );
    }

    await AdminService.adminRemoveUser(userId);

    revalidatePath(`/admin/dashboard`);

    return NextResponse.json(
      { message: "User Deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the user.", error: error.message },
      { status: 500 }
    );
  }
}
