import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

class TeamService {

    // fetch all teams
    async fetchTeams(userId, userRole) {
        if (userRole === 'ADMIN') {
            return await prisma.team.findMany({
                include: {
                    leader: true,
                },
                
            })
        } else if (userRole === 'LEADER') {
            return await prisma.team.findMany({
                where: {
                    leaderId: userId
                },
                include: {
                    leader: true
                }
            })
        } else if (userRole === 'MEMBER') {
            return await prisma.team.findMany({
                where: {
                    teamMembers: {
                        hasSome: {
                            id: userId
                        },
                    },
                },
                include: {
                    leader: true
                },
            });
        } else {
            throw new Error('Unauthorized: User role not allowed to fetch teams');
        }
    }

    // find each team info
    async fetchSingleTeam(teamId) {
        return await prisma.team.findFirst({
            where: {
                id: teamId
            },
            include: {
                leader:true,
                conversation:true,
                teamMembers:{
                    include: {
                        user: true,
                        team:true
                    }
                }
            }
        })
    }

    async fetchAllTeams() {
        return await prisma.team.findMany({
            select: {
                id: true,         
                teamName: true,
                teamShortDescription: true,
                createdAt: true,
                teamMembers: true,
                leader: {
                    select: {
                        id: true,  
                        username: true, 
                        email: true,
                        profileImageUrl: true
                    }
                }
            }
        });
    }

    async fetchTeamsByUserId(userId) {
        return await prisma.team.findMany({
            where: {
                teamMembers: {
                    some: {
                        userId: userId
                    }
                   
                }
            },
            select: {
                id: true,         
                teamName: true,
                teamShortDescription: true,
                createdAt: true,
                teamMembers: {
                    include: {user: true, team:true}
                },
                leader: {
                    select: {
                        id: true,  
                        username: true, 
                        email: true,
                        profileImageUrl: true
                    }
                }
            }
        });
    }

    
    async assignLeaderAsTeamMember(leaderId,teamId) {
        return await prisma.teamMember.create({
            data: {
                team: {connect: {id: teamId}},
                user: {connect: {id: leaderId}},
            },
            include: {
                team: true
            }
        })
    }

    // Assign a normal User to a make him a team Member
    async assignUserToTeam(userId,teamId) {
        return await prisma.teamMember.create({
            data: {
                team: {connect: {id: teamId}},
                user: {connect: {id: userId}},
            },
            include: {
                team: true
            }
        })
    }

    


    // Kick Current Team Member from the team memberLists
    async kickMemberFromTeam(memberId, teamId) {
        return await prisma.teamMember.delete({
            where: {
                teamId: teamId,
                userId: memberId
            }
        })
    }

  


    // Create a Beautiful Team for your projects
    async createTeam(leaderId, teamName, teamShortDescription, teamBgColor, teamTextColor, teamLogoUrl) {

         
        return await prisma.team.create({
            data: {
                teamName: teamName,
                teamShortDescription: teamShortDescription,
                teamBgColor:  teamBgColor ? teamBgColor : '',
                teamTextColor: teamTextColor ? teamTextColor : '',
                teamLogoUrl: teamLogoUrl ? teamLogoUrl : '',
                leader: {connect: { id: leaderId }}
            }
        })
    }

    // Delete a team only by leader
    async deleteTeam(leaderId, teamId) {
        return await prisma.team.delete({
            where: {
                id: teamId,
                leaderId: leaderId,
            }
        })
    }


    // check current userId in teamMembers list then he can see all tasks for that team

    async checkUserInTeam(userId,teamId) {
         const teamInfo =  await prisma.team.findFirst({
            where: {
                id: teamId
            },
            select: {
                teamMembers: true
            }
        })

        return teamInfo?.teamMembers?.includes(userId) ?? false;

    }
}

export default new TeamService();













// import { PrismaClient } from "@prisma/client";


// const prisma = new PrismaClient();

// class TeamService {

//     // fetch all teams
//     async fetchTeams(userId, userRole) {
//         if (userRole === 'ADMIN') {
//             return await prisma.team.findMany({
//                 include: {
//                     leader: true,
//                 },
                
//             })
//         } else if (userRole === 'LEADER') {
//             return await prisma.team.findMany({
//                 where: {
//                     leaderId: userId
//                 },
//                 include: {
//                     leader: true
//                 }
//             })
//         } else if (userRole === 'MEMBER') {
//             return await prisma.team.findMany({
//                 where: {
//                     teamMembers: {
//                         hasSome: {
//                             id: userId
//                         },
//                     },
//                 },
//                 include: {
//                     leader: true
//                 },
//             });
//         } else {
//             throw new Error('Unauthorized: User role not allowed to fetch teams');
//         }
//     }

//     // find each team info
//     async fetchSingleTeam(teamId) {
//         return await prisma.team.findFirst({
//             where: {
//                 id: teamId
//             },
//             include: {leader:true}
//         })
//     }

//     async fetchAllTeams() {
//         return await prisma.team.findMany({
//             select: {
//                 id: true,         
//                 teamName: true,
//                 teamShortDescription: true,
//                 createdAt: true,
//                 teamMembers: true,
//                 leader: {
//                     select: {
//                         id: true,  
//                         username: true, 
//                         email: true,
//                         profileImageUrl: true
//                     }
//                 }
//             }
//         });
//     }

//     async fetchTeamsByUserId(userId) {
//         return await prisma.team.findMany({
//             where: {
//                 teamMembers: {
//                     has: userId
//                 }
//             },
//             select: {
//                 id: true,         
//                 teamName: true,
//                 teamShortDescription: true,
//                 createdAt: true,
//                 teamMembers: true,
//                 leader: {
//                     select: {
//                         id: true,  
//                         username: true, 
//                         email: true,
//                         profileImageUrl: true
//                     }
//                 }
//             }
//         });
//     }

    
//     async assignLeaderAsTeamMember(leaderId,teamId) {
//         return await prisma.team.update({
//             where: {
//                 id: teamId
//             },
//             data: {
//                 teamMembers: {
//                     push: leaderId
//                 }
//             }
//         })
//     }

//     // Assign a normal User to a make him a team Member
//     async assignUserToTeam(userId,teamId) {
//         return await prisma.team.update({
//             where: {
//                 id: teamId
//             },
//             data: {
//                 teamMembers: {
//                     push: userId
//                 }
//             }
//         })
//     }


//     // Kick Current Team Member from the team memberLists
//     async kickMemberFromTeam(memberId, teamId) {

//         const team = await prisma.team.findUnique({
//             where: {
//                 id: teamId
//             },
//             select: {
//                 teamMembers: true
//             }
//         })

//         if (!team) {
//             throw new Error('Team Not Found')
//         }

//         const updatedTeamMembers = team?.teamMembers?.filter(member => member !== memberId)

//         return await prisma.team.update({
//             where: {
//                 id: teamId
//             },
//             data: {
//                 teamMembers: {
//                     set: updatedTeamMembers
//                 }
//             }
//         })
//     }



//     // Create a Beautiful Team for your projects
//     async createTeam(leaderId, teamName, teamShortDescription, teamBgColor, teamTextColor, teamLogoUrl) {

         
//         return await prisma.team.create({
//             data: {
//                 teamName: teamName,
//                 teamShortDescription: teamShortDescription,
//                 teamBgColor:  teamBgColor ? teamBgColor : '',
//                 teamTextColor: teamTextColor ? teamTextColor : '',
//                 teamLogoUrl: teamLogoUrl ? teamLogoUrl : '',
//                 leader: {connect: { id: leaderId }}
//             }
//         })
//     }

//     // Delete a team only by leader
//     async deleteTeam(leaderId, teamId) {
//         return await prisma.team.delete({
//             where: {
//                 id: teamId,
//                 leaderId: leaderId,
//             }
//         })
//     }


//     // check current userId in teamMembers list then he can see all tasks for that team

//     async checkUserInTeam(userId,teamId) {
//          const teamInfo =  await prisma.team.findFirst({
//             where: {
//                 id: teamId
//             },
//             select: {
//                 teamMembers: true
//             }
//         })

//         return teamInfo?.teamMembers?.includes(userId) ?? false;

//     }
// }

// export default new TeamService();