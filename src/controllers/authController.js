"use strict"

import User from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/generateJwt.js";
import CustomError from "../helpers/customError.js";
import jwt from "jsonwebtoken";
import { toUserDTO } from "../helpers/toUserDTO.js";


const authController = {

  login: async (req, res) => {

    const validatedData = req.body;

    // console.log('validatedData', validatedData)

    const user = await User.findOne({
      $or: [
        { email: validatedData.login },
        { username: validatedData.login }
      ]
    }).select("+password")

    console.log('user', user)

    if (!user) throw new CustomError("Wrong email/username or password", 401);



    //password compare
    const isMatchingPassword = await user.matchPassword(validatedData.password)

    if (!isMatchingPassword) {
      throw new CustomError('Invalid email or password.', 404)
    }

    if (!user.isActive)
      throw new CustomError("The user status is not active", 401);

    // if (!user.isEmailVerified)
    //   throw new CustomError("The user email is not verified", 401);

    //token create
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log('tokens', refreshToken)

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', //normalde localde http uzerinde calisiyoruz. ama production asamasinda https uzerinde calismasi icin sadece. browser cookieyi kabul etmiyor bunu yazinca http de.
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).send({
      error: false,
      accessToken,
      user: toUserDTO(user)
    })
  },

  register: async (req, res) => {

    const validatedData = req.body;
    // console.log('validate data', validatedData)

    const userExists = await User.findOne({
      $or: [{ email: validatedData.email }, { username: validatedData.username }],
    });

    if (userExists) {
      throw new CustomError('Email or username is already registered.', 409);
    }

    const newUser = await User.create(validatedData)

    // console.log('newUser', newUser)

    //token create
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken
    await newUser.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).send({
      error: false,
      new: true,
      accessToken,
      user: toUserDTO(newUser),
    })

  },


  logout: async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) throw new CustomError("User must first login", 401);

    res.clearCookie('refreshToken');

    if (user) {  
      user.refreshToken = null
      await user.save()
    }

    res.status(200).send({
      error: false,
      message: 'logout is successful'
    });
  },


  refresh: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new CustomError("Refresh token is missing.", 400);

    try {
      const refreshData = jwt.verify(refreshToken, process.env.REFRESH_KEY);
      const user = await User.findById(refreshData.id).select("+refreshToken");  // refreshtoken in basina arti koymamin sebebi schemada bu kisim select:false oldugu cin.
      if (!user) throw new CustomError("Refresh data is not valid.", 401);
      if (!user.isActive) throw new CustomError("This account is banned.", 401);
      if (user.refreshToken !== refreshToken)
        throw new CustomError("Refresh token is not valid.", 401);

      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).send({
        error: false,
        accessToken
      });

    } catch (err) {
      throw new CustomError(`JWT Error: ${err.message}`, 401);
    }
  },

};

export default authController;