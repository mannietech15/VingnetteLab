import { prisma } from '../infrastructure/prismaClient';
import { User } from '../domain/types';

export class UserRepository {
  public async findById(id: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return undefined;
    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      avatarUrl: user.avatarUrl || undefined,
    };
  }

  public async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      avatarUrl: user.avatarUrl || undefined,
    }));
  }
}
