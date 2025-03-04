// import { auth } from "@/auth"; // Import the auth function from your auth setup
// import { NextResponse } from "next/server";

// // Define public routes
// const PUBLIC_ROUTES = ["/login", "/register"];

// // Define protected routes
// const PROTECTED_ROUTES = ["/"];

// export default auth(async (req) => {
//   const { pathname } = req.nextUrl;

//   // Check if the route is public
//   const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

//   // Check if the route is protected
//   const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);

//   // Get the session
//   const session = await auth();

//   // Handle public routes
//   if (isPublicRoute) {
//     if (session) {
//       // If the user is authenticated, redirect them to the home page
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//     // If the user is not authenticated, allow access to the public route
//     return NextResponse.next();
//   }

//   // Handle protected routes
//   if (isProtectedRoute) {
//     if (!session) {
//       // If the user is not authenticated, redirect them to the login page
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     // If the user is authenticated, allow access to the protected route
//     return NextResponse.next();
//   }

//   // For all other routes, allow access by default
//   return NextResponse.next();
// });

// // Apply middleware to specific routes
// export const config = {
//   matcher: ["/", "/login", "/register"], // Apply middleware only to these routes
// };