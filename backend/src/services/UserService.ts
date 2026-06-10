import { UserRepository } from '../repositories/UserRepository';
import { User } from '../domain/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

export class UserService {
  private repository = new UserRepository();

  public async getUserById(id: string): Promise<User | undefined> {
    return this.repository.findById(id);
  }

  public async signup(email: string, password: string, name?: string, ipAddress?: string): Promise<{ token: string, user: User }> {
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.repository.create({ email, password: hashedPassword, name, ipAddress });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  }

  public async login(email: string, password: string): Promise<{ token: string, user: User }> {
    const user = await this.repository.findByEmail(email);
    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  }
}
