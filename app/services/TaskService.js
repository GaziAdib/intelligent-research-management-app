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
    async DeleteTask(taskId, leaderId) {
        return await prisma.task.delete({
            where: {
                id: taskId,
                leaderId: leaderId,
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
}

export default new TaskService();