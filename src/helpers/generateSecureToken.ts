import crypto from 'crypto';

export const generateSecureToken = (expiresInMs: number) => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expires = new Date(Date.now() + expiresInMs);

  return { rawToken, hashedToken, expires };
};

export const hashToken = (rawToken: string): string => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};