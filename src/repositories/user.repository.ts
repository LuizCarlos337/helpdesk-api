import { prisma } from '../lib/prisma.js';

interface CreateUserData {
    name: string
    email: string
    passwordHash: string
}

export class UserRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        })
    }

    async findById(id: string) {
        return prisma.user.findUnique({
            where: {
                id,
            },
        })
    }

    async create(data: CreateUserData) {
        return prisma.user.create({
            data,
        })
    }

}