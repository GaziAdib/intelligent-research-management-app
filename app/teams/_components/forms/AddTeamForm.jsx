"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";


// Define Zod schema for form validation
const teamSchema = z.object({
  teamName: z.string().min(3, "Team name is required"),
  teamShortDescription: z.string().min(10, "Description must be at least 10 characters"),
  teamTextColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color code")
    .optional(), 
  teamBgColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color code")
    .optional(), 
});

const AddTeamForm = () => {

  const router = useRouter()

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
  });

  const onSubmit = async (data) => {
    console.log("Form data submitted:", data);
    // Handle form submission (e.g., send data to an API)
      try {
          const res = await fetch("/api/teams/create-team", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
          });
          if (res.ok) {
              // toast.success("Registration successful!");
              router.refresh()
              reset();
              alert('Team Created Successfully')
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
    <div className="max-w-lg mx-auto p-6 mt-8 bg-gray-900 backdrop-blur-md rounded-lg shadow-lg border border-gray-600">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Create a New Team</h2>

      <div className="bg-gray-800 mt-2 mb-4 py-0.5 rounded-xl border-2">
          <h3 className="text-lg text-center text-gray-200">Members</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Team Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Team Name</label>
          <input
            type="text"
            placeholder="Enter team name"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("teamName")}
          />
          {errors.teamName && (
            <p className="text-red-400 text-sm mt-1">{errors.teamName.message}</p>
          )}
        </div>

        {/* Team Description */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Team Description</label>
          <textarea
            placeholder="Enter team description"
            className="w-full p-3 h-28 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("teamShortDescription")}
          />
          {errors.teamShortDescription && (
            <p className="text-red-400 text-sm mt-1">{errors.teamShortDescription.message}</p>
          )}
        </div>

       {/* Text Color and Background Color */}
        <div className="flex gap-6">
          {/* Text Color */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-1">Text Color</label>
            <div className="flex items-center justify-center">
              <input
                type="color"
                className="w-12 h-12 rounded-full cursor-pointer border-6 border-gray-600 hover:ring-2 hover:ring-blue-500 transition-all"
                {...register("teamTextColor")}
              />
            </div>
            {errors.teamTextColor && (
              <p className="text-red-400 text-sm mt-1">{errors.teamTextColor.message}</p>
            )}
          </div>

          {/* Background Color */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-1">Background Color</label>
            <div className="flex items-center justify-center">
              <input
                type="color"
                className="w-12 h-12 rounded-full cursor-pointer border-6 border-gray-600 hover:ring-2 hover:ring-blue-500 transition-all"
                {...register("teamBgColor")}
              />
            </div>
            {errors.teamBgColor && (
              <p className="text-red-400 text-sm mt-1">{errors.teamBgColor.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white font-semibold p-3 rounded-lg transition duration-200"
        >
          Create Team
        </button>
      </form>
    </div>
  );
};

export default AddTeamForm;