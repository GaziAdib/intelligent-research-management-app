'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const RichTextEditor = dynamic(() => import('../textEditor/RichTextEditor'), {
  ssr: false,
});

const taskSchema = z.object({
  taskTitle: z.string().min(3, 'Task title is required'),
  taskShortDescription: z.string().min(5, 'Short description is required'),
  taskMemberDraftContent: z.string().optional(),
  taskMemberFinalContent: z.string().optional(),
  remarkByLeader: z.string().optional(),
  aiGeneratedText: z.string().optional(),
  aiGeneratedCode: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['Draft', 'Pending', 'Approved', 'Rejected']),
});

export default function TaskEditForm({ initialData }) {
  const router = useRouter();
  const session = useSession();
  const currentUserId = session?.data?.user?.id;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData,
  });

 

  const onSubmit = async (data) => {
    if (!initialData?.id) {
      toast.error('Invalid Task ID');
      return;
    }
    
    try {
      setLoading(true);
      

      const res = await fetch(`/api/member/tasks/modify_task/${initialData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const responseData = await res.json();
  
      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to update task');
      }
  
      toast.success('Task Updated Successfully');
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'Something went wrong while updating the task!');
    } finally {
      setLoading(false);
    }
  };



  // member apply for task to be approved 
  const handleRequestForApproval = async (taskId) => {
    try {
      const res = await fetch(`/api/member/tasks/apply_for_approval/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        router.refresh();
        toast.success('Task Sent To Pending List Successfully');
        router.push(`/teams/${initialData?.teamId}`)
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Faile to sent task to Pending list!');
      }
    } catch (error) {
      toast.error('Something went wrong while adding task to pending list!');
    }
  }


  // approve task by leader only
  const handleApproveTask = async (taskId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leader/tasks/approve-task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        setLoading(false);
        toast.success('Task Approved!')
        router.refresh();
        router.push(`/teams/${initialData?.teamId}`)
      } else {
        const errorData = await res.json();
        toast.error(errorData.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error('Something went wrong!');
      setLoading(false);
    }
  }

  // reject task by leader only
  const handleRejectTask = async (taskId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leader/tasks/reject-task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        setLoading(false);
        toast.success('Task Rejected!')
        router.refresh();
        router.push(`/teams/${initialData?.teamId}`)
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Error Rejcting task!');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Something went wrong while rejecting task!');
      setLoading(false);
    }
  }

  // add remark by leader only 
  const handleAddRemark = async (taskId) => {
    const remarkValue = watch("remarkByLeader");
    try {
      setLoading(true);
      const res = await fetch(`/api/leader/tasks/add-remark/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({remarkByLeader: remarkValue})
      });
      if (res.ok) {
        setLoading(false);
        toast.success('Added Remark To Task!')
        router.refresh();
        router.push(`/teams/${initialData?.teamId}`)
      } else {
        const errorData = await res.json();
        toast.error(errorData.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error('Something went wrong!');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full  p-4 md:p-6 lg:p-8 dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Work On Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        {/* Task Title */}
        <div className="relative">
          <input
            type="text"
            disabled={true}
            {...register('taskTitle')}
            placeholder=" "
            className="w-full px-4 py-2 md:py-3 text-sm md:text-base bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg cursor-not-allowed opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          />
          <label className="absolute left-4 top-2 md:top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm md:text-base transition-all duration-200 transform -translate-y-5 md:-translate-y-6 scale-75 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-5 md:peer-focus:-translate-y-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            Task Title
          </label>
          {errors.taskTitle && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.taskTitle.message}</p>}
        </div>

        {/* Short Description */}
        <div className="relative">
          <textarea
            {...register('taskShortDescription')}
            disabled={true}
            placeholder=" "
            rows={3}
            className="w-full px-4 py-2 md:py-3 text-sm md:text-base cursor-not-allowed opacity-80 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          />
          <label className="absolute left-4 top-2 md:top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm md:text-base transition-all duration-200 transform -translate-y-5 md:-translate-y-6 scale-75 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-5 md:peer-focus:-translate-y-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            Short Description
          </label>
          {errors.taskShortDescription && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.taskShortDescription.message}</p>}
        </div>

        {/* Draft Content */}
        <div className="relative">
          <label className="block font-medium mb-1 text-sm md:text-base text-gray-700 dark:text-gray-200 px-1 py-1">---Draft Content---</label>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <Controller
              name="taskMemberDraftContent"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  readOnly={initialData?.leaderId === currentUserId}
                  placeholder="Enter draft content..."
                />
              )}
            />
          </div>
        </div>

        {/* Final Content */}
        <div className="relative">
          <label className="block font-medium mb-1 text-sm md:text-base text-gray-700 dark:text-gray-200 px-1 py-1">---Final Content---</label>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <Controller
              name="taskMemberFinalContent"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  readOnly={initialData?.leaderId === currentUserId}
                  onChange={field.onChange}
                  placeholder="Enter final content..."
                />
              )}
            />
          </div>
        </div>

        {/* Remark By Leader */}
        <div className="relative">
          

          <textarea
            {...register('remarkByLeader')}
            placeholder=""
            rows={3}
            className={`w-full px-4 py-2 md:py-3 text-sm md:text-base bg-transparent text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer
              ${initialData?.leaderId !== currentUserId ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-80' : ''}`}
          />
          <label className="absolute  left-4 top-2 md:top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm md:text-base transition-all duration-200 transform -translate-y-5 md:-translate-y-6 scale-75 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-5 md:peer-focus:-translate-y-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            Remark By Leader
          </label>
        </div>


        {/* Button to Submit Remark */}
        {
          initialData.leaderId === currentUserId &&
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => handleAddRemark(initialData?.id)}
              className="px-4 py-2 text-sm md:text-base bg-gray-800 border-2 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              {loading ? 'Adding Remark...' : 'Add Remark'}
            </button>
        </div>
        }

        {/* AI Generated Text */}
        <div className="relative">
          <textarea
            disabled={initialData?.leaderId === currentUserId}
            {...register('aiGeneratedText')}
            placeholder=" "
            rows={3}
            className="w-full px-4 py-2 md:py-3 text-sm md:text-base bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          />
          <label className="absolute left-4 top-2 md:top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm md:text-base transition-all duration-200 transform -translate-y-5 md:-translate-y-6 scale-75 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-5 md:peer-focus:-translate-y-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            AI Generated Text
          </label>
        </div>

        {/* AI Generated Code */}
        <div className="relative">
          <textarea
            disabled={initialData?.leaderId === currentUserId}
            {...register('aiGeneratedCode')}
            placeholder=" "
            rows={3}
            className="w-full px-4 py-2 md:py-3 text-sm md:text-base bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          />
          <label className="absolute left-4 top-2 md:top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm md:text-base transition-all duration-200 transform -translate-y-5 md:-translate-y-6 scale-75 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-5 md:peer-focus:-translate-y-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            AI Generated Code
          </label>
        </div>

        {/* Priority */}
        <div className="relative">
          <select
            {...register('priority')}
            disabled={true}
            defaultValue={initialData?.priority || 'MEDIUM'}
            className="w-full px-4 py-2 md:py-3 text-sm md:text-base bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <label className="absolute left-4 top-2 md:top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm md:text-base transition-all duration-200 transform -translate-y-5 md:-translate-y-6 scale-75 origin-[0]">
            Priority
          </label>
          {errors.priority && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.priority.message}</p>}
        </div>

        {/* Status */}
        <div className="relative">
          <select
          disabled={true}
            {...register('status')}
            defaultValue={initialData?.status || 'Draft'}
            className="w-full px-4 py-2 md:py-3 text-sm md:text-base bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <label className="absolute left-4 top-2 md:top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm md:text-base transition-all duration-200 transform -translate-y-5 md:-translate-y-6 scale-75 origin-[0]">
            Status
          </label>
          {errors.status && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.status.message}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 pt-4">
          {initialData?.leaderId !== currentUserId && (
           <button
           type="submit"
           disabled={loading || !initialData?.taskAssignedTo?.includes(currentUserId)}
           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition-all"
         >
           {loading ? 'Updating...' : 'Update Task'}
         </button>
          )}

          {initialData?.leaderId !== currentUserId && initialData.taskAssignedTo.includes(currentUserId) && initialData.status !== 'Approved' && (
            <button
              type="button"
              onClick={() => handleRequestForApproval(initialData?.id)}
              className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer text-white text-sm md:text-base py-2 px-4 md:py-3 md:px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {initialData.status !== 'Approved' && 'Apply For Approval'}
            </button>
          )}

          {initialData?.leaderId === currentUserId && (
            <button
              type='button'
              disabled={initialData?.status === 'Approved'}
              onClick={() => handleApproveTask(initialData?.id)}
              className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white text-sm md:text-base py-2 px-4 md:py-3 md:px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {initialData.status === 'Pending' || initialData.status === 'Rejected' || initialData.status === 'Draft' ? 'Approve Task' : 'Task Approved✅'}
            </button>
          )}

          {initialData?.leaderId === currentUserId && initialData.status === 'Rejected' && (
            <button
              type='button'
              onClick={() => handleRejectTask(initialData?.id)}
              className="w-full bg-red-600 hover:bg-red-700 cursor-pointer text-white text-sm md:text-base py-2 px-4 md:py-3 md:px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {initialData.status === 'Pending' || initialData.status === 'Approved' && 'Reject Task'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}





