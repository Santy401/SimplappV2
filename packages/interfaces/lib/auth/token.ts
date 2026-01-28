import { SignJWT, jwtVerify } from 'jose';
import { prisma } from '../prisma';
import { env } from '../env';
import crypto from 'crypto';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

const getAccessTokenSecret = () => new TextEncoder().encode(env.JWT_SECRET);
const getRefreshTokenSecret = () => new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export async function generateAccessToken(userId: string, email: string) {
  return await new SignJWT({ 
    id: userId, 
    email,
    type: 'access' 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setIssuedAt()
    .setSubject(userId.toString())
    .sign(getAccessTokenSecret());
}

export async function generateRefreshToken(userId: string) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
  
  return token;
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getAccessTokenSecret());
    return payload;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
    
    if (!refreshToken) {
      return null;
    }
    
    if (refreshToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: refreshToken.id } });
      return null;
    }
    
    return refreshToken;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

export async function revokeRefreshToken(token: string) {
  try {
    await prisma.refreshToken.delete({ where: { token } });
    return true;
  } catch (error) {
    console.error('Failed to revoke refresh token:', error);
    return false;
  }
}

export async function revokeAllUserTokens(userId: string) {
  try {
    await prisma.refreshToken.deleteMany({ where: { userId } });
    return true;
  } catch (error) {
    console.error('Failed to revoke all tokens:', error);
    return false;
  }
}

export async function cleanExpiredTokens() {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    console.log(`Cleaned ${result.count} expired tokens`);
    return result.count;
  } catch (error) {
    console.error('Failed to clean expired tokens:', error);
    return 0;
  }
}