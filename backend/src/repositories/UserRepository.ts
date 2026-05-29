import { JsonDatabase } from '../infrastructure/JsonDatabase';
import { User } from '../domain/types';

export class UserRepository {
  private db = JsonDatabase.getInstance();

  public findById(id: string): User | undefined {
    return this.db.getData().users.find((u) => u.id === id);
  }

  public findAll(): User[] {
    return this.db.getData().users;
  }
}
