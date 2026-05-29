import { WorkspaceRepository } from '../repositories/WorkspaceRepository';
import { Workspace, CanvasMetadata } from '../domain/types';

export class WorkspaceService {
  private repository = new WorkspaceRepository();

  public getWorkspaces(): Workspace[] {
    return this.repository.findAll();
  }

  public getWorkspaceById(id: string): Workspace | undefined {
    return this.repository.findById(id);
  }

  public getCanvasById(id: string): CanvasMetadata | null {
    return this.repository.findCanvasById(id);
  }

  public createWorkspace(name: string, ownerId: string): Workspace {
    const newWorkspace: Workspace = {
      id: `ws_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId,
      canvases: [],
    };
    return this.repository.create(newWorkspace);
  }

  public createCanvas(workspaceId: string, title: string): CanvasMetadata {
    const newCanvas: CanvasMetadata = {
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

  public updateCanvasThumbnail(id: string, thumbnailUrl: string): CanvasMetadata {
    const updated = this.repository.updateCanvasThumbnail(id, thumbnailUrl);
    if (!updated) {
      throw new Error('Canvas not found');
    }
    return updated;
  }
}
