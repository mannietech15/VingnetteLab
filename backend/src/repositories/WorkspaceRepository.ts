import { JsonDatabase } from '../infrastructure/JsonDatabase';
import { Workspace, CanvasMetadata } from '../domain/types';

export class WorkspaceRepository {
  private db = JsonDatabase.getInstance();

  public findAll(): Workspace[] {
    return this.db.getData().workspaces;
  }

  public findById(id: string): Workspace | undefined {
    return this.db.getData().workspaces.find((w) => w.id === id);
  }

  public create(workspace: Workspace): Workspace {
    this.db.getData().workspaces.push(workspace);
    this.db.saveData();
    return workspace;
  }

  public createCanvas(workspaceId: string, canvas: CanvasMetadata): CanvasMetadata | null {
    const workspace = this.findById(workspaceId);
    if (!workspace) return null;
    
    workspace.canvases.push(canvas);
    this.db.saveData();
    return canvas;
  }

  public findCanvasById(canvasId: string): CanvasMetadata | null {
    const workspaces = this.db.getData().workspaces;
    for (const w of workspaces) {
      const canvas = w.canvases.find(c => c.id === canvasId);
      if (canvas) return canvas;
    }
    return null;
  }

  public updateCanvasThumbnail(canvasId: string, thumbnailUrl: string): CanvasMetadata | null {
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
