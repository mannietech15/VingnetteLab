"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
class UserService {
    repository = new UserRepository_1.UserRepository();
    getUserById(id) {
        return this.repository.findById(id);
    }
}
exports.UserService = UserService;
