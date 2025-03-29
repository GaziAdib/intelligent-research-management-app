import { auth } from "@/app/auth";
import AdminService from "@/app/services/AdminService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req, {params}) {

    const session = await auth()

    const role = session?.user?.role;

    const {notificationIds} = await req.json();

  try {

    if(role !== 'ADMIN') {
        return NextResponse.json(
                { message: "Are Are not Authorized to delete this tasks!" },
                { status: 403 }
                );
            }
    // then delete this task by leader only
    await AdminService.adminDeleteMultipleNotifications(notificationIds)

    revalidatePath(`/admin/dashboard`);

    return NextResponse.json(
      { message: "Notification Deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the notification.", error: error.message },
      { status: 500 }
    );
  }
}
