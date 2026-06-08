import { UserRepository } from '../repositories/UserRepository';
import { User } from '../domain/types';

export class UserService {
  private repository = new UserRepository();

  public async getUserById(id: string): Promise<User | undefined> {
    return this.repository.findById(id);
  }

  public async signup(email: string, password: string, name?: string, ipAddress?: string): Promise<User> {
    // Basic implementation
    return this.repository.create({ email, password, name, ipAddress });
  }
}
