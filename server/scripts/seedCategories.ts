import "dotenv/config";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import EventCategory from "../src/models/eventCategoryModel.js";

const CATEGORIES = [
  {
    name: "Natur",
    description: "Ausflüge und Aktivitäten in der Natur, wie Wanderungen, Picknicks oder Tierbeobachtungen.",
    icon: "Leaf",
  },
  {
    name: "Sport",
    description: "Sportliche Aktivitäten und Bewegungsangebote für Kinder und Familien.",
    icon: "Volleyball",
  },
  {
    name: "Kreativität",
    description: "Kreative Workshops zum Malen, Basteln und künstlerischen Gestalten.",
    icon: "Palette",
  },
  {
    name: "Musik & Kultur",
    description: "Konzerte, Theateraufführungen und kulturelle Veranstaltungen.",
    icon: "Music",
  },
  {
    name: "Essen & Trinken",
    description: "Kulinarische Events, Kochkurse und gemeinsames Essen.",
    icon: "UtensilsCrossed",
  },
  {
    name: "Bildung",
    description: "Lernreiche Veranstaltungen, Kurse und Bildungsangebote.",
    icon: "GraduationCap",
  },
  {
    name: "Familie",
    description: "Speziell auf Familien und Kinder zugeschnittene Veranstaltungen.",
    icon: "Users",
  },
  {
    name: "Feste & Feiern",
    description: "Feste, Feiern und Partys für Groß und Klein.",
    icon: "PartyPopper",
  },
];

async function run() {
  await dbConnection();

  const { deletedCount } = await EventCategory.deleteMany({});
  console.log(`${deletedCount} mevcut kategori silindi.`);

  for (const category of CATEGORIES) {
    await EventCategory.create(category);
    console.log(`"${category.name}" oluşturuldu.`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
