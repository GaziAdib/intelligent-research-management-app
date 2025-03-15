import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ChatMessageService {
    async createConversation(teamId, creatorId, title) {
        try {

         await prisma.conversation.create({
            data: {
                team: {connect: {id: teamId}},
                title: title,
                creator: {connect: {id: creatorId}} 
            }
         })
            
        } catch (error) {
            console.error("Error Creating Conversation:", error);
            throw new Error("Failed to Create Conversations");
        }
    }

    
}

export default new ChatMessageService()