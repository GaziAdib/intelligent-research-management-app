import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ChatMessageService {

    // only the leader can create it!
    async createConversation(teamId, creatorId, title) {
        try {

          const conversation = await prisma.team.findFirst({
            where: {
                id: teamId
            },
            select: {
                teamMembers: true
            }
          }) 
          
          if (conversation?.teamMembers?.length===0) {
            throw new Error("Failed to Create Conversations as there are no team members ");
          } 

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

    async checkTeamMembersavailable(teamId) {
        try {

        return await prisma.team.findFirst({
            where: {
                id: teamId
            },
            include: {
                teamMembers:true,
                conversation: true
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

    // async fetchChatMessages(conversationId) {
    //     try {

    //     return await prisma.message.findMany({
    //        where: {
    //         conversationId: conversationId
    //        },
    //        include: {
    //         conversation: {
    //             //include: {team: {include: {teamMembers: true}}},
    //             include: {creator: true, messages: true, team:{ include: {teamMembers: true}}}
    //         },
            
    //         sender: {
    //             select: {
    //                 email: true,
    //                 id: true,
    //                 username:true,
    //                 profileImageUrl:true
    //             }
    //         },
            
    //        },
    //        take: 200,
    //        orderBy: {
    //         createdAt: 'asc'
    //        }
           
    //      })
            
    //     } catch (error) {
    //         console.error("Error Creating Conversation:", error);
    //         throw new Error("Failed to Create Conversations");
    //     }
    // }

    async fetchChatMessages(conversationId) {
        try {
          // Fetch the conversation along with its team and team members
          const conversation = await prisma.conversation.findUnique({
            where: {
              id: conversationId,
            },
            include: {
              team: {
                include: {
                  teamMembers: true,
                },
              },
            },
          });
      
          // Check if the conversation exists and has a team
          if (!conversation || !conversation.team) {
            throw new Error("Conversation not found or not associated with a team.");
          }
      
          // Check if the team has members
          if (!conversation.team.teamMembers || conversation.team.teamMembers.length === 0) {
            throw new Error("This team has no members. Cannot fetch messages.");
          }
      
          // Fetch messages for the conversation
          const messages = await prisma.message.findMany({
            where: {
              conversationId: conversationId,
            },
            include: {
              conversation: {
                include: {
                  creator: true,
                  team: {
                    include: {
                      teamMembers: true,
                    },
                  },
                },
              },
              sender: {
                select: {
                  email: true,
                  id: true,
                  username: true,
                  profileImageUrl: true,
                },
              },
            },
            take: 200,
            orderBy: {
              createdAt: "asc",
            },
          });
      
          return messages;
        } catch (error) {
          console.error("Error fetching chat messages:", error);
          throw new Error("Failed to fetch chat messages: " + error.message);
        }
      }
    
}

export default new ChatMessageService()