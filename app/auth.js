import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import UserService from "./services/UserService";
import { compare } from "bcrypt";
import { permissions } from "./libs/permissions";

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: {
      strategy: 'jwt',
    },
    providers: [
            CredentialsProvider({
                name: 'credentials',
                credentials: {
                    email: { label: "email", type: "email" },
                    password: { label: "password", type: "password" }
                },
                async authorize(credentials, req) {
    
                    // Add logic here to look up the user from the credentials
    
                    if (!credentials.email || !credentials.password) {
                        return null;
                    }
    
                    // user in DB
    
                    const user = await UserService.findUniqueUserByEmail(
                        credentials?.email
                    )
    
    
                    if (!user) {
                        return null;
                    }
    
                    const isPasswordValid = await compare(credentials.password, user.password);
    
                    if (!isPasswordValid) {
                        return null;
                    }
    
                   // Return user object
                        return {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            role: user.role
                        };
            
                }
            }),
        ],
    
     callbacks: {
    
            async session({ session, token }) {
                if (session.user) {
                    session.user.id = token.id;
                    session.user.email = token.email;
                    session.user.username = token.username;
                    session.user.role = token.role;
                    session.user.permissions = permissions[token.role] || [];
                }
    
            
                return session;
            },
    
            async jwt({ token, user }) {
                if (user) {
                    token.id = user.id;
                    token.email = user.email;
                    token.username = user.username;
                    token.role = user.role;
                }
    
                // Debugging: Log final token
                console.log("Final token:", token);
    
                return token;
            }
        },
    pages: {
        signIn: '/login'
    },
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET
});




// import NextAuth from "next-auth";

// import CredentialsProvider from "next-auth/providers/credentialss";

// import UserService from "./services/UserService";
// import { compare } from "bcrypt";

// export const {
//     handlers,
//     auth,
//     signIn,
//     signOut,
// } = NextAuth({
//     session: {
//       strategy: 'jwt',
//     },
//     providers: [
//             CredentialsProvider({
//                 name: 'credentials',
//                 credentials: {
//                     email: { label: "email", type: "email" },
//                     password: { label: "password", type: "password" }
//                 },
//                 async authorize(credentials, req) {
    
//                     // Add logic here to look up the user from the credentials
    
//                     if (!credentials.email || !credentials.password) {
//                         return null;
//                     }
    
//                     // user in DB
    
//                     const user = await UserService.findUniqueUserByEmail(
//                         credentials.email
//                     )
    
    
//                     if (!user) {
//                         return null;
//                     }
    
//                     const isPasswordValid = await compare(credentials.password, user.password);
    
//                     if (!isPasswordValid) {
//                         return null;
//                     }
    
//                     return {
//                         id: user.id,
//                         email: user?.email,
//                         username: user?.username,
//                         role: user?.role
//                     }
    
//                 }
//             }),
//         ],
    
//      callbacks: {
    
//             async session({ session, token }) {
//                 if (session.user) {
//                     session.user.id = token.id;
//                     session.user.email = token.email;
//                     session.user.username = token.username;
//                     session.user.role = token.role;
//                     session.user.permissions = permissions[token.role] || [];
//                 }
//                 return session;
//             },
    
//             async jwt({ token, user }) {
//                 if (user) {
//                     token.id = user.id;
//                     token.email = user.email;
//                     token.username = user.username;
//                     token.role = user.role;
//                 }
//                 return token;
//             }
//         },
//     pages: {
//         signIn: '/login'
//     },
//     debug: process.env.NODE_ENV === 'development',
//     secret: process.env.NEXTAUTH_SECRET
// });



// export const {
//     handlers: { GET, POST },
//     auth,
//     signIn,
//     signOut,
// } = NextAuth({
//     session: {
//       strategy: 'jwt',
//     },
//     providers: [
//         CredentialsProvider({
//             credentials: {
//                 email: {},
//                 password: {},
//             },
//             async authorize(credentials) {
//                 if (credentials === null) return null;
//                 try {
//                     const user = getUserByEmail(credentials?.email);
//                     console.log(user);
//                     if (user) {
//                         const isMatch = user?.password === credentials.password;

//                         if (isMatch) {
//                             return user;
//                         } else {
//                             throw new Error("Email or Password is not correct");
//                         }
//                     } else {
//                         throw new Error("User not found");
//                     }
//                 } catch (error) {
//                     throw new Error(error);
//                 }
//             },
//         })
//     ],
    
//     pages: {
//         signIn: '/login'
//     }
// });

