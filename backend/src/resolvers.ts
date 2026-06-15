import { WorkspaceService } from './services/WorkspaceService';
import { UserService } from './services/UserService';

const workspaceService = new WorkspaceService();
const userService = new UserService();

export const resolvers = {
  Query: {
    me: (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return userService.getUserById(context.user.userId);
    },
    workspaces: (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return workspaceService.getWorkspacesByOwner(context.user.userId);
    },
    workspace: (_: any, { id }: { id: string }) => workspaceService.getWorkspaceById(id),
    canvas: (_: any, { id }: { id: string }) => workspaceService.getCanvasById(id)
  },
  Mutation: {
    createWorkspace: (_: any, { name }: { name: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return workspaceService.createWorkspace(name, context.user.userId);
    },
    createCanvas: (_: any, { workspaceId, title }: { workspaceId: string, title: string }) => {
      return workspaceService.createCanvas(workspaceId, title);
    },
    updateCanvasThumbnail: (_: any, { id, thumbnailUrl }: { id: string, thumbnailUrl: string }) => {
      return workspaceService.updateCanvasThumbnail(id, thumbnailUrl);
    },
    updateCanvasTitle: (_: any, { id, title }: { id: string, title: string }) => {
      return workspaceService.updateCanvasTitle(id, title);
    },
    deleteCanvas: (_: any, { id }: { id: string }) => {
      return workspaceService.deleteCanvas(id);
    },
    signup: (_: any, { email, password, name, ipAddress }: { email: string, password: string, name?: string, ipAddress?: string }) => {
      return userService.signup(email, password, name, ipAddress);
    },
    login: (_: any, { email, password }: { email: string, password: string }) => {
      return userService.login(email, password);
    }
  }
};
