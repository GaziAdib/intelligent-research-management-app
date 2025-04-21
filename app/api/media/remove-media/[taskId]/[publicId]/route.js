import { auth } from "@/app/auth";
import TaskService from "@/app/services/TaskService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import cloudinary from "@/app/libs/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(req, { params }) {


  let { taskId, publicId } = await params; // Remove await - params is synchronous

  console.log('---Request Parameters---', { taskId, publicId });

  const decodedPublicId = decodeURIComponent(publicId);

  try {
    const session = await auth();
    console.log('---Session---', session);
    
    const currentUserId = session?.user?.id;
    if (!currentUserId) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    // Validate inputs
    if (!taskId || !publicId) {
      return NextResponse.json(
        { message: "Missing taskId or publicId." },
        { status: 400 }
      );
    }


    const task = await TaskService.fetchTaskById(taskId);

    
    //   return NextResponse.json(
    //     { message: "Task not found." },
    //     { status: 404 }
    //   );
    // }

    // // Check authorization
    // if (!task.taskAssignedTo?.includes(currentUserId)) {
    //   return NextResponse.json(
    //     { message: "Unauthorized action." },
    //     { status: 403 }
    //   );
    // }

    // Delete from Cloudinary
    // console.log('---Deleting from Cloudinary---', publicId);
    // const fullString = publicId;
    // let publicIdOnly = fullString.split('/')[1];


    // First verify the resource exists
    const resource = await cloudinary.api.resource(decodedPublicId);
  
    const cloudinaryResult = await cloudinary.uploader.destroy(decodedPublicId, {invalidate: true})

    
    if (cloudinaryResult.result !== 'ok') {
      throw new Error(`Cloudinary deletion failed: ${cloudinaryResult.result}`);
    }


    // Update database
   
    const updatedTaskReference = await TaskService.removeMediaFromTaskReference(taskId, decodedPublicId);

    // Revalidate
    revalidatePath(`/tasks/edit-panel/${taskId}/${task.teamId}`);

    return NextResponse.json(
      { 
        message: "Media deleted successfully!", 
        data: updatedTaskReference 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in DELETE endpoint:", {
      message: error.message,
      stack: error.stack,
      fullError: error
    });
    
    return NextResponse.json(
      { 
        message: "An error occurred while deleting media.",
        error: error.message 
      },
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

// export async function DELETE(req, { params }) {

//   const { taskId, publicId } = await params; // Destructure taskId directly from params

//   console.log('---publicId----', publicId)

//   try {
 
//     const session = await auth();
//     const currentUserId = session?.user?.id;
    

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


//     if (!taskId || !publicId) {
//         return NextResponse.json({ message: "Missing taskId or publicId." }, { status: 400 });
//       }

//       const task = await TaskService.fetchTaskById(taskId);

//       if (!task) {
//         return NextResponse.json({ message: "Task not found." }, { status: 404 });
//       }

//       if (!task.taskAssignedTo.includes(currentUserId)) {
//         return NextResponse.json({ message: "Unauthorized action." }, { status: 403 });
//       }

//         // Delete from Cloudinary
//         const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
//         if (cloudinaryResult.result !== 'ok') {
//         throw new Error('Failed to delete media from Cloudinary');
//         }

//       const updatedTaskReferene = await TaskService.removeMediaFromTaskReference(taskId, publicId);


//      //Revalidate the UI for real-time updates
//     revalidatePath(`/tasks/edit-panel/${taskId}/${task.teamId}`);

//     return NextResponse.json({ message: "Media deleted successfully!", data: updatedTaskReferene }, { status: 200 });



//   } catch (error) {
//     console.error("Error while attaching media to task:", error);
//     return NextResponse.json(
//       { message: "An error occurred while applying media to task.", error: error?.message },
//       { status: 500 }
//     );
//   }
// }












