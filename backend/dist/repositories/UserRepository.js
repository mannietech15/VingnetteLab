"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prismaClient_1 = require("../infrastructure/prismaClient");
class UserRepository {
    async findById(id) {
        const user = await prismaClient_1.prisma.user.findUnique({ where: { id } });
        if (!user)
            return undefined;
        return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            avatarUrl: user.avatarUrl || undefined,
        };
    }
    async findAll() {
        const users = await prismaClient_1.prisma.user.findMany();
        return users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            avatarUrl: user.avatarUrl || undefined,
        }));
    }
    async create(data) {
        const user = await prismaClient_1.prisma.user.create({ data });
        return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            avatarUrl: user.avatarUrl || undefined,
        };
    }
}
exports.UserRepository = UserRepository;
