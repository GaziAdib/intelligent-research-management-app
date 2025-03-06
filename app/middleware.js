import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';


export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Define public and protected routes
    const publicRoutes = ['/login', '/register'];
    const protectedRoutes = ['/', '/admin', '/profile', '/settings']; // Add more protected routes

    if (publicRoutes.includes(pathname)) {
        // If the user is logged in and tries to access public routes, redirect them to the dashboard
        if (token) {
            return NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.next();
    }

    if (protectedRoutes.includes(pathname)) {
        // If the user is NOT logged in and tries to access protected routes, redirect to login
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

// Apply middleware only for matching routes
export const config = {
    matcher: ['/', '/admin', '/settings', '/login', '/register'],
};











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