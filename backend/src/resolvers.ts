import { WorkspaceService } from './services/WorkspaceService';
import { UserService } from './services/UserService';

const workspaceService = new WorkspaceService();
const userService = new UserService();

export const resolvers = {
  Query: {
    me: () => userService.getUserById('usr_1'),
    workspaces: () => workspaceService.getWorkspaces(),
    workspace: (_: any, { id }: { id: string }) => workspaceService.getWorkspaceById(id),
    canvas: (_: any, { id }: { id: string }) => workspaceService.getCanvasById(id)
  },
  Mutation: {
    createWorkspace: (_: any, { name }: { name: string }) => {
      // Hardcoding 'usr_1' for now since we don't have true auth context
      return workspaceService.createWorkspace(name, 'usr_1');
    },
    createCanvas: (_: any, { workspaceId, title }: { workspaceId: string, title: string }) => {
      return workspaceService.createCanvas(workspaceId, title);
    },
    updateCanvasThumbnail: (_: any, { id, thumbnailUrl }: { id: string, thumbnailUrl: string }) => {
      return workspaceService.updateCanvasThumbnail(id, thumbnailUrl);
    }
  }
};
