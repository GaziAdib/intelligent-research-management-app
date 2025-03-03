import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import UserService from "@/app/services/UserService";

export async function POST(req) {
  try {
    const { username, email, password, profileImageUrl } = await req.json();

    // Check if the user already exists
    const existingUser = await UserService.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { message: "Username or Email Already Exists." },
        { status: 400 } 
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await UserService.createUser(
      username,
      email,
      hashedPassword,
      profileImageUrl
    );

    return NextResponse.json(
      { message: "User Registered", user },
      { status: 201 } 
    );
  } catch (error) {
    console.error("Error while registering:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 } 
    );
  }
}