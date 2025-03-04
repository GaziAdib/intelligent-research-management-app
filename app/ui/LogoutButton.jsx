"use client"; // Mark this as a client component

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Import useEffect

const LogoutButton = ({ label, color }) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect to login if there's no session
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]); // Add session and router as dependencies

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // Redirect to login page after logout
  };

  return (
    <button
      style={{ backgroundColor: color }} // Use inline styles for dynamic colors
      onClick={handleLogout}
      className="text-white mx-2 border-2 py-2 px-4 rounded-md hover:opacity-80 focus:outline-none focus:ring focus:border-blue-300"
    >
      {label}
    </button>
  );
};

export default LogoutButton;