"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
class UserService {
    repository = new UserRepository_1.UserRepository();
    async getUserById(id) {
        return this.repository.findById(id);
    }
    async signup(email, password, name, ipAddress) {
        // Basic implementation
        return this.repository.create({ email, password, name, ipAddress });
    }
}
exports.UserService = UserService;
