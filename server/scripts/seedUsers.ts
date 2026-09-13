import "dotenv/config";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import User from "../src/models/userModel.js";

const ADMIN = {
  username: "adminAyla",
  firstName: "Ayla",
  lastName: "Admin",
  email: "adminayla@example.com",
  password: "AdminAyla2026!",
  role: "admin" as const,
  isEmailVerified: true,
  location: { state: "Berlin", city: "Berlin", zipCode: "10115", country: "DE" },
};

const CITIES = [
  { state: "Berlin", city: "Berlin", zipCode: "10115" },
  { state: "Bayern", city: "München", zipCode: "80331" },
  { state: "Hamburg", city: "Hamburg", zipCode: "20095" },
  { state: "Nordrhein-Westfalen", city: "Köln", zipCode: "50667" },
  { state: "Hessen", city: "Frankfurt am Main", zipCode: "60311" },
  { state: "Baden-Württemberg", city: "Stuttgart", zipCode: "70173" },
  { state: "Nordrhein-Westfalen", city: "Düsseldorf", zipCode: "40210" },
  { state: "Sachsen", city: "Leipzig", zipCode: "04109" },
  { state: "Sachsen", city: "Dresden", zipCode: "01067" },
  { state: "Bayern", city: "Nürnberg", zipCode: "90402" },
];

// role "organizer" olan kullanicilar seedEvents.ts icinde createdBy olarak kullanilir.
const USERS: { firstName: string; lastName: string; role: "user" | "organizer" }[] = [
  { firstName: "Lukas", lastName: "Fischer", role: "organizer" },
  { firstName: "Mia", lastName: "Schmidt", role: "user" },
  { firstName: "Finn", lastName: "Wagner", role: "organizer" },
  { firstName: "Emma", lastName: "Becker", role: "user" },
  { firstName: "Noah", lastName: "Hoffmann", role: "user" },
  { firstName: "Sophia", lastName: "Koch", role: "organizer" },
  { firstName: "Elias", lastName: "Richter", role: "user" },
  { firstName: "Hannah", lastName: "Klein", role: "user" },
  { firstName: "Leon", lastName: "Wolf", role: "organizer" },
  { firstName: "Lea", lastName: "Schröder", role: "user" },
  { firstName: "Paul", lastName: "Neumann", role: "user" },
  { firstName: "Marie", lastName: "Schwarz", role: "organizer" },
  { firstName: "Ben", lastName: "Zimmermann", role: "user" },
  { firstName: "Lina", lastName: "Braun", role: "user" },
  { firstName: "Jonas", lastName: "Krüger", role: "organizer" },
  { firstName: "Klara", lastName: "Hofmann", role: "user" },
  { firstName: "Felix", lastName: "Lange", role: "user" },
  { firstName: "Ella", lastName: "Schmitt", role: "organizer" },
  { firstName: "Tim", lastName: "Werner", role: "user" },
  { firstName: "Nora", lastName: "Meyer", role: "organizer" },
];

const USER_PASSWORD = "Kitzaa2026!";

async function run() {
  await dbConnection();

  const { deletedCount } = await User.deleteMany({
    email: { $in: [ADMIN.email, ...USERS.map((u) => `${u.firstName}.${u.lastName}`.toLowerCase() + "@example.com")] },
  });
  console.log(`${deletedCount} mevcut seed kullanıcısı silindi.`);

  const admin = await User.create(ADMIN);
  console.log(`Admin oluşturuldu: ${admin.username} / ${ADMIN.password}`);

  for (const [i, u] of USERS.entries()) {
    const location = CITIES[i % CITIES.length]!;
    const username = `${u.firstName}.${u.lastName}`.toLowerCase();

    await User.create({
      username,
      firstName: u.firstName,
      lastName: u.lastName,
      email: `${username}@example.com`,
      password: USER_PASSWORD,
      role: u.role,
      isEmailVerified: true,
      location,
    });
    console.log(`"${username}" (${u.role}) oluşturuldu.`);
  }

  console.log(`\nToplam: 1 admin + ${USERS.length} kullanıcı.`);
  console.log(`Kullanıcı şifresi (hepsi için): ${USER_PASSWORD}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
