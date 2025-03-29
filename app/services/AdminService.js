import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

class AdminService {

    // fetch all tasks by teamId
    async adminFetchAllTeams() {
        return await prisma.team.findMany({
            include: {
                leader: true
            }
        })
    }


    // async adminFetchTasks(teamId) {
    //     return await prisma.task.findMany({
    //         where: {
    //             teamId: teamId
    //         },
    //         select: {
    //             team: true,
    //             taskAssignedBy: true,
    //             taskAssignedTo: true,
    //             createdAt: true,
    //             priority: true,
    //             status: true
    //         }
    //     })
    // }

    async adminFetchAllUsers() {
        return await prisma.user.findMany({})
    }

    async adminFetchAllTasks() {
        return await prisma.task.findMany({
            include: {
                taskAssignedBy: true
            }
        })
    }

    
    async adminFetchAllNotifications() {
        return await prisma.notification.findMany({
            include: {
                team: {
                   select: {
                    teamName: true
                   }
                }
            }
        })
    }

    // fetch team members count for each team

    // async adminFetchChatMessages(conversationId) {
    //     return await prisma.message.findMany({
    //         where: {
    //             conversationId: conversationId,
    //         },
    //         include: {
    //             conversation: true
    //         }
    //     })
    // }


    // admin fetch all chatMessages
    async adminFetchAllChatMessages() {
        return await prisma.message.findMany({
            include: {
                conversation: true
            }
        })
    }

    // AdminFetch ALL Conversations
    async adminFetchAllConversations() {
        return await prisma.conversation.findMany({})
    }


    
    // Admin delete A team 
    async adminDeleteTeam(teamId) {
        return await prisma.team.deleteMany({
            where: {
                id: teamId
            }
        })
    }



     // ADMIN Delete A Task
    async adminDeleteTask(taskId) {
        return await prisma.task.delete({
            where: {
                id: taskId
            }
        })
    }

    
    // ADMIN Delete A Notification
    async adminDeleteNotification(notificationId) {
        return await prisma.notification.delete({
            where: {
                id: notificationId
            }
        })
    }

       // ADMIN Delete Multiple Notifications
       async adminDeleteMultipleNotifications(notificationIds) {
        if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
            throw new Error("Invalid notification IDs. Provide a non-empty array.");
        }
    
        try {
             await prisma.notification.deleteMany({
                where: {
                    id: {
                        in: notificationIds,
                    },
                },
            });
    
        } catch (error) {
            console.error("Error deleting multiple notifications:", error);
            throw new Error("Failed to delete notifications.");
        }
    }


    // ADMIN Delete Conversation
    async adminDeleteConversation(conversationId) {
        return await prisma.conversation.delete({
            where: {
                id: conversationId
            }
        })
    }

    // delete all conversations
    async adminDeleteAllConversations() {
        return await prisma.conversation.deleteMany({})
    }



    // admin Delete User


    async adminRemoveUser(userId) {
        await prisma.user.delete({
            where: {
                id: userId
            }
        })
    }


}

export default new AdminService()