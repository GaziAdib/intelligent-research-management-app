import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserService {

    // just find user with given email
    async findUserByEmail(email) {
        return await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
    }

    // find user by Id

    async findUserById(userId) {
        return await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
    }

    // fetch all users feature
    async fetchAllUsers() {
        return await prisma.user.findMany({})
    }

    // find Unqiue user by email feature
    async findUniqueUserByEmail(email) {
        return await prisma.user.findUnique({
            where: {
                email: email
            }
        })
    }


    // Register User Feature
    async createUser(username, email, hashedPassword, profileImageUrl) {
        return await prisma.user.create({
            data: {
                profileImageUrl: profileImageUrl,
                username: username,
                email: email,
                password: hashedPassword
            }
        })
    }

    // update User Role Feature
    async updateUserRole(userId, role) {
        return await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: role
            }
        })
    }


}

export default new UserService();