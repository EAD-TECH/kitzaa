import CustomError from "../helpers/customError.js";
import { generateSecureToken } from "../helpers/generateSecureToken.js";
import User from "../models/userModel.js";

interface CreateAdminUserDTO {
  email: string;
  role: "user" | "organizer" | "admin";
}

export const createAdminUser = async ({ email, role }: CreateAdminUserDTO) => {
  const isEmailExists = await User.findOne({ email });

  if (isEmailExists) {
    throw new CustomError("Email is already registered.", 409);
  }

  const localPart = email.trim().split("@")[0];
  if (!localPart) throw new CustomError("hata"); // "elif.yildiz"
  const nameParts = localPart.split(/[._-]/); // ["elif", "yildiz"]

  let randomSayi = Math.floor(Math.random() * 1000);
  const baseUserName = `${localPart}${randomSayi}`;

  let firstName;
  let lastName = nameParts.pop();

  if (!nameParts.length) {
    firstName = lastName;
    lastName = "-";
  } else {
    firstName = nameParts.join(" ");
  }
  let tempPassword = "Temp123!Kitzaa";

  const dummyLocation = {
    state: "Pending",
    city: "Pending",
    zipCode: "00000",
    country: "DE",
  };

  const { rawToken, hashedToken, expires } = generateSecureToken(
    24 * 60 * 60 * 1000,
  );

  const newUser = await User.create({
    username: baseUserName,
    firstName: firstName,
    lastName: lastName,
    email,
    role,
    password: tempPassword,
    passwordResetToken: hashedToken,
    passwordResetExp: expires,
    location: dummyLocation,
  });
  return { user: newUser, rawToken };
};
