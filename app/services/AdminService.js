import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

class AdminService {

    // fetch all tasks by teamId
    async adminFetchAllTeams() {
        return await prisma.team.findMany({
            include: {
                leader: true,
                teamMembers: true
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
        return await prisma.task.findMany({})
    }

    
    async adminFetchAllNotifications() {
        return await prisma.notification.findMany({})
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


}

export default new AdminService()