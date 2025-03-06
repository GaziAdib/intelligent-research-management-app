console.log('Team Service')

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
        return await prisma.user.findFirst({
            where: {
                id: teamId
            }
        })
    }

    async fetchAllTeams() {
        return await prisma.team.findMany({ include: {leader: true}})
    }

    async assignLeaderAsTeamMember(leaderId,teamId) {
        return await prisma.team.update({
            where: {
                id: teamId
            },
            data: {
                teamMembers: {
                    push: leaderId
                }
            }
        })
    }



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
}

export default new TeamService();