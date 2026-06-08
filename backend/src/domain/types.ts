export interface User {
  id: string;
  email: string;
  password?: string;
  ipAddress?: string;
  name?: string;
  avatarUrl?: string;
}

export interface CanvasMetadata {
  id: string;
  title: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  canvases: CanvasMetadata[];
}
