import { UserRepository } from '../repositories/UserRepository';
import { User } from '../domain/types';

export class UserService {
  private repository = new UserRepository();

  public getUserById(id: string): User | undefined {
    return this.repository.findById(id);
  }
}
