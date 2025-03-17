import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ChatMessageService {

    // only the leader can create it!
    async createConversation(teamId, creatorId, title) {
        try {

        return await prisma.conversation.create({
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

    // fetch conversation just first one

    async fetchConversation(teamId) {
        try {
        return await prisma.conversation.findFirst({
            where: {
                teamId: teamId
            },
            include: {
                team: true,
                creator: {
                    select: {
                        email: true,
                        id: true,
                        username:true,
                        profileImageUrl:true
                    }
                }
            }
         })
            
        } catch (error) {
            console.error("Error Creating Conversation:", error);
            throw new Error("Failed to Create Conversations");
        }
    }


    // receivers Id array
    async sendMessage(conversationId, senderId, receivers, content) {
        try {

        return await prisma.message.create({
            data: {
                sender: {connect: {id: senderId}},
                conversation: {connect: {id: conversationId}},
                content: content,
                receivers: receivers
            }
         })
            
        } catch (error) {
            console.error("Error Creating Conversation:", error);
            throw new Error("Failed to Create Conversations");
        }
    }


    // fetch messages 

    async fetchChatMessages(conversationId) {
        try {

        return await prisma.message.findMany({
           where: {
            conversationId: conversationId,
           },
           include: {
            conversation: {
                //include: {team: {include: {teamMembers: true}}},
                include: {creator: true, messages: true, team:{ include: {teamMembers: true}}}
            },
            
            sender: {
                select: {
                    email: true,
                    id: true,
                    username:true,
                    profileImageUrl:true
                }
            },
            
           },
           take: 200,
           orderBy: {
            createdAt: 'asc'
           }
           
         })
            
        } catch (error) {
            console.error("Error Creating Conversation:", error);
            throw new Error("Failed to Create Conversations");
        }
    }

    
}

export default new ChatMessageService()