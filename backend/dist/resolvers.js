"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const WorkspaceService_1 = require("./services/WorkspaceService");
const UserService_1 = require("./services/UserService");
const workspaceService = new WorkspaceService_1.WorkspaceService();
const userService = new UserService_1.UserService();
exports.resolvers = {
    Query: {
        me: () => userService.getUserById('usr_1'),
        workspaces: () => workspaceService.getWorkspaces(),
        workspace: (_, { id }) => workspaceService.getWorkspaceById(id),
        canvas: (_, { id }) => workspaceService.getCanvasById(id)
    },
    Mutation: {
        createWorkspace: (_, { name }) => {
            // Hardcoding 'usr_1' for now since we don't have true auth context
            return workspaceService.createWorkspace(name, 'usr_1');
        },
        createCanvas: (_, { workspaceId, title }) => {
            return workspaceService.createCanvas(workspaceId, title);
        },
        updateCanvasThumbnail: (_, { id, thumbnailUrl }) => {
            return workspaceService.updateCanvasThumbnail(id, thumbnailUrl);
        }
    }
};
