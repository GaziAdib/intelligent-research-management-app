// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { compare } from "bcrypt";
// import  { permissions } from '../../../libs/permissions'
// import UserService from "@/app/services/UserService";


// export const authOptions = {

//     session: {
//         strategy: 'jwt'
//     },
//     providers: [
//         CredentialsProvider({
//             name: 'credentials',
//             credentials: {
//                 email: { label: "email", type: "email" },
//                 password: { label: "password", type: "password" }
//             },
//             async authorize(credentials, req) {

//                 // Add logic here to look up the user from the credentials

//                 if (!credentials.email || !credentials.password) {
//                     return null;
//                 }

//                 // user in DB

//                 const user = await UserService.findUniqueUserByEmail(
//                     credentials.email
//                 )


//                 if (!user) {
//                     return null;
//                 }

//                 const isPasswordValid = await compare(credentials.password, user.password);

//                 if (!isPasswordValid) {
//                     return null;
//                 }

//                 return {
//                     id: user.id,
//                     email: user?.email,
//                     username: user?.username,
//                     role: user?.role
//                 }

//             }
//         }),
//     ],

//     callbacks: {

//         async session({ session, token }) {
//             if (session.user) {
//                 session.user.id = token.id;
//                 session.user.email = token.email;
//                 session.user.username = token.username;
//                 session.user.role = token.role;
//                 session.user.permissions = permissions[token.role] || [];
//             }
//             return session;
//         },

//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//                 token.email = user.email;
//                 token.username = user.username;
//                 token.role = user.role;
//             }
//             return token;
//         }
//     },

//     pages: {
//         signIn: '/login'
//     },
//     debug: process.env.NODE_ENV === 'development',
//     secret: process.env.NEXTAUTH_SECRET
// }


// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST }


import { handlers } from "@/app/auth";

export const {GET, POST} = handlers;

