import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TaskService {

    // fetch all tasks by teamId
    async fetchTasks(teamId) {
            return await prisma.task.findMany({
                where: {
                    teamId: teamId,
                },
                include: {
                    team: true,
                    taskAssignedBy: true
                },
                
            })
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
                    include: {teamMembers: {include:{user: true}}}
                },
                taskAssignedBy: true
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
}

export default new TaskService();