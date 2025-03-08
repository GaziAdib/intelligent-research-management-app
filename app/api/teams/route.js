// import TeamService from "@/app/services/TeamService";
// import { NextResponse } from "next/server";

// export async function GET(req) {

//   try {
   
//     // Fetch teams based on the user's role and ID
//     let teams;
//     if (userRole === "ADMIN") {
//       // Admins can see all teams
//       teams = await TeamService.fetchAllTeams();
//     } else {
//       // Regular users can only see teams they are members of
//       teams = await TeamService.fetchTeamsByUserId(userId);
//     }

//     // Debugging: Check the fetched teams
//     console.log("Teams:", teams);

//     // Return the filtered teams
//     return NextResponse.json({ data: teams }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching teams data:", error);
//     return NextResponse.json(
//       { message: "An error occurred while fetching teams data." },
//       { status: 500 }
//     );
//   }
// }