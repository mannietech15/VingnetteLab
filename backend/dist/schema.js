"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
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
    signup(email: String!, password: String!, name: String, ipAddress: String): User!
  }
`;
