'use strict';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import type { UserDocument } from '../types/user.types.js';

export interface AccessTokenPayload {
  _id: Types.ObjectId;
  username: string;
  isActive: boolean;
  role: 'user' | 'organizer' | 'admin';
  institutionId?: Types.ObjectId | null;
}

export interface RefreshTokenPayload {
  id: Types.ObjectId;
}

export const generateAccessToken = (user: UserDocument): string => {
  const accessData: AccessTokenPayload = {
    _id: user._id,
    username: user.username,
    isActive: user.isActive,
    role: user.role,
    institutionId: user.institutionId,
  };

  return jwt.sign(accessData, process.env.ACCESS_KEY!, { expiresIn: '1d' });
};

export const generateRefreshToken = (user: UserDocument): string => {
  return jwt.sign({ id: user._id } satisfies RefreshTokenPayload, process.env.REFRESH_KEY!, {
    expiresIn: '7d',
  });
};
