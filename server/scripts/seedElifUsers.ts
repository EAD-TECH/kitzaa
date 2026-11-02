import "dotenv/config";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import User from "../src/models/userModel.js";

function readRequiredPassword(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `${name} is missing. Set it in the environment before running this script.`,
    );
  }
  return value;
}

const adminPassword = readRequiredPassword("SEED_ADMIN_PASSWORD");
const userPassword = readRequiredPassword("SEED_USER_PASSWORD");

const ELIF_ACCOUNTS = [
  {
    username: "elif.admin",
    firstName: "Elif",
    lastName: "Yuzer",
    email: "elif.admin@example.com",
    password: adminPassword,
    role: "admin" as const,
    isEmailVerified: true,
    location: {
      state: "Berlin",
      city: "Berlin",
      zipCode: "10115",
      country: "DE",
    },
  },
  {
    username: "elif.user",
    firstName: "Elif",
    lastName: "User",
    email: "elif.user@example.com",
    password: userPassword,
    role: "user" as const,
    isEmailVerified: true,
    location: {
      state: "Berlin",
      city: "Berlin",
      zipCode: "10115",
      country: "DE",
    },
  },
];

async function run() {
  await dbConnection();

  for (const account of ELIF_ACCOUNTS) {
    await User.deleteMany({
      $or: [{ email: account.email }, { username: account.username }],
    });
    const created = await User.create(account);
    console.log(`${created.role}: ${created.username} (${created.email})`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
