import { prisma } from '../infrastructure/prismaClient';
import { Workspace, CanvasMetadata } from '../domain/types';

export class WorkspaceRepository {
  public async findAll(): Promise<Workspace[]> {
    const workspaces = await prisma.workspace.findMany({
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

  public async findByOwnerId(ownerId: string): Promise<Workspace[]> {
    const workspaces = await prisma.workspace.findMany({
      where: { ownerId },
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

  public async findById(id: string): Promise<Workspace | undefined> {
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: { canvases: true }
    });
    if (!workspace) return undefined;
    
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

  public async create(workspace: Omit<Workspace, 'canvases'>): Promise<Workspace> {
    const created = await prisma.workspace.create({
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

  public async createCanvas(workspaceId: string, canvas: CanvasMetadata): Promise<CanvasMetadata | null> {
    const created = await prisma.canvasMetadata.create({
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

  public async findCanvasById(canvasId: string): Promise<CanvasMetadata | null> {
    const canvas = await prisma.canvasMetadata.findUnique({
      where: { id: canvasId }
    });
    if (!canvas) return null;
    return {
      id: canvas.id,
      title: canvas.title,
      workspaceId: canvas.workspaceId,
      createdAt: canvas.createdAt.toISOString(),
      updatedAt: canvas.updatedAt.toISOString(),
      thumbnailUrl: canvas.thumbnailUrl || undefined,
      data: canvas.data || undefined,
    };
  }

  public async updateCanvasThumbnail(canvasId: string, thumbnailUrl: string): Promise<CanvasMetadata | null> {
    const updated = await prisma.canvasMetadata.update({
      where: { id: canvasId },
      data: { thumbnailUrl }
    });
    if (!updated) return null;
    return {
      id: updated.id,
      title: updated.title,
      workspaceId: updated.workspaceId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      thumbnailUrl: updated.thumbnailUrl || undefined,
    };
  }

  public async updateCanvasTitle(canvasId: string, title: string): Promise<CanvasMetadata | null> {
    const updated = await prisma.canvasMetadata.update({
      where: { id: canvasId },
      data: { title }
    });
    if (!updated) return null;
    return {
      id: updated.id,
      title: updated.title,
      workspaceId: updated.workspaceId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      thumbnailUrl: updated.thumbnailUrl || undefined,
    };
  }

  public async deleteCanvas(canvasId: string): Promise<boolean> {
    try {
      await prisma.canvasMetadata.delete({
        where: { id: canvasId }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  public async saveCanvas(canvasId: string, data: string): Promise<CanvasMetadata | null> {
    const updated = await prisma.canvasMetadata.update({
      where: { id: canvasId },
      data: { data }
    });
    if (!updated) return null;
    return {
      id: updated.id,
      title: updated.title,
      workspaceId: updated.workspaceId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      thumbnailUrl: updated.thumbnailUrl || undefined,
      data: updated.data || undefined,
    };
  }
}
