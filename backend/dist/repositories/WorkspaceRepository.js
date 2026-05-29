"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceRepository = void 0;
const JsonDatabase_1 = require("../infrastructure/JsonDatabase");
class WorkspaceRepository {
    db = JsonDatabase_1.JsonDatabase.getInstance();
    findAll() {
        return this.db.getData().workspaces;
    }
    findById(id) {
        return this.db.getData().workspaces.find((w) => w.id === id);
    }
    create(workspace) {
        this.db.getData().workspaces.push(workspace);
        this.db.saveData();
        return workspace;
    }
    createCanvas(workspaceId, canvas) {
        const workspace = this.findById(workspaceId);
        if (!workspace)
            return null;
        workspace.canvases.push(canvas);
        this.db.saveData();
        return canvas;
    }
    findCanvasById(canvasId) {
        const workspaces = this.db.getData().workspaces;
        for (const w of workspaces) {
            const canvas = w.canvases.find(c => c.id === canvasId);
            if (canvas)
                return canvas;
        }
        return null;
    }
    updateCanvasThumbnail(canvasId, thumbnailUrl) {
        const workspaces = this.db.getData().workspaces;
        for (const w of workspaces) {
            const canvas = w.canvases.find(c => c.id === canvasId);
            if (canvas) {
                canvas.thumbnailUrl = thumbnailUrl;
                canvas.updatedAt = new Date().toISOString();
                this.db.saveData();
                return canvas;
            }
        }
        return null;
    }
}
exports.WorkspaceRepository = WorkspaceRepository;
