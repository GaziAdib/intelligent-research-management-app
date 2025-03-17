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

    // find Unqiue user by email feature
    async findUniqueUserByEmail(email) {
        return await prisma.user.findUnique({
            where: {
                email: email
            }
        })
    }


    // Create Notification based on some events
    async sendNotification(teamId, taskId, message, type, receiversEmails) {
        return await prisma.notification.create({
            data: {
               team: {connect: {id: teamId}},
               message: message,
               type: type,
               isRead: false,
               recipientEmails: receiversEmails,
               task: {connect: {id: taskId}}
            }
        })
    }


    // is seen feature

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