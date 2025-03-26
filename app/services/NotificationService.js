import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class NotificationService {


    // fetch all users feature
    async fetchNotfications(teamId) {
        return await prisma.notification.findMany({
            where: {
                teamId: teamId
            }
           
        })
    }

    async fetchUserNotifications(userId) {
        return await prisma.notification.findMany({
            where: {
                recipientIds: {
                    has: userId
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 5
        })
    }



    // Create Notification based on some events
    async sendNotification(teamId, taskId, message, type, receiverids, receiversEmails) {
        return await prisma.notification.create({
            data: {
               team: {connect: {id: teamId}},
               task: {connect: {id: taskId}},
               message: message,
               type: type,
               recipientIds: receiverids,
               recipientEmails: receiversEmails
            }
        })
    }


    // is seen feature is savailable here

    async isSeenNotification(notificationId, isSeen) {
        return await prisma.notification.update({
            where: {
                id: notificationId
            },
            data: {
               isRead: isSeen // true or false
            }
        })
    }

    


}

export default new NotificationService()