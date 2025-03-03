import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log('Auth Service Login, Registration, reset password etc')

class UserService {

    // just find user with given email
    async findUserByEmail(email) {
        return await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
    }


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
}

export default new UserService();