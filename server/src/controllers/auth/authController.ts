"use strict";

import type { Request, Response } from "express";
import User from "../../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../../helpers/generateJwt.js";
import type { RefreshTokenPayload } from "../../helpers/generateJwt.js";
import CustomError from "../../helpers/customError.js";
import jwt from "jsonwebtoken";
import { toUserDTO } from "../../helpers/toUserDTO.js";

import { welcomeTemplate } from "../../mail/templates/welcome.template.js";
import { sendMail } from "../../mail/mail.service.js";
import { generateSecureToken, hashToken } from "../../helpers/generateSecureToken.js";
import { resetPasswordTemplate } from "../../mail/templates/resetPassword.template.js";
import type {
  CreateUserInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../../validations/user.schema.js";

const authController = {
  login: async (req: Request<{}, any, LoginInput>, res: Response) => {
    const validatedData = req.body;

    // console.log('validatedData', validatedData)

    const user = await User.findOne({
      $or: [{ email: validatedData.login }, { username: validatedData.login }],
    }).select("+password");

    console.log("user", user);

    if (!user) throw new CustomError("Wrong email/username or password", 401);

    //password compare
    const isMatchingPassword = await user.matchPassword(validatedData.password);

    if (!isMatchingPassword) {
      throw new CustomError("Invalid email or password.", 404);
    }

    if (!user.isActive) throw new CustomError("The user status is not active", 401);

    // if (!user.isEmailVerified)
    //   throw new CustomError("The user email is not verified", 401);

    //token create
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log("tokens", refreshToken);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //normalde localde http uzerinde calisiyoruz. ama production asamasinda https uzerinde calismasi icin sadece. browser cookieyi kabul etmiyor bunu yazinca http de.
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).send({
      error: false,
      accessToken,
      user: toUserDTO(user),
    });
  },

  register: async (req: Request<{}, any, CreateUserInput>, res: Response) => {
    const validatedData = req.body;
    // console.log('validate data', validatedData)

    const userExists = await User.findOne({
      $or: [{ email: validatedData.email }, { username: validatedData.username }],
    });

    if (userExists) {
      throw new CustomError("Email or username is already registered.", 409);
    }

    const newUser = await User.create(validatedData);

    // console.log('newUser', newUser)

    //token create
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;

    const { rawToken, hashedToken, expires } = generateSecureToken(24 * 60 * 60 * 1000);
    newUser.emailVerifyToken = hashedToken;
    newUser.emailVerifyExp = expires;

    await newUser.save();

    const verifyUrl = `${process.env.API_URL || "http://localhost:8000"}/api/v1/auth/verify-email/${rawToken}`;

    //mail
    try {
      const mail = await sendMail({
        to: newUser.email,
        subject: "Willkommen bei Kitzaa",
        html: welcomeTemplate({ username: newUser.username, verifyUrl}),
      });

      // console.log("mail", mail);
    } catch (error) {
      console.log("Failed to send email.", error);
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).send({
      error: false,
      new: true,
      accessToken,
      user: toUserDTO(newUser),
    });
  },

  logout: async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id);

    if (!user) throw new CustomError("User must first login", 401);

    res.clearCookie("refreshToken");

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.status(200).send({
      error: false,
      message: "logout is successful",
    });
  },

  refresh: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new CustomError("Refresh token is missing.", 400);

    try {
      const refreshData = jwt.verify(refreshToken, process.env.REFRESH_KEY!) as RefreshTokenPayload;
      const user = await User.findById(refreshData.id).select("+refreshToken"); // refreshtoken in basina arti koymamin sebebi schemada bu kisim select:false oldugu cin.
      if (!user) throw new CustomError("Refresh data is not valid.", 401);
      if (!user.isActive) throw new CustomError("This account is banned.", 401);
      if (user.refreshToken !== refreshToken) throw new CustomError("Refresh token is not valid.", 401);

      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).send({
        error: false,
        accessToken,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new CustomError(`JWT Error: ${message}`, 401);
    }
  },

  forgotPassword: async (req: Request<{}, any, ForgotPasswordInput>, res: Response) => {
    const { email } = req.body;

    const genericResponse = {
      error: "false",
      message: "Falls die E-Mail-Adresse existiert, wurde ein Link zum Zurücksetzen des Passworts gesendet.",
    };

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const { rawToken, hashedToken, expires } = generateSecureToken(30 * 60 * 1000);

    user.passwordResetToken = hashedToken;
    user.passwordResetExp = expires;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    try {
      await sendMail({
        to: user.email,
        subject: "Passwort zurücksetzen",
        html: resetPasswordTemplate({ username: user.username, resetUrl }),
      });
    } catch (mailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExp = undefined;
      await user.save();

      console.log("Failed to send email.", mailError);
      throw new CustomError("E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut.", 500);
    }

    res.status(200).json(genericResponse);
  },

  resetPassword: async (req: Request<{ token: string }, any, ResetPasswordInput>, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExp: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires +password");

    if (!user) {
      throw new CustomError("Der Link ist ungültig oder abgelaufen.", 400);
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExp = null;
    await user.save();

    res.status(200).json({
      error: "false",
      message: "Passwort erfolgreich geändert.",
    });
  },

  verifyEmail: async (req: Request<{ token: string }>, res: Response) => {
    const { token } = req.params;

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExp: { $gt: new Date() },
    }).select("+emailVerifyToken +emailVerifyExp");

    if (!user) {
      throw new CustomError("Der Link ist ungültig oder abgelaufen.", 400);
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = null;
    user.emailVerifyExp = null;
    await user.save();

    res.status(200).json({
      error: false,
      message: "E-Mail erfolgreich bestätigt.",
    });
  },
};

export default authController;
