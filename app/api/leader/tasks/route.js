
// import { auth } from "@/app/auth";
// import TaskService from "@/app/services/TaskService";
// import UserService from "@/app/services/UserService";
// import { NextResponse } from "next/server";

// export async function GET(req, {params}) {

//     const teamId = await params?.teamId || "";

//   try {

//      const session = await auth()

//      const currentUserId = session?.user?.id

     

//     // if (!userId) {
//     //   return NextResponse.json(
//     //     { message: "Unauthorized access." },
//     //     { status: 401 }
//     //   );
//     // }

//     const tasks = await TaskService.fetchTasks(teamId)

//     console.log('Tasks', tasks)
    
//     return NextResponse.json({data:users}, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching users data:", error);
//     return NextResponse.json(
//       { message: "An error occurred while fetching users data." },
//       { status: 500 }
//     );
//   }
// }
