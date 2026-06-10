"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceRepository = void 0;
const prismaClient_1 = require("../infrastructure/prismaClient");
class WorkspaceRepository {
    async findAll() {
        const workspaces = await prismaClient_1.prisma.workspace.findMany({
            include: { canvases: true }
        });
        return workspaces.map(w => ({
            id: w.id,
            name: w.name,
            createdAt: w.createdAt.toISOString(),
            updatedAt: w.updatedAt.toISOString(),
            ownerId: w.ownerId,
            canvases: w.canvases.map(c => ({
                id: c.id,
                title: c.title,
                workspaceId: c.workspaceId,
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString(),
                thumbnailUrl: c.thumbnailUrl || undefined,
            }))
        }));
    }
    async findById(id) {
        const workspace = await prismaClient_1.prisma.workspace.findUnique({
            where: { id },
            include: { canvases: true }
        });
        if (!workspace)
            return undefined;
        return {
            id: workspace.id,
            name: workspace.name,
            createdAt: workspace.createdAt.toISOString(),
            updatedAt: workspace.updatedAt.toISOString(),
            ownerId: workspace.ownerId,
            canvases: workspace.canvases.map(c => ({
                id: c.id,
                title: c.title,
                workspaceId: c.workspaceId,
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString(),
                thumbnailUrl: c.thumbnailUrl || undefined,
            }))
        };
    }
    async create(workspace) {
        const created = await prismaClient_1.prisma.workspace.create({
            data: {
                id: workspace.id,
                name: workspace.name,
                createdAt: new Date(workspace.createdAt),
                updatedAt: new Date(workspace.updatedAt),
                ownerId: workspace.ownerId,
            },
            include: { canvases: true }
        });
        return {
            id: created.id,
            name: created.name,
            createdAt: created.createdAt.toISOString(),
            updatedAt: created.updatedAt.toISOString(),
            ownerId: created.ownerId,
            canvases: []
        };
    }
    async createCanvas(workspaceId, canvas) {
        const created = await prismaClient_1.prisma.canvasMetadata.create({
            data: {
                id: canvas.id,
                title: canvas.title,
                workspaceId: workspaceId,
                createdAt: new Date(canvas.createdAt),
                updatedAt: new Date(canvas.updatedAt),
                thumbnailUrl: canvas.thumbnailUrl || null,
            }
        });
        return {
            id: created.id,
            title: created.title,
            workspaceId: created.workspaceId,
            createdAt: created.createdAt.toISOString(),
            updatedAt: created.updatedAt.toISOString(),
            thumbnailUrl: created.thumbnailUrl || undefined,
        };
    }
    async findCanvasById(canvasId) {
        const canvas = await prismaClient_1.prisma.canvasMetadata.findUnique({
            where: { id: canvasId }
        });
        if (!canvas)
            return null;
        return {
            id: canvas.id,
            title: canvas.title,
            workspaceId: canvas.workspaceId,
            createdAt: canvas.createdAt.toISOString(),
            updatedAt: canvas.updatedAt.toISOString(),
            thumbnailUrl: canvas.thumbnailUrl || undefined,
        };
    }
    async updateCanvasThumbnail(canvasId, thumbnailUrl) {
        const updated = await prismaClient_1.prisma.canvasMetadata.update({
            where: { id: canvasId },
            data: { thumbnailUrl }
        });
        if (!updated)
            return null;
        return {
            id: updated.id,
            title: updated.title,
            workspaceId: updated.workspaceId,
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
            thumbnailUrl: updated.thumbnailUrl || undefined,
        };
    }
}
exports.WorkspaceRepository = WorkspaceRepository;
