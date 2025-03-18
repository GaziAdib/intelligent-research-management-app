'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js
import { useSession } from 'next-auth/react';

// Dynamically import RichTextEditor with SSR disabled
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

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData,
  });

  const [loading, setLoading] = useState(false);

  // update task by member
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/member/tasks/modify_task/${initialData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.refresh();
        alert('Task Updated Successfully');
        setLoading(false);
      } else {
        const errorData = await res.json();
        alert(errorData.message);
        setLoading(false);
      }
    } catch (error) {
      alert('Something went wrong!', error.message);
      setLoading(false);
    }
  };

  // member apply for task to be approved 
  const handleRequestForApproval = async (taskId) => {

    console.log('TaskId', taskId)
    try {
      // setLoading(true);
      const res = await fetch(`/api/member/tasks/apply_for_approval/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        router.refresh();
        alert('Task Sent To Pending List Successfully');
        router.push(`/teams/${initialData?.teamId}`)
        // setLoading(false);
      } else {
        const errorData = await res.json();
        alert(errorData.message);
        // setLoading(false);
      }
    } catch (error) {
      alert('Something went wrong!');
      // setLoading(false);
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
        router.refresh();
        router.push(`/teams/${initialData?.teamId}`)
      } else {
        const errorData = await res.json();
        alert(errorData.message);
        setLoading(false);
      }
    } catch (error) {
      alert('Something went wrong!');
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
          router.refresh();
          router.push(`/teams/${initialData?.teamId}`)
        } else {
          const errorData = await res.json();
          alert(errorData.message);
          setLoading(false);
        }
      } catch (error) {
        alert('Something went wrong!');
        setLoading(false);
      }
  
      
    }

  // add remark by leader only 

  const handleAddRemark = async (taskId) => {

    const remarkValue = watch("remarkByLeader"); // Get value
    console.log("Remark:", remarkValue);

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
        router.refresh();
        router.push(`/teams/${initialData?.teamId}`)
      } else {
        const errorData = await res.json();
        alert(errorData.message);
        setLoading(false);
      }
    } catch (error) {
      alert('Something went wrong!');
      setLoading(false);
    }

    
  }

  return (
    <div className="mx-auto w-full p-6 dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Work On Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Task Title */}
        <div className="relative">
          <input
            type="text"
            {...register('taskTitle')}
            placeholder=" "
            className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          />
          <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            Task Title
          </label>
          {errors.taskTitle && <p className="text-red-500 text-sm mt-1">{errors.taskTitle.message}</p>}
        </div>

        {/* Short Description */}
        <div className="relative">
          <textarea
            {...register('taskShortDescription')}
            placeholder=" "
            rows={3}
            className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          />
          <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            Short Description
          </label>
          {errors.taskShortDescription && <p className="text-red-500 text-sm mt-1">{errors.taskShortDescription.message}</p>}
        </div>

        {/* Draft Content */}
        <div className="relative">
          <label className="font-medium  mb-1 text-gray-700 dark:text-gray-200 px-2 py-2">---Draft Content---</label>
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

        {/* Final Content */}
        <div className="relative">
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200 px-2 py-2">---Final Content---</label>
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

        {/* Remark By Leader */}
        <div className="relative">
          <textarea
            {...register('remarkByLeader')}
            placeholder=" "
            rows={3}
            className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          />
          <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            Remark By Leader
          </label>
        </div>

        
          {/* Button to Submit */}
          <button
            type="button"
            onClick={() => handleAddRemark(initialData?.id)}
            className="mt-1 mx-2 mb-7 px-4 py-2 bg-gray-800 border-2 text-white rounded-lg hover:bg-blue-600"
          >
            {loading ? 'Adding Remark' : 'Add Remark'}
          </button>

        {/* AI Generated Text */}
        <div className="relative my-6">
          <textarea
            disabled={initialData?.leaderId === currentUserId}
            {...register('aiGeneratedText')}
            placeholder=" "
            rows={3}
            className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          />
          <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            AI Generated Text
          </label>
        </div>

        {/* AI Generated Code */}
        <div className="relative my-6">
          <textarea
            disabled={initialData?.leaderId === currentUserId}
            {...register('aiGeneratedCode')}
            placeholder=" "
            rows={3}
            className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          />
          <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
            AI Generated Code
          </label>
        </div>

        {/* Priority */}
        <div className="relative">
          <select
            {...register('priority')}
            defaultValue={initialData?.priority || 'MEDIUM'}
            className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75">
            Priority
          </label>
          {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
        </div>

        {/* Status */}
        <div className="relative">
          <select
            {...register('status')}
            defaultValue={initialData?.status || 'Draft'}
            className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75">
            Status
          </label>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
        </div>

        {/* Submit Button */}

        {
          initialData?.leaderId !== currentUserId &&
          <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-white cursor-pointer text-xl text-slate-900 py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Updating...' : 'Update Task'}
          </button>
        </div>
        }
        

        {
      // Check if the current user is not the leader AND the status is not "Approved"
        initialData?.leaderId !== currentUserId && initialData.status !== 'Approved' && (
          <div className="pt-6">
            <button
              type="button"
              onClick={() => handleRequestForApproval(initialData?.id)} // Trigger approval request
              className="w-full bg-white cursor-pointer text-xl text-slate-900 py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {/* Display "Apply For Approval" if status is not "Approved" */}
              {initialData.status !== 'Approved' && 'Apply For Approval'}
            </button>
          </div>
        )
      }

        
        {
            initialData?.leaderId === currentUserId &&
              <div className="pt-6">
                  <button
                    type='button'
                    disabled={initialData?.status === 'Approved' }
                    onClick={() => handleApproveTask(initialData?.id)}
                    className="w-full bg-green-300 cursor-pointer text-xl text-slate-900 py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {initialData.status === 'Pending' || initialData.status === 'Rejected'  || initialData.status === 'Draft' ? 'Approve Task' : 'Task Approved✅' }
                  </button>
             </div>
        }

        {
            initialData?.leaderId === currentUserId && initialData.status !== 'Rejected' &&
              <div className="pt-6">
                  <button
                    type='button'
                    onClick={() => handleRejectTask(initialData?.id)}
                    className="w-full bg-red-400 cursor-pointer text-xl text-slate-900 py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {initialData.status === 'Pending' || initialData.status === 'Approved' &&  'Reject Task' }
                  </button>
             </div>
        }

        



      </form>
    </div>
  );
}












// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useState } from 'react';

// const taskSchema = z.object({
//   taskTitle: z.string().min(3, 'Task title is required'),
//   taskShortDescription: z.string().min(5, 'Short description is required'),
//   taskMemberDraftContent: z.string().optional(),
//   taskMemberFinalContent: z.string().optional(),
//   remarkByLeader: z.string().optional(),
//   aiGeneratedText: z.string().optional(),
//   aiGeneratedCode: z.string().optional(),
//   priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
//   status: z.enum(['Draft', 'InProgress', 'Completed']),
// });

// export default function TaskEditForm({ initialData }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(taskSchema),
//     defaultValues: initialData,
//   });

//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (data) => {
//     console.log(data);
//   };

//   return (
//     <div className="mx-auto w-full p-3 m-3 bg-white dark:bg-gray-950 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Work On Task</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//         {/* Task Title */}
//         <div>
//           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Task Title</label>
//           <input
//             type="text"
//             {...register('taskTitle')}
//             placeholder="Enter task title"
//             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           />
//           {errors.taskTitle && <p className="text-red-500 text-sm">{errors.taskTitle.message}</p>}
//         </div>

//         {/* Short Description */}
//         <div>
//           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Short Description</label>
//           <textarea
//             {...register('taskShortDescription')}
//             placeholder="Short description..."
//             rows={3}
//             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           />
//           {errors.taskShortDescription && <p className="text-red-500 text-sm">{errors.taskShortDescription.message}</p>}
//         </div>

//         {/* Draft Content */}
//         <div>
//           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Draft Content</label>
//           <textarea
//             {...register('taskMemberDraftContent')}
//             placeholder="Draft content..."
//             rows={4}
//             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           />
//         </div>

//         {/* Final Content */}
//         <div>
//           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Final Content</label>
//           <textarea
//             {...register('taskMemberFinalContent')}
//             placeholder="Final content..."
//             rows={4}
//             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           />
//         </div>

//         {/* Remark By Leader */}
//         <div>
//           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Remark By Leader</label>
//           <textarea
//             {...register('remarkByLeader')}
//             placeholder="Leader's remark..."
//             rows={3}
//             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           />
//         </div>

//         {/* AI Generated Text */}
//         <div>
//           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">AI Generated Text</label>
//           <textarea
//             {...register('aiGeneratedText')}
//             placeholder="AI generated text..."
//             rows={3}
//             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           />
//         </div>

//         {/* AI Generated Code */}
//         <div>
//           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">AI Generated Code</label>
//           <textarea
//             {...register('aiGeneratedCode')}
//             placeholder="AI generated code..."
//             rows={3}
//             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           />
//         </div>

//         {/* Priority */}
//         <div>
//           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Priority</label>
//           <select
//             {...register('priority')}
//             defaultValue={initialData?.priority || 'MEDIUM'}
//             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           >
//             <option value="LOW">Low</option>
//             <option value="MEDIUM">Medium</option>
//             <option value="HIGH">High</option>
//           </select>
//           {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Status</label>
//           <select
//             {...register('status')}
//             defaultValue={initialData?.status || 'Draft'}
//             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
//           >
//             <option value="Draft">Draft</option>
//             <option value="InProgress">In Progress</option>
//             <option value="Completed">Completed</option>
//           </select>
//           {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
//         </div>

//         {/* Submit Button */}
//         <div className="pt-4">
//           <button
//             type="submit"
//             disabled={isSubmitting || loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
//           >
//             {loading ? 'Updating...' : 'Update Task'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }






// // 'use client';

// // import { useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { useState } from 'react';

// // const taskSchema = z.object({
// //   taskTitle: z.string().min(3, 'Task title is required'),
// //   taskShortDescription: z.string().min(5, 'Short description is required'),
// //   taskMemberDraftContent: z.string().optional(),
// //   taskMemberFinalContent: z.string().optional(),
// //   remarkByLeader: z.string().optional(),
// //   aiGeneratedText: z.string().optional(),
// //   aiGeneratedCode: z.string().optional(),
// //   priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
// //   status: z.enum(['Draft', 'InProgress', 'Completed']),
// // });

// // export default function TaskEditForm({ initialData }) {
// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors, isSubmitting },
// //   } = useForm({
// //     resolver: zodResolver(taskSchema),
// //     defaultValues: initialData,
// //   });

// //   const [loading, setLoading] = useState(false);

// //   const onSubmit = async (data) => {
// //     console.log(data);
// //   };

// //   return (
// //     <div className="mx-auto w-full p-3 m-3 bg-white dark:bg-gray-950 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
// //       <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Work On Task</h2>
// //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
// //         {/* Task Title */}
// //         <div>
// //           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Task Title</label>
// //           <input
// //             type="text"
// //             {...register('taskTitle')}
// //             placeholder="Enter task title"
// //             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
// //           />
// //           {errors.taskTitle && <p className="text-red-500 text-sm">{errors.taskTitle.message}</p>}
// //         </div>

// //         {/* Short Description */}
// //         <div>
// //           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Short Description</label>
// //           <textarea
// //             {...register('taskShortDescription')}
// //             placeholder="Short description..."
// //             rows={3}
// //             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
// //           />
// //           {errors.taskShortDescription && <p className="text-red-500 text-sm">{errors.taskShortDescription.message}</p>}
// //         </div>

// //         {/* Draft Content */}
// //         <div>
// //           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Draft Content</label>
// //           <textarea
// //             {...register('taskMemberDraftContent')}
// //             placeholder="Draft content..."
// //             rows={4}
// //             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
// //           />
// //         </div>

// //         {/* Final Content */}
// //         <div>
// //           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Final Content</label>
// //           <textarea
// //             {...register('taskMemberFinalContent')}
// //             placeholder="Final content..."
// //             rows={4}
// //             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
// //           />
// //         </div>

// //         {/* Remark By Leader */}
// //         <div>
// //           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Remark By Leader</label>
// //           <textarea
// //             {...register('remarkByLeader')}
// //             placeholder="Leader's remark..."
// //             rows={3}
// //             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
// //           />
// //         </div>

// //         {/* AI Generated Text */}
// //         <div>
// //           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">AI Generated Text</label>
// //           <textarea
// //             {...register('aiGeneratedText')}
// //             placeholder="AI generated text..."
// //             rows={3}
// //             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
// //           />
// //         </div>

// //         {/* AI Generated Code */}
// //         <div>
// //           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">AI Generated Code</label>
// //           <textarea
// //             {...register('aiGeneratedCode')}
// //             placeholder="AI generated code..."
// //             rows={3}
// //             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
// //           />
// //         </div>

// //         {/* Priority */}
// //         <div>
// //           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Priority</label>
// //           <select
// //             {...register('priority')}
// //             defaultValue={initialData?.priority || 'MEDIUM'}
// //             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
// //           >
// //             <option value="LOW">Low</option>
// //             <option value="MEDIUM">Medium</option>
// //             <option value="HIGH">High</option>
// //           </select>
// //           {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
// //         </div>

// //         {/* Status */}
// //         <div>
// //           <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">Status</label>
// //           <select
// //             {...register('status')}
// //             defaultValue={initialData?.status || 'Draft'}
// //             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
// //           >
// //             <option value="Draft">Draft</option>
// //             <option value="InProgress">In Progress</option>
// //             <option value="Completed">Completed</option>
// //           </select>
// //           {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
// //         </div>

// //         {/* Submit Button */}
// //         <div className="pt-4">
// //           <button
// //             type="submit"
// //             disabled={isSubmitting || loading}
// //             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
// //           >
// //             {loading ? 'Updating...' : 'Update Task'}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }


// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// const taskSchema = z.object({
//   taskTitle: z.string().min(3, 'Task title is required'),
//   taskShortDescription: z.string().min(5, 'Short description is required'),
//   taskMemberDraftContent: z.string().optional(),
//   taskMemberFinalContent: z.string().optional(),
//   remarkByLeader: z.string().optional(),
//   aiGeneratedText: z.string().optional(),
//   aiGeneratedCode: z.string().optional(),
//   priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
//   status: z.enum(['Draft', 'InProgress', 'Completed']),
// });

// export default function TaskEditForm({ initialData }) {

// const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting, isLoading },
//   } = useForm({
//     resolver: zodResolver(taskSchema),
//     defaultValues: initialData,
//   });

//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (data) => {
//     console.log("Form data submitted:", data);
//     console.log('Initial Data', initialData)
 
//       try {
//         setLoading(true)
//           const res = await fetch(`/api/member/tasks/modify_task/${initialData?.id}`, {
//               method: "PUT",
//               headers: {
//                   "Content-Type": "application/json",
//               },
//               body: JSON.stringify(data),
//           });
//           if (res.ok) {
//               // toast.success("Registration successful!");
//               router.refresh()
//               alert('Task Updated Successfully')
//               setLoading(false)
//           } else {
//               const errorData = await res.json();
//               alert('Task Update Error!', errorData)
//               setLoading(false)
//               // toast.error(errorData.message);
//           }
//       } catch (error) {
//           alert('Something went wrong!')
//           setLoading(false)
//           // toast.error("Something went wrong");
//       }

//   };

//   return (
//     <div className="mx-auto w-full  p-6  dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-300">
//       <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Work On Task</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Task Title */}
//         <div className="relative">
//           <input
//             type="text"
//             {...register('taskTitle')}
//             placeholder=" "
//             className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
//           />
//           <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
//             Task Title
//           </label>
//           {errors.taskTitle && <p className="text-red-500 text-sm mt-1">{errors.taskTitle.message}</p>}
//         </div>

//         {/* Short Description */}
//         <div className="relative">
//           <textarea
//             {...register('taskShortDescription')}
//             placeholder=" "
//             rows={3}
//             className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
//           />
//           <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
//             Short Description
//           </label>
//           {errors.taskShortDescription && <p className="text-red-500 text-sm mt-1">{errors.taskShortDescription.message}</p>}
//         </div>

//         {/* Draft Content */}
//         <div className="relative">
//           <textarea
//             {...register('taskMemberDraftContent')}
//             placeholder=" "
//             rows={4}
//             className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
//           />
//           <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
//             Draft Content
//           </label>
//         </div>

//         {/* Final Content */}
//         <div className="relative">
//           <textarea
//             {...register('taskMemberFinalContent')}
//             placeholder=" "
//             rows={4}
//             className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
//           />
//           <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
//             Final Content
//           </label>
//         </div>

//         {/* Remark By Leader */}
//         <div className="relative">
//           <textarea
//             {...register('remarkByLeader')}
//             placeholder=" "
//             rows={3}
//             className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
//           />
//           <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
//             Remark By Leader
//           </label>
//         </div>

//         {/* AI Generated Text */}
//         <div className="relative">
//           <textarea
//             {...register('aiGeneratedText')}
//             placeholder=" "
//             rows={3}
//             className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
//           />
//           <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
//             AI Generated Text
//           </label>
//         </div>

//         {/* AI Generated Code */}
//         <div className="relative">
//           <textarea
//             {...register('aiGeneratedCode')}
//             placeholder=" "
//             rows={3}
//             className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
//           />
//           <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2">
//             AI Generated Code
//           </label>
//         </div>

//         {/* Priority */}
//         <div className="relative">
//           <select
//             {...register('priority')}
//             defaultValue={initialData?.priority || 'MEDIUM'}
//             className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
//           >
//             <option value="LOW">Low</option>
//             <option value="MEDIUM">Medium</option>
//             <option value="HIGH">High</option>
//           </select>
//           <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75">
//             Priority
//           </label>
//           {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
//         </div>

//         {/* Status */}
//         <div className="relative">
//           <select
//             {...register('status')}
//             defaultValue={initialData?.status || 'Draft'}
//             className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
//           >
//             <option value="Draft">Draft</option>
//             <option value="InProgress">In Progress</option>
//             <option value="Completed">Completed</option>
//           </select>
//           <label className="absolute left-4 top-3 px-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-6 scale-75 peer-focus:-translate-y-6 peer-focus:scale-75">
//             Status
//           </label>
//           {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
//         </div>

//         {/* Submit Button */}
//         <div className="pt-6">
//           <button
//             type="submit"
//             disabled={isSubmitting || loading}
//             className="w-full bg-white cursor-pointer text-xl text-slate-900 py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
//           >
//             {loading ? 'Updating...' : 'Update Task'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }