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
                team: true,
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