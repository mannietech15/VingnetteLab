import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

import { prisma } from './infrastructure/prismaClient';

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    return false;
  }
}

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    // @ts-ignore - Bypass type conflict between Apollo and Express versions
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }) as express.RequestHandler,
  );

  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  
  const dbConnected = await checkDatabaseConnection();
  
  console.log('\n=============================================');
  console.log('🔮 VignetteLab Backend Status');
  console.log('=============================================');
  console.log(`[${dbConnected ? '🟢' : '🔴'}] PostgreSQL Database (${dbConnected ? 'Connected' : 'Disconnected'})`);
  console.log(`[🟢] GraphQL Server      (http://localhost:${PORT}/graphql)`);
  console.log(`[🟢] Express API         (Port ${PORT})`);
  console.log('=============================================\n');
}

startApolloServer().catch((err) => {
  console.error('Failed to start server', err);
});
