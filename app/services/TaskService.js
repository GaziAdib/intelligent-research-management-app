console.log('Task Service')

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


class TaskService {

    // fetch all teams
    async fetchTasks(teamId) {
            return await prisma.task.findMany({
                where: {
                    teamId: teamId,
                },
                include: {
                    team: true
                },
            })
    }

    // find each team info
    async fetchSingleTask(taskId) {
        return await prisma.task.findFirst({
            where: {
                id: taskId
            },
            include: {
                team: true
            }
        })
    }


    async addTaskToTeam(leaderId, teamId, taskTitle, taskShortDescription, priority, status, taskBgColor,  taskTextColor) {
        return await prisma.task.create({
            where: {
                teamId
            },
            data: {
                taskTitle: taskTitle,
                taskShortDescription: taskShortDescription,
                priority: priority,
                status: status,
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
    async assignTaskToTeamMember(memberId, taskId) {
        return await prisma.task.update({
            where: {
                id: taskId
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