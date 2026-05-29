"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const JsonDatabase_1 = require("../infrastructure/JsonDatabase");
class UserRepository {
    db = JsonDatabase_1.JsonDatabase.getInstance();
    findById(id) {
        return this.db.getData().users.find((u) => u.id === id);
    }
    findAll() {
        return this.db.getData().users;
    }
}
exports.UserRepository = UserRepository;
