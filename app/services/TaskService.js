import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TaskService {

    // fetch all tasks by teamId
    async fetchTasks(teamId, limit, pageNumber, status, query) {
    
        const safePageNumber = Number(pageNumber) || 1;

        const totalTasksCount = await prisma.task.count({
            where: {
                teamId: teamId,
            },
        });

        console.log('Total Tasks Count---', totalTasksCount)

        //  search filter if query exists
        const searchFilter = query
        ? {
            OR: [
                { taskTitle: { contains: query, mode: 'insensitive' } },
                { taskShortDescription: { contains: query, mode: 'insensitive' } }
            ],
        }
        : {};

        // Fetching paginated tasks 
        const tasks = await prisma.task.findMany({
            where: {
                teamId: teamId,
                ...(status ? { status: status.toString() } : {}),
                ...searchFilter
            },
            include: {
                taskAssignedBy: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        profileImageUrl: true,
                        role: true
                    }
                },
            },
            take: Number(limit),
            skip: (safePageNumber - 1) * Number(limit) // Skip based on page number
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalTasksCount / Number(limit));

        return {
            tasks,
            totalPages
        };
    }

    // find each task info bt taskId and teamId
    async fetchSingleTask(teamId,taskId) {
        return await prisma.task.findFirst({
            where: {
                id: taskId,
                teamId: teamId,
            },
            include: {
                team: {
                    include: {
                        conversation: true,
                        teamMembers: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                // team: {
                //     include: {teamMembers: {include:{user: true}}}
                // },
                taskAssignedBy: true,
                taskRelatedReferences: true
            }
        })
    }

    // find task by id only 
    async fetchTaskById(taskId) {
        return await prisma.task.findFirst({
            where: {
                id: taskId,
            },
            include: {
                team: {
                    include: {teamMembers: {include:{user: true}}}
                },
                taskAssignedBy: true,
                taskRelatedReferences: true
            }
        })
    }


    


    async addTaskToTeam(leaderId, teamId, taskTitle, taskShortDescription, priority, taskBgColor,  taskTextColor) {
        return await prisma.task.create({
            data: {
                taskTitle: taskTitle,
                taskShortDescription: taskShortDescription,
                priority: priority,
                team: {connect: {id: teamId}},
                taskAssignedBy: {connect: {id: leaderId}},
                taskBgColor: taskBgColor ? taskBgColor : '',
                taskTextColor: taskTextColor ? taskTextColor : ''
            }
        })
    }

    // Edit Task By Member
    

    async updateTask(taskId, taskTitle, taskShortDescription, taskMemberDraftContent, taskMemberFinalContent, aiGeneratedText, aiGeneratedCode) {
        return await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                taskTitle: taskTitle,
                taskShortDescription: taskShortDescription,
                taskMemberDraftContent: taskMemberDraftContent,
                taskMemberFinalContent: taskMemberFinalContent,
                aiGeneratedCode: aiGeneratedCode,
                aiGeneratedText: aiGeneratedText
            }
        })
    }

    // Delete a team only by leader
    async DeleteTask(taskId) {
        return await prisma.task.delete({
            where: {
                id: taskId
            }
        })
    }

    // Assign a normal User to a make him a team Member
    async assignTaskToTeamMember(memberId, taskId, teamId) {
        return await prisma.task.update({
            where: {
                id: taskId,
                teamId: teamId
            },
            data: {
                taskAssignedTo: {
                    push: memberId
                }
            },
            include: {
                team: {
                    include: {
                        teamMembers:{
                            include: {
                                user: true
                            }
                        }
                    }
                },
                taskAssignedBy:{
                    select: {
                        username: true,
                        id: true,
                        email: true
                    }
                },
                
            }
        })
    }

     // Remove a member from assigned lists of tasks
     async removeMemberFromAssignedTask(memberId, taskId, teamId) {

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                teamId: teamId
            },
            select: {
                taskAssignedTo:true
            }
        })

        if (!task) {
            throw new Error("Task not found");
        }

        const updatedAssignedMembers = task?.taskAssignedTo?.filter(id => id !== memberId)

        return await prisma.task.update({
            where: {
                id: taskId,
                teamId: teamId
            },
            data: {
                taskAssignedTo: {
                    set: updatedAssignedMembers
                }
            },
            include: {
                taskAssignedBy: true,
                team: {
                    include: {
                        teamMembers: {
                            include: {
                                user:true
                            }
                        }
                    }
                }
            }
        
        })
    }


    // member apply for task approval 

    async requestForTaskApproval(taskId) {
        return await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                status: 'Pending'
            }
        })
    }



    // approve Task by leader

    async approveTask(taskId) {
        return await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                status: 'Approved'
            },
            select: {
                teamId: true,
                status: true,
                id: true
            }
            
        })
    }

    async rejectTask(taskId) {
        return await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                status: 'Rejected'
            },
            select: {
                teamId: true,
                status: true,
                id: true
            }
            
        })
    }

    async addRemarkToTask(leaderId, taskId, remark) {
        return await prisma.task.update({
            where: {
                id: taskId,
                leaderId: leaderId,
            },
            data: {
                remarkByLeader: remark
            }
        })
    }


    // Add task Reference to Task by task id, userid

    async attachTaskReference(userId, taskId, mediaType, mediaUrls, public_ids) {
        return await prisma.taskReference.create({
            data: {
               uploadedBy: {connect: {id: userId}},
               task: {connect: {id: taskId}},
               mediaType: mediaType,
               mediaUrls: mediaUrls,
               publicIds: public_ids
            }
        })
    }


    // async removeMediaFromTaskReference(taskId, publicId) {

    //     const taskRef = await prisma.taskReference.findFirst({
    //         where: {
    //             taskId: taskId
    //         },
    //         select: {
    //             id: true,
    //             taskId: true,
    //             mediaUrls: true,
    //             publicIds: true
    //         }
            
    //     })

    // // Filter out mediaUrls that contain the publicId as a substring
    // const updatedMediaUrls = taskRef.mediaUrls?.filter((url) => !url.includes(publicId));
    // const updatedPublicIds = taskRef.publicIds?.filter((id) => id !== publicId);
    // return await prisma.taskReference.update({
    //         where: {
    //             id: taskId
    //         },
    //         data: {
    //             mediaUrls: { set: updatedMediaUrls },
    //             publicIds: { set: updatedPublicIds },
    //           }
    //     })
    // }

    // async removeMediaFromTaskReference(taskId, publicId) {
    //     try {
    //       // 1. First find the task reference
    //       const taskRef = await prisma.taskReference.findFirst({
    //         where: { taskId },
    //         select: {
    //           id: true,
    //           taskId: true,
    //           mediaUrls: true,
    //           publicIds: true
    //         }
    //       });
      
    //       if (!taskRef) {
    //         throw new Error(`Task reference not found for taskId: ${taskId}`);
    //       }
      
    //       // 2. Prepare updated arrays
    //       const updatedMediaUrls = taskRef.mediaUrls?.filter(url => {
    //         // More precise matching - extract publicId from URL for comparison
    //         const urlPublicId = url.match(/\/v\d+\/(.+?)(\.\w+)?$/)?.[1];
    //         return urlPublicId !== publicId;
    //       }) || [];
      
    //       const updatedPublicIds = taskRef.publicIds?.filter(id => id !== publicId) || [];
      
    //       // 3. Update the task reference
    //       return await prisma.taskReference.update({
    //         where: { id: taskRef.id },  // Use taskRef.id instead of taskId
    //         data: {
    //           mediaUrls: updatedMediaUrls.length > 0 ? { set: updatedMediaUrls } : { set: [] },
    //           publicIds: updatedPublicIds.length > 0 ? { set: updatedPublicIds } : { set: [] },
    //         }
    //       });
      
    //     } catch (error) {
    //       console.error('Error in removeMediaFromTaskReference:', {
    //         taskId,
    //         publicId,
    //         error: error.message
    //       });
    //       throw error; // Re-throw for the calling function to handle
    //     }
    //   }

    // async removeMediaFromTaskReference(taskId, publicIdToRemove) {
    //     try {
    //       // 1. Find the task reference
    //       const taskRef = await prisma.taskReference.findMany({
    //         where: { taskId: taskId },
    //         select: {
    //           id: true,
    //           taskId: true,
    //           mediaUrls: true,
    //           publicIds: true
    //         }
    //       });

    //       taskRef.map((t) => t.mediaUrls)
      
    //       if (!taskRef) {
    //         throw new Error(`Task reference not found for task ${taskId}`);
    //       }
      
    //       // 2. Find the index of the publicId to remove
    //       const indexToRemove = taskRef.publicIds?.findIndex(
    //         id => id === publicIdToRemove
    //       );
      
    //       if (indexToRemove === -1 || indexToRemove === undefined) {
    //         throw new Error(`Public ID ${publicIdToRemove} not found in task ${taskId}`);
    //       }
      
    //       // 3. Verify the corresponding media URL exists
    //       if (!taskRef.mediaUrls || indexToRemove >= taskRef.mediaUrls.length) {
    //         throw new Error(`No corresponding media URL found for public ID ${publicIdToRemove}`);
    //       }
      
    //       // 4. Create new arrays with the item removed from both
    //       const updatedPublicIds = [
    //         ...taskRef.publicIds.slice(0, indexToRemove),
    //         ...taskRef.publicIds.slice(indexToRemove + 1)
    //       ];
      
    //       const updatedMediaUrls = [
    //         ...taskRef.mediaUrls.slice(0, indexToRemove),
    //         ...taskRef.mediaUrls.slice(indexToRemove + 1)
    //       ];
      
    //       // 5. Update the task reference
    //       return await prisma.taskReference.update({
    //         where: { id: taskRef.id },
    //         data: {
    //           publicIds: { set: updatedPublicIds },
    //           mediaUrls: { set: updatedMediaUrls }
    //         }
    //       });
      
    //     } catch (error) {
    //       console.error('Failed to remove media reference:', {
    //         taskId,
    //         publicIdToRemove,
    //         error: error.message
    //       });
    //       throw error;
    //     }
    //   }


    async removeMediaFromTaskReference(taskId, publicIdToRemove) {
        try {
          // 1. Find all task references for this task
          const taskReferences = await prisma.taskReference.findMany({
            where: { taskId },
            select: {
              id: true,
              mediaUrls: true,
              publicIds: true
            }
          });
      
          if (!taskReferences || taskReferences.length === 0) {
            throw new Error(`No task references found for task ${taskId}`);
          }
      
          // 2. Process each task reference to remove the matching publicId/mediaUrl
          const updatePromises = taskReferences.map(async (taskRef) => {
            // Find index of the publicId to remove
            const indexToRemove = taskRef.publicIds?.findIndex(
              id => id === publicIdToRemove
            );
      
            // If publicId not found in this task reference, skip
            if (indexToRemove === -1 || indexToRemove === undefined) {
              return null;
            }
      
            // Verify corresponding media URL exists
            if (!taskRef.mediaUrls || indexToRemove >= taskRef.mediaUrls.length) {
              console.warn(`Mismatch in arrays for task reference ${taskRef.id}`);
              return null;
            }
      
            // Create updated arrays
            const updatedPublicIds = [
              ...taskRef.publicIds.slice(0, indexToRemove),
              ...taskRef.publicIds.slice(indexToRemove + 1)
            ];
      
            const updatedMediaUrls = [
              ...taskRef.mediaUrls.slice(0, indexToRemove),
              ...taskRef.mediaUrls.slice(indexToRemove + 1)
            ];
      
            // Return the update promise
            return prisma.taskReference.update({
              where: { id: taskRef.id },
              data: {
                publicIds: { set: updatedPublicIds },
                mediaUrls: { set: updatedMediaUrls }
              }
            });
          });
      
          // 3. Execute all updates and filter out nulls (where publicId wasn't found)
          const updateResults = await Promise.all(updatePromises);
          const successfulUpdates = updateResults.filter(result => result !== null);
      
          if (successfulUpdates.length === 0) {
            throw new Error(`Public ID ${publicIdToRemove} not found in any task reference for task ${taskId}`);
          }
      
          return successfulUpdates;
      
        } catch (error) {
          console.error('Failed to remove media reference:', {
            taskId,
            publicIdToRemove,
            error: error.message
          });
          throw error;
        }
      }

    
}

export default new TaskService();