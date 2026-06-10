"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const WorkspaceRepository_1 = require("../repositories/WorkspaceRepository");
class WorkspaceService {
    repository = new WorkspaceRepository_1.WorkspaceRepository();
    async getWorkspaces() {
        return this.repository.findAll();
    }
    async getWorkspaceById(id) {
        return this.repository.findById(id);
    }
    async getCanvasById(id) {
        return this.repository.findCanvasById(id);
    }
    async createWorkspace(name, ownerId) {
        const newWorkspace = {
            id: `ws_${Date.now()}`,
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerId,
        };
        return this.repository.create(newWorkspace);
    }
    async createCanvas(workspaceId, title) {
        const newCanvas = {
            id: `cv_${Date.now()}`,
            title,
            workspaceId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const created = await this.repository.createCanvas(workspaceId, newCanvas);
        if (!created) {
            throw new Error('Workspace not found');
        }
        return created;
    }
    async updateCanvasThumbnail(id, thumbnailUrl) {
        const updated = await this.repository.updateCanvasThumbnail(id, thumbnailUrl);
        if (!updated) {
            throw new Error('Canvas not found');
        }
        return updated;
    }
}
exports.WorkspaceService = WorkspaceService;
