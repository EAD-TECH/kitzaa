"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
import userModel from "../models/userModel";
import { generateAccessToken, generateRefreshToken } from "../helpers/generateJwt";
import CustomError from "../helpers/customError";


module.exports = {
  login: async (req, res) => {

    const { username, email, password } = req.body;

    if (!((username || email) && password))
      throw new CustomError(
        "Username or email and password are required.",
        401,
      );

    const user = await User.findOne({
      $or: [{ email }, { username }],
      password,
    });

    if (!user) throw new CustomError("Wrong email/username or password", 401);

    if (!user.isActive)
      throw new CustomError("The user status is not active", 401);

    if(!user.isEmailVerified)
      throw new CustomError("The user email is not verified", 401);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).send({
      error: false,
      bearer: { access: accessToken, refresh: refreshToken },
    });
  },

  logout: (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) throw new CustomError("User must first login", 401);

    if (user) {
    user.refreshToken = null
    await user.save()
  }

    res.status(200).send({
      error: false,
      message: "Logout successfull.",
    });
  },

  refresh: (req, res) => {


    const { refresh } = req.body;

    if (!refresh) throw new CustomError("Refresh token is missing.", 400);

    jwt.verify(refresh, process.env.REFRESH_KEY, async (err, refreshData) => {
      if (err) return next(new CustomError(`JWT Error: ${err.message}`, 401));

      const user = await User.findById(refreshData._id);

      if (!user)
        return next(new CustomError("Refresh data is not valid.", 401));

      if (!user.isActive)
        return next(new CustomError("This account is banned.", 401));

      const accessData = {
        _id: user._id,
        username: user.username,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
      };

      const access = jwt.sign(accessData, process.env.ACCESS_KEY, {
        expiresIn: "1m",
      });

      res.status(200).send({
        error: false,
        bearer: { access },
      });
    });
  },
};