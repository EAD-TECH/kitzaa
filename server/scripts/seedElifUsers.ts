import "dotenv/config";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import User from "../src/models/userModel.js";

const ELIF_ACCOUNTS = [
  {
    username: "elif.admin",
    firstName: "Elif",
    lastName: "Yuzer",
    email: "elif.admin@example.com",
    password: "ElifAdmin2026!",
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
    password: "Kitzaa2026!",
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
    console.log(
      `${created.role}: ${created.username} / ${account.password} (${created.email})`,
    );
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
