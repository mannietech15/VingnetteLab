"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDatabase = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(__dirname, '../../data.json');
const DEFAULT_DB = {
    users: [
        {
            id: 'usr_1',
            email: 'test@vignettelab.com',
            name: 'Test User',
        }
    ],
    workspaces: [],
};
class JsonDatabase {
    static instance;
    data;
    constructor() {
        this.data = this.readData();
    }
    static getInstance() {
        if (!JsonDatabase.instance) {
            JsonDatabase.instance = new JsonDatabase();
        }
        return JsonDatabase.instance;
    }
    readData() {
        if (!fs_1.default.existsSync(DB_PATH)) {
            this.writeData(DEFAULT_DB);
            return DEFAULT_DB;
        }
        try {
            const fileContent = fs_1.default.readFileSync(DB_PATH, 'utf-8');
            return JSON.parse(fileContent);
        }
        catch (error) {
            console.error('Error reading database file, falling back to default', error);
            return DEFAULT_DB;
        }
    }
    writeData(data) {
        fs_1.default.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    }
    getData() {
        return this.data;
    }
    saveData() {
        this.writeData(this.data);
    }
}
exports.JsonDatabase = JsonDatabase;
