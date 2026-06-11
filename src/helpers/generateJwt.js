'use strict';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  const accessData = {
    _id: user._id,
    username: user.username,
    isActive: user.isActive,
    role: user.role,
    institutionId: user.institutionId,
  };

  return jwt.sign(accessData, process.env.ACCESS_KEY, { expiresIn: '1d' });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_KEY, {
    expiresIn: '7d',
  });
};
