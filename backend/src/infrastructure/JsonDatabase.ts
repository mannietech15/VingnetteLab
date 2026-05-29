import fs from 'fs';
import path from 'path';
import { User, Workspace } from '../domain/types';

interface DatabaseSchema {
  users: User[];
  workspaces: Workspace[];
}

const DB_PATH = path.join(__dirname, '../../data.json');

const DEFAULT_DB: DatabaseSchema = {
  users: [
    {
      id: 'usr_1',
      email: 'test@vignettelab.com',
      name: 'Test User',
    }
  ],
  workspaces: [],
};

export class JsonDatabase {
  private static instance: JsonDatabase;
  private data: DatabaseSchema;

  private constructor() {
    this.data = this.readData();
  }

  public static getInstance(): JsonDatabase {
    if (!JsonDatabase.instance) {
      JsonDatabase.instance = new JsonDatabase();
    }
    return JsonDatabase.instance;
  }

  private readData(): DatabaseSchema {
    if (!fs.existsSync(DB_PATH)) {
      this.writeData(DEFAULT_DB);
      return DEFAULT_DB;
    }
    try {
      const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(fileContent) as DatabaseSchema;
    } catch (error) {
      console.error('Error reading database file, falling back to default', error);
      return DEFAULT_DB;
    }
  }

  private writeData(data: DatabaseSchema): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public saveData(): void {
    this.writeData(this.data);
  }
}
