import "dotenv/config";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import User from "../src/models/userModel.js";

const ADMIN_DATA = {
  username: "admin",
  firstName: "Admin",
  lastName: "User",
  email: "admin@kitzaa.dev",
  password: "Admin123!",
  role: "admin" as const,
  isEmailVerified: true,
  location: {
    state: "Berlin",
    city: "Berlin",
    zipCode: "10115",
    country: "DE",
  },
};

async function run() {
  await dbConnection();

  const existing = await User.findOne({
    $or: [{ email: ADMIN_DATA.email }, { username: ADMIN_DATA.username }],
  });

  if (existing) {
    console.log(`Bir kullanıcı zaten mevcut (role: ${existing.role}), işlem iptal edildi.`);
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create(ADMIN_DATA);

  console.log("Admin kullanıcı oluşturuldu:");
  console.log(`  username: ${admin.username}`);
  console.log(`  email: ${admin.email}`);
  console.log(`  password: ${ADMIN_DATA.password}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
