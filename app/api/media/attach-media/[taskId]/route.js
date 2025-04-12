import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import cloudinary from "@/app/libs/cloudinary";

//Disable default body parsing (needed for FormData)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req, { params }) {

  const { taskId } = await params; // Destructure taskId directly from params

  try {
 
    const session = await auth();
    const currentUserId = session?.user?.id;

    const task = await TaskService.fetchTaskById(taskId);

    if (!task) {
      return NextResponse.json(
        { message: "Task not found." },
        { status: 404 }
      );
    }

    // Permission checks
    if (!task.taskAssignedTo.includes(currentUserId)) {
      return NextResponse.json(
        { message: "You are not allowed to upload Media!" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const filess = formData.getAll('files'); // Use getAll to get multiple files

    if (!filess || filess?.length === 0) {
      return NextResponse.json(
        { message: 'No files provided.' },
        { status: 400 }
      );
    }

    // Convert files to Buffers
    const fileBuffers = await Promise.all(
        filess.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return new Uint8Array(arrayBuffer);
        })
      );

        // Upload files to Cloudinary
    let uploadResults = await Promise.all(
        fileBuffers.map((buffer) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'task-references', // Folder in Cloudinary
                resource_type: 'auto', // Automatically detect resource type (image, video, etc.)
              },
              (error, result) => {
                if (error) {
                  reject(error);
                  return;
                }
                resolve({
                  url: result?.secure_url,
                  type: result?.resource_type === 'image' ? 'IMAGE' : 'PDF', // Map to ReferenceType
                  public_id: result?.public_id, // Optional: Store this for deletion later if needed
                });
              }
            ).end(buffer);
          });
        })
      );
  
      // console.log('Cloudinary upload results:',  uploadResults);

    //   {
    //     "message": "Files uploaded successfully!",
    //     "data": [
    //         {
    //             "url": "https://res.cloudinary.com/dszqr2uc9/image/upload/v1741982168/task-references/mbxl2oef18olybeprwdy.jpg",
    //             "type": "IMAGE",
    //             "public_id": "task-references/mbxl2oef18olybeprwdy"
    //         }
    //     ]
    // }

    //   return NextResponse.json(
    //     { message: 'Files uploaded successfully!', data: uploadResults },
    //     { status: 201 }
    //   );

 

    // Fetch task by ID to verify user permissions
    

    // if (task?.leaderId === currentUserId) {
    //   return NextResponse.json(
    //     { message: "Leader cannot apply for task approval." },
    //     { status: 403 }
    //   );
    // }

    // Upload files to Cloudinary via MediaService
    //  uploadResults.data is an arrays 
    // "data": [
    //     {
    //         "url": "https://res.cloudinary.com/dszqr2uc9/image/upload/v1741982331/task-references/i23jee0gxjdadbn9xsw2.pdf",
    //         "type": "IMAGE",
    //         "public_id": "task-references/i23jee0gxjdadbn9xsw2"
    //     },
    //     {
    //         "url": "https://res.cloudinary.com/dszqr2uc9/image/upload/v1741982333/task-references/brfzly9m72pygkkpmb3s.pdf",
    //         "type": "IMAGE",
    //         "public_id": "task-references/brfzly9m72pygkkpmb3s"
    //     }
    // ]
    //const uploadedMedia = await MediaService.addMedia(uploadResults.data);

    // console.log('Uploaded Medias:', uploadedMedia);

    // // Attach uploaded media as Task References
    // const mediaUrls = uploadedMedia.map((media) => media?.secure_url); // Extract URLs from uploaded media
    // const publicIds = uploadedMedia.map((media) => media?.public_id); // Extract public IDs from uploaded media

    let mediaUrls = uploadResults?.map((result) => result?.url);
    let publicIds = uploadResults?.map((result) => result?.public_id);
    let mediaType = 'PDF'

    // console.log('medias', mediaUrls)
    // console.log('publicids', publicIds)

    const attachedTaskReference = await TaskService.attachTaskReference(
      currentUserId,
      taskId,
      mediaType,
      mediaUrls,
      publicIds
    );

    // Revalidate Path for frontend update
    const teamId = task?.teamId;
    revalidatePath(`/tasks/edit-panel/${taskId}/${teamId}`);

    return NextResponse.json(
      { message: "Media attached to task successfully!", data: attachedTaskReference },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while attaching media to task:", error);
    return NextResponse.json(
      { message: "An error occurred while applying media to task.", error: error?.message },
      { status: 500 }
    );
  }
}











// import { auth } from "@/app/auth";
// import TaskService from "@/app/services/TaskService";
// import { revalidatePath } from "next/cache";
// import { NextResponse } from "next/server";

// import cloudinary from "@/app/libs/cloudinary";

// //Disable default body parsing (needed for FormData)
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req, { params }) {

//   const { taskId } = await params; // Destructure taskId directly from params

//   try {
 
//     const session = await auth();
//     const currentUserId = session?.user?.id;

//     const formData = await req.formData();
//     const filess = formData.getAll('files'); // Use getAll to get multiple files

//     if (!filess || filess?.length === 0) {
//       return NextResponse.json(
//         { message: 'No files provided.' },
//         { status: 400 }
//       );
//     }

//     // Convert files to Buffers
//     const fileBuffers = await Promise.all(
//         filess.map(async (file) => {
//           const arrayBuffer = await file.arrayBuffer();
//           return new Uint8Array(arrayBuffer);
//         })
//       );

//         // Upload files to Cloudinary
//     let uploadResults = await Promise.all(
//         fileBuffers.map((buffer) => {
//           return new Promise((resolve, reject) => {
//             cloudinary.uploader.upload_stream(
//               {
//                 folder: 'task-references', // Folder in Cloudinary
//                 resource_type: 'auto', // Automatically detect resource type (image, video, etc.)
//               },
//               (error, result) => {
//                 if (error) {
//                   reject(error);
//                   return;
//                 }
//                 resolve({
//                   url: result?.secure_url,
//                   type: result?.resource_type === 'image' ? 'IMAGE' : 'PDF', // Map to ReferenceType
//                   public_id: result?.public_id, // Optional: Store this for deletion later if needed
//                 });
//               }
//             ).end(buffer);
//           });
//         })
//       );
  
//       // console.log('Cloudinary upload results:',  uploadResults);

//     //   {
//     //     "message": "Files uploaded successfully!",
//     //     "data": [
//     //         {
//     //             "url": "https://res.cloudinary.com/dszqr2uc9/image/upload/v1741982168/task-references/mbxl2oef18olybeprwdy.jpg",
//     //             "type": "IMAGE",
//     //             "public_id": "task-references/mbxl2oef18olybeprwdy"
//     //         }
//     //     ]
//     // }

//     //   return NextResponse.json(
//     //     { message: 'Files uploaded successfully!', data: uploadResults },
//     //     { status: 201 }
//     //   );

 

//     // Fetch task by ID to verify user permissions
//     const task = await TaskService.fetchTaskById(taskId);

//     if (!task) {
//       return NextResponse.json(
//         { message: "Task not found." },
//         { status: 404 }
//       );
//     }

//     // Permission checks
//     if (!task.taskAssignedTo.includes(currentUserId)) {
//       return NextResponse.json(
//         { message: "You are not allowed to upload Media!" },
//         { status: 403 }
//       );
//     }

//     // if (task?.leaderId === currentUserId) {
//     //   return NextResponse.json(
//     //     { message: "Leader cannot apply for task approval." },
//     //     { status: 403 }
//     //   );
//     // }

//     // Upload files to Cloudinary via MediaService
//     //  uploadResults.data is an arrays 
//     // "data": [
//     //     {
//     //         "url": "https://res.cloudinary.com/dszqr2uc9/image/upload/v1741982331/task-references/i23jee0gxjdadbn9xsw2.pdf",
//     //         "type": "IMAGE",
//     //         "public_id": "task-references/i23jee0gxjdadbn9xsw2"
//     //     },
//     //     {
//     //         "url": "https://res.cloudinary.com/dszqr2uc9/image/upload/v1741982333/task-references/brfzly9m72pygkkpmb3s.pdf",
//     //         "type": "IMAGE",
//     //         "public_id": "task-references/brfzly9m72pygkkpmb3s"
//     //     }
//     // ]
//     //const uploadedMedia = await MediaService.addMedia(uploadResults.data);

//     // console.log('Uploaded Medias:', uploadedMedia);

//     // // Attach uploaded media as Task References
//     // const mediaUrls = uploadedMedia.map((media) => media?.secure_url); // Extract URLs from uploaded media
//     // const publicIds = uploadedMedia.map((media) => media?.public_id); // Extract public IDs from uploaded media

//     let mediaUrls = uploadResults?.map((result) => result?.url);
//     let publicIds = uploadResults?.map((result) => result?.public_id);
//     let mediaType = 'PDF'

//     // console.log('medias', mediaUrls)
//     // console.log('publicids', publicIds)

//     const attachedTaskReference = await TaskService.attachTaskReference(
//       currentUserId,
//       taskId,
//       mediaType,
//       mediaUrls,
//       publicIds
//     );

//     // Revalidate Path for frontend update
//     const teamId = task?.teamId;
//     revalidatePath(`/tasks/edit-panel/${taskId}/${teamId}`);

//     return NextResponse.json(
//       { message: "Media attached to task successfully!", data: attachedTaskReference },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error while attaching media to task:", error);
//     return NextResponse.json(
//       { message: "An error occurred while applying media to task.", error: error?.message },
//       { status: 500 }
//     );
//   }
// }













// import { auth } from "@/app/auth";
// import MediaService from "@/app/services/MediaService";
// import TaskService from "@/app/services/TaskService";
// import { revalidatePath } from "next/cache";
// import { NextResponse } from "next/server";
// import { IncomingForm } from 'formidable';
// import fs from 'fs';

// //Disable default body parsing (needed for FormData)
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req, { params }) {
//   const { taskId } = await params; // Destructure taskId directly from params

//   try {
//     // Get current user
//     const session = await auth();
//     const currentUserId = session?.user?.id;

//     // if (!currentUserId) {
//     //   return NextResponse.json(
//     //     { message: "Unauthorized: User not logged in." },
//     //     { status: 401 }
//     //   );
//     // }

//     // Parse FormData to get files
//     const form = new IncomingForm({ multiples: true });

//     const { fields, files } = await new Promise((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     });

//     // Assuming `mediaType` is a field in the form
//     const mediaType = fields?.mediaType;

//     console.log('Media Type:', mediaType);
//     console.log('Uploaded Files:', files);

//     // Ensure files are in array format
//     const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];

//     // Fetch task by ID to verify user permissions
//     const task = await TaskService.fetchTaskById(taskId);

//     if (!task) {
//       return NextResponse.json(
//         { message: "Task not found." },
//         { status: 404 }
//       );
//     }

//     // Permission checks
//     if (!task.taskAssignedTo.includes(currentUserId)) {
//       return NextResponse.json(
//         { message: "You are not allowed to apply for task approval." },
//         { status: 403 }
//       );
//     }

//     if (task?.leaderId === currentUserId) {
//       return NextResponse.json(
//         { message: "Leader cannot apply for task approval." },
//         { status: 403 }
//       );
//     }

//     // Upload files to Cloudinary via MediaService
//     const uploadedMedia = await MediaService.addMedia(uploadedFiles);

//     console.log('Uploaded Medias:', uploadedMedia);

//     // Attach uploaded media as Task References
//     const mediaUrls = uploadedMedia.map((media) => media?.secure_url); // Extract URLs from uploaded media
//     const publicIds = uploadedMedia.map((media) => media?.public_id); // Extract public IDs from uploaded media

//     // const attachedTaskReference = await TaskService.attachTaskReference(
//     //   currentUserId,
//     //   taskId,
//     //   mediaType,
//     //   mediaUrls,
//     //   publicIds[0]
//     // );

//     // // Revalidate Path for frontend update
//     // const teamId = task.teamId;
//     // revalidatePath(`/tasks/edit-panel/${taskId}/${teamId}`);

//     return NextResponse.json(
//       { message: "Media attached to task successfully!", data: uploadedMedia },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error while attaching media to task:", error);
//     return NextResponse.json(
//       { message: "An error occurred while applying media to task.", error: error?.message },
//       { status: 500 }
//     );
//   }
// }








// import { auth } from "@/app/auth";
// import MediaService from "@/app/services/MediaService";
// import TaskService from "@/app/services/TaskService";
// import { revalidatePath } from "next/cache";
// import { NextResponse } from "next/server";
// import formidable from 'formidable';

// export async function POST(req, {params}) {

//   try {
//     const session = await auth()

//     const currentUserId = session?.user?.id;

//     const { taskId } = await params;

//     const task = await TaskService.fetchTaskById(taskId)

//     const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files]; // Support multiple and single file

//     console.log('TASK', task)


//     if (!task.taskAssignedTo.includes(currentUserId)) {
//         return NextResponse.json(
//             { message: "You Are No Suitable to Apply for Task Approval" },
//             { status: 403 }
//           );
//     }

//     if (task?.leaderId === currentUserId) {
//         return NextResponse.json(
//             { message: "Leader You Cannot Apply for Task Approval" },
//             { status: 403 }
//           );
//     }

//     const mediaType="pdf"

//     const mediaUrls=['url1', 'url2']

//     const getMedia = await MediaService.addMedia(
//         files

//     )

//     const newAttachedRef = await TaskService.attachTaskReference(currentUserId, taskId, mediaType, mediaUrls)

//     const teamId = newEditedTask?.teamId

//     revalidatePath(`/tasks/edit-panel/${taskId}/${teamId}`);

//     return NextResponse.json(
//       { message: "Media Attached To Task successfully!", data: newAttachedRef },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error while attaching media to task:", error);
//     return NextResponse.json(
//       { message: "An error occurred while applying media to task", error: error?.message },
//       { status: 500 }
//     );
//   }
// }
