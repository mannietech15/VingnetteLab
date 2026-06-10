import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import { prisma } from './infrastructure/prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:9800';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      const email = profile.emails && profile.emails[0].value;
      if (!email) return cb(new Error("No email found from Google") as any, undefined);

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName,
            password: '', // OAuth users might not have a password
            avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
          }
        });
      }
      return cb(null, user as any);
    } catch (err: any) {
      return cb(err, undefined);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'YOUR_GITHUB_CLIENT_SECRET',
    callbackURL: "/auth/github/callback",
    scope: ['user:email']
  },
  async function(accessToken: string, refreshToken: string, profile: any, cb: any) {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      if (!email) return cb(new Error("No email found from GitHub. Make sure your email is public."));

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || profile.username,
            password: '', // OAuth users might not have a password
            avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
          }
        });
      }
      return cb(null, user as any);
    } catch (err: any) {
      return cb(err, undefined);
    }
  }
));

export const generateOAuthToken = (user: any) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
};
