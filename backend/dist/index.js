"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const hpp_1 = __importDefault(require("hpp"));
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const prismaClient_1 = require("./infrastructure/prismaClient");
async function checkDatabaseConnection() {
    try {
        await prismaClient_1.prisma.$connect();
        return true;
    }
    catch (error) {
        return false;
    }
}
async function startApolloServer() {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    // --- Security Middleware ---
    // 1. HTTP Security Headers
    app.use((0, helmet_1.default)({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }));
    // 2. HTTP Parameter Pollution Protection
    app.use((0, hpp_1.default)());
    // 3. Rate Limiting (Global or specific to /graphql)
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 500, // Limit each IP to 500 requests per window
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/graphql', limiter);
    const isProduction = process.env.NODE_ENV === 'production';
    const server = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        introspection: !isProduction, // Disable schema introspection in production
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    await server.start();
    app.use('/graphql', (0, cors_1.default)(), body_parser_1.default.json(), (req, res, next) => {
        req.body = req.body || {};
        next();
    }, 
    // @ts-ignore - Bypass type conflict between Apollo and Express versions
    (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
    }));
    const PORT = process.env.PORT || 4000;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
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
