"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const WorkspaceRepository_1 = require("../repositories/WorkspaceRepository");
class WorkspaceService {
    repository = new WorkspaceRepository_1.WorkspaceRepository();
    getWorkspaces() {
        return this.repository.findAll();
    }
    getWorkspaceById(id) {
        return this.repository.findById(id);
    }
    getCanvasById(id) {
        return this.repository.findCanvasById(id);
    }
    createWorkspace(name, ownerId) {
        const newWorkspace = {
            id: `ws_${Date.now()}`,
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerId,
            canvases: [],
        };
        return this.repository.create(newWorkspace);
    }
    createCanvas(workspaceId, title) {
        const newCanvas = {
            id: `cv_${Date.now()}`,
            title,
            workspaceId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const created = this.repository.createCanvas(workspaceId, newCanvas);
        if (!created) {
            throw new Error('Workspace not found');
        }
        return created;
    }
    updateCanvasThumbnail(id, thumbnailUrl) {
        const updated = this.repository.updateCanvasThumbnail(id, thumbnailUrl);
        if (!updated) {
            throw new Error('Canvas not found');
        }
        return updated;
    }
}
exports.WorkspaceService = WorkspaceService;
