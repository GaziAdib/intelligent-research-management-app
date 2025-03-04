"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
    const session = useSession()
    const router = useRouter();
  
  
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(loginSchema) });
    
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (data) => {
        setError("");
        setPending(true);
        try {
            const res = await signIn("credentials", {
                email: data?.email,
                password: data?.password,
                redirect: false,
            });
            
            if (res.error) {
                setError("Invalid credentials");
                setPending(false);
                return;
            }

            router.push("/");
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            {...register("password")}
                        />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    <button
                        disabled={pending}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                        type="submit"
                    >
                        {pending ? "Logging in..." : "Log In"}
                    </button>
                    <div className="text-center mt-4">
                        <Link href="/register">
                            <span className="text-blue-600 hover:underline cursor-pointer">Don't have an account? Register</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
