"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import { Toaster, toast } from "sonner";

const registerSchema = z.object({
    profileImageUrl: z.string().url("Invalid URL format"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterPage = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                reset();
                alert('Registration successful!')
                // toast.success("Registration successful!");
                router.push("/auth/login");
            } else {
                const errorData = await res.json();
                alert('Registration Error!')
                // toast.error(errorData.message);
            }
        } catch (error) {
            alert('Something went wrong!')
            // toast.error("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4">
            {/* <Toaster position="top-right" /> */}
            <form 
                className="bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-2xl px-6 py-8 w-full max-w-md" 
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Register</h2>
                
                <div className="mb-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">Profile Image URL</label>
                    <input 
                        className="shadow border rounded w-full py-2 px-3 bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        type="text" 
                        placeholder="https://example.com/image.jpg" 
                        {...register("profileImageUrl")} 
                    />
                    {errors.profileImageUrl && <span className="text-red-500 text-sm">{errors.profileImageUrl.message}</span>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">Username</label>
                    <input 
                        className="shadow border rounded w-full py-2 px-3 bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        type="text" 
                        placeholder="Username" 
                        {...register("username")} 
                    />
                    {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">Email</label>
                    <input 
                        className="shadow border rounded w-full py-2 px-3 bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        type="email" 
                        placeholder="Email" 
                        {...register("email")} 
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
              
                <div className="mb-6">
                    <label className="block text-gray-900 text-sm font-bold mb-2">Password</label>
                    <input 
                        className="shadow border rounded w-full py-2 px-3 bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        type="password" 
                        placeholder="********" 
                        {...register("password")} 
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>

                <div className="flex flex-col items-center">
                    <button
                        disabled={isSubmitting}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300"
                        type="submit"
                    >
                        {isSubmitting ? 'Registering...' : 'Sign Up'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
