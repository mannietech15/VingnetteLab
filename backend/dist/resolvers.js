// Mock data for development
const workspaces = [
    {
        id: 'ws_1',
        name: 'Personal Space',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: 'usr_1',
        canvases: [
            {
                id: 'cv_1',
                title: 'Q2 Roadmap',
                workspaceId: 'ws_1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        ]
    }
];
export const resolvers = {
    Query: {
        me: () => ({ id: 'usr_1', email: 'test@vignettelab.com', name: 'Test User' }),
        workspaces: () => workspaces,
        workspace: (_, { id }) => workspaces.find(w => w.id === id),
        canvas: (_, { id }) => {
            for (const w of workspaces) {
                const c = w.canvases.find(c => c.id === id);
                if (c)
                    return c;
            }
            return null;
        }
    },
    Mutation: {
        createWorkspace: (_, { name }) => {
            const newWs = {
                id: `ws_${Date.now()}`,
                name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ownerId: 'usr_1',
                canvases: []
            };
            workspaces.push(newWs);
            return newWs;
        },
        createCanvas: (_, { workspaceId, title }) => {
            const ws = workspaces.find(w => w.id === workspaceId);
            if (!ws)
                throw new Error('Workspace not found');
            const newCanvas = {
                id: `cv_${Date.now()}`,
                title,
                workspaceId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            ws.canvases.push(newCanvas);
            return newCanvas;
        },
        updateCanvasThumbnail: (_, { id, thumbnailUrl }) => {
            for (const w of workspaces) {
                const c = w.canvases.find(c => c.id === id);
                if (c) {
                    c.thumbnailUrl = thumbnailUrl;
                    c.updatedAt = new Date().toISOString();
                    return c;
                }
            }
            throw new Error('Canvas not found');
        }
    }
};
