import { auth } from "@/app/auth";
import AdminService from "@/app/services/AdminService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(req, {params}) {

    const session = await auth()

    const role = session?.user?.role;

    const { conversationId } = await params;

  try {

    if(role !== 'ADMIN') {
        return NextResponse.json(
                { message: "Are Are not Authorized to delete this tasks!" },
                { status: 403 }
                );
            }
    // then delete this conversation by leader only
    await AdminService.adminDeleteConversation(conversationId)

    revalidatePath(`/admin/dashboard`);

    return NextResponse.json(
      { message: "Conversation Deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the conversation.", error: error.message },
      { status: 500 }
    );
  }
}
