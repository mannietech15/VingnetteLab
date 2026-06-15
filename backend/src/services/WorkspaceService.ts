import { WorkspaceRepository } from '../repositories/WorkspaceRepository';
import { Workspace, CanvasMetadata } from '../domain/types';

export class WorkspaceService {
  private repository = new WorkspaceRepository();

  public async getWorkspaces(): Promise<Workspace[]> {
    return this.repository.findAll();
  }

  public async getWorkspacesByOwner(ownerId: string): Promise<Workspace[]> {
    return this.repository.findByOwnerId(ownerId);
  }

  public async getWorkspaceById(id: string): Promise<Workspace | undefined> {
    return this.repository.findById(id);
  }

  public async getCanvasById(id: string): Promise<CanvasMetadata | null> {
    return this.repository.findCanvasById(id);
  }

  public async createWorkspace(name: string, ownerId: string): Promise<Workspace> {
    const newWorkspace = {
      id: `ws_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId,
    };
    return this.repository.create(newWorkspace);
  }

  public async createCanvas(workspaceId: string, title: string): Promise<CanvasMetadata> {
    const newCanvas: CanvasMetadata = {
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

  public async updateCanvasThumbnail(id: string, thumbnailUrl: string): Promise<CanvasMetadata> {
    const updated = await this.repository.updateCanvasThumbnail(id, thumbnailUrl);
    if (!updated) {
      throw new Error('Canvas not found');
    }
    return updated;
  }

  public async updateCanvasTitle(id: string, title: string): Promise<CanvasMetadata> {
    const updated = await this.repository.updateCanvasTitle(id, title);
    if (!updated) {
      throw new Error('Canvas not found');
    }
    return updated;
  }

  public async deleteCanvas(id: string): Promise<boolean> {
    const deleted = await this.repository.deleteCanvas(id);
    if (!deleted) {
      throw new Error('Canvas not found');
    }
    return true;
  }
}
