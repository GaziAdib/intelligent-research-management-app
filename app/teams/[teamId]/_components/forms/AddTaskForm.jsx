import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

const taskSchema = z.object({
  taskTitle: z.string().min(3, "Task title is required"),
  taskShortDescription: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  taskBgColor: z.string().optional(),
  taskTextColor: z.string().optional(),
});


const AddTaskForm = ({teamInfo, onSuccess}) => {

const router = useRouter();


const teamId = teamInfo?.id
const leaderId = teamInfo?.leaderId

const [loading, setLoading] = useState(false)


  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/leader/tasks/add-task/${teamId}/${leaderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Task Created Successfully")
        router.refresh();
        reset();
        onSuccess();
        setLoading(false)
      } else {
        const errData = await res.json()
        toast.error(errData.message)
      }
    } catch (error) {
      toast.error("Something went wrong while adding a new task!")
    } finally {
      setLoading(false)
    }

  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-8 bg-gray-900 backdrop-blur-md rounded-lg shadow-lg border border-gray-600">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Create a New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Task Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("taskTitle")}
          />
          {errors.taskTitle && <p className="text-red-400 text-sm mt-1">{errors.taskTitle.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-1">Task Description</label>
          <textarea
            placeholder="Enter task description"
            className="w-full p-3 h-28 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("taskShortDescription")}
          />
          {errors.taskShortDescription && <p className="text-red-400 text-sm mt-1">{errors.taskShortDescription.message}</p>}
        </div>


        <div>
          <label className="block text-sm font-medium text-white mb-1">Task Priority</label>
          <select
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("priority")}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-1">Task Background Color</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg cursor-pointer border-2 border-gray-600"
              {...register("taskBgColor")}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-1">Task Text Color</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg cursor-pointer border-2 border-gray-600"
              {...register("taskTextColor")}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white font-semibold p-3 rounded-lg transition duration-200"
        >
          {loading ? 'Creating Task...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;