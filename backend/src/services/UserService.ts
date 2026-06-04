import { UserRepository } from '../repositories/UserRepository';
import { User } from '../domain/types';

export class UserService {
  private repository = new UserRepository();

  public async getUserById(id: string): Promise<User | undefined> {
    return this.repository.findById(id);
  }
}
