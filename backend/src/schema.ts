export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Workspace {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    ownerId: ID!
    canvases: [CanvasMetadata!]!
  }

  type CanvasMetadata {
    id: ID!
    title: String!
    workspaceId: ID!
    createdAt: String!
    updatedAt: String!
    thumbnailUrl: String
  }

  type Query {
    me: User
    workspaces: [Workspace!]!
    workspace(id: ID!): Workspace
    canvas(id: ID!): CanvasMetadata
  }

  type Mutation {
    createWorkspace(name: String!): Workspace!
    createCanvas(workspaceId: ID!, title: String!): CanvasMetadata!
    updateCanvasThumbnail(id: ID!, thumbnailUrl: String!): CanvasMetadata!
    updateCanvasTitle(id: ID!, title: String!): CanvasMetadata!
    deleteCanvas(id: ID!): Boolean!
    signup(email: String!, password: String!, name: String, ipAddress: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;
