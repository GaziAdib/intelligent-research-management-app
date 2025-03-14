import { PrismaClient } from "@prisma/client";
import cloudinary from "../libs/cloudinary";

const prisma = new PrismaClient();

class MediaService {

    // fetch all tasks by teamId
    async fetchMedias(taskId) {
            return await prisma.taskReference.findMany({
                where: {
                    taskId: taskId
                },
                include: {
                    uploadedBy: true
                },
                
            })
    }


    async addMedia(files) {
        try {

            const uploadResults = await Promise.all(
                files?.map(async (file) => {
                   
                   const result = await cloudinary.uploader.upload(file.path, {
                    resource_type: 'auto',
                    folder: 'task-references', 
                  });
                  return {
                    url: result?.secure_url,
                    type: result?.resource_type === 'image' ? 'IMAGE' : 'PDF', // Map to ReferenceType
                    public_id: result?.public_id, // Optional: Store this for deletion later if needed
                  };
                })
              );

            
            
        } catch (error) {
            console.error("Error uploading or saving media:", error);
            throw new Error("Failed to upload and attach media.");
        }
    }

    
}

export default new MediaService()