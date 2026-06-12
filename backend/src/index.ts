import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import passport from 'passport';
import './auth';
import { generateOAuthToken } from './auth';

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

  // --- Security Middleware ---
  // 1. HTTP Security Headers
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  }));

  // 2. HTTP Parameter Pollution Protection
  app.use(hpp());

  // 3. Rate Limiting (Global or specific to /graphql)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/graphql', limiter);

  // --- OAuth Routes ---
  app.use(passport.initialize());

  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:9800';

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  app.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=true` }),
    function(req, res) {
      const token = generateOAuthToken(req.user);
      res.redirect(`${FRONTEND_URL}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    }
  );

  app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

  app.get('/auth/github/callback', 
    passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=true` }),
    function(req, res) {
      const token = generateOAuthToken(req.user);
      res.redirect(`${FRONTEND_URL}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: !isProduction, // Disable schema introspection in production
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    (req, res, next) => {
      req.body = req.body || {};
      next();
    },
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
