import "dotenv/config";
import dayjs from "dayjs";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import Event from "../src/models/eventModel.js";
import EventCategory from "../src/models/eventCategoryModel.js";
import User from "../src/models/userModel.js";
import type { EventLocationType } from "../src/types/event.types.js";

const PLACES = [
  { state: "Berlin", city: "Berlin", zipCode: "10115", lng: 13.405, lat: 52.52 },
  { state: "Bayern", city: "München", zipCode: "80331", lng: 11.582, lat: 48.1351 },
  { state: "Hamburg", city: "Hamburg", zipCode: "20095", lng: 9.9937, lat: 53.5511 },
  { state: "Nordrhein-Westfalen", city: "Köln", zipCode: "50667", lng: 6.9603, lat: 50.9375 },
  { state: "Hessen", city: "Frankfurt am Main", zipCode: "60311", lng: 8.6821, lat: 50.1109 },
  { state: "Baden-Württemberg", city: "Stuttgart", zipCode: "70173", lng: 9.1829, lat: 48.7758 },
  { state: "Nordrhein-Westfalen", city: "Düsseldorf", zipCode: "40210", lng: 6.7735, lat: 51.2277 },
  { state: "Sachsen", city: "Leipzig", zipCode: "04109", lng: 12.3731, lat: 51.3397 },
  { state: "Sachsen", city: "Dresden", zipCode: "01067", lng: 13.7373, lat: 51.0504 },
  { state: "Bayern", city: "Nürnberg", zipCode: "90402", lng: 11.0767, lat: 49.4521 },
];

type EventSeed = {
  title: string;
  description: string;
  category: string;
  locationType: EventLocationType;
  ageRange: { min: number; max: number };
  isFree: boolean;
  price?: number;
  imageKeyword: string;
};

const EVENTS: EventSeed[] = [
  // Natur
  { title: "Waldspaziergang für Familien", description: "Gemeinsame Wanderung durch den Wald mit spannenden Naturentdeckungen für Groß und Klein.", category: "Natur", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "forest,hiking" },
  { title: "Vogelbeobachtung am See", description: "Mit dem Fernglas auf Entdeckungstour: heimische Vogelarten am Stadtsee beobachten.", category: "Natur", locationType: "outdoor", ageRange: { min: 6, max: 99 }, isFree: true, imageKeyword: "birdwatching,lake" },
  { title: "Kräuterworkshop im Stadtpark", description: "Essbare Wildkräuter erkennen, sammeln und gemeinsam verarbeiten.", category: "Natur", locationType: "outdoor", ageRange: { min: 8, max: 99 }, isFree: false, price: 12, imageKeyword: "herbs,garden" },
  { title: "Nachtwanderung mit Taschenlampen", description: "Abenteuerliche Wanderung bei Dunkelheit mit spannenden Geschichten über nachtaktive Tiere.", category: "Natur", locationType: "outdoor", ageRange: { min: 5, max: 99 }, isFree: true, imageKeyword: "flashlight,night,forest" },

  // Sport
  { title: "Fußballturnier für Kinder", description: "Kleine Teams, große Freude: Fußballturnier für Kinder von 6 bis 12 Jahren.", category: "Sport", locationType: "outdoor", ageRange: { min: 6, max: 12 }, isFree: true, imageKeyword: "soccer,kids" },
  { title: "Yoga im Park", description: "Entspanntes Familien-Yoga an der frischen Luft, für alle Levels geeignet.", category: "Sport", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "yoga,park" },
  { title: "Fahrradtour durch die Stadt", description: "Geführte Fahrradtour entlang der schönsten Ecken der Stadt.", category: "Sport", locationType: "outdoor", ageRange: { min: 8, max: 99 }, isFree: false, price: 5, imageKeyword: "cycling,city" },
  { title: "Schwimmkurs für Anfänger", description: "Erste Schwimmzüge im Hallenbad, betreut von erfahrenen Trainern.", category: "Sport", locationType: "indoor", ageRange: { min: 5, max: 10 }, isFree: false, price: 25, imageKeyword: "swimming,pool" },

  // Kreativität
  { title: "Töpferworkshop für Einsteiger", description: "Erste Schritte an der Töpferscheibe, Material und Brand inklusive.", category: "Kreativität", locationType: "indoor", ageRange: { min: 10, max: 99 }, isFree: false, price: 18, imageKeyword: "pottery,ceramics" },
  { title: "Malkurs für Kinder", description: "Farben, Formen und Fantasie: freies Malen und Gestalten für Kinder.", category: "Kreativität", locationType: "indoor", ageRange: { min: 4, max: 10 }, isFree: false, price: 8, imageKeyword: "painting,kids" },
  { title: "DIY-Schmuckwerkstatt", description: "Eigenen Schmuck aus Perlen und Naturmaterialien gestalten.", category: "Kreativität", locationType: "indoor", ageRange: { min: 8, max: 99 }, isFree: false, price: 15, imageKeyword: "handmade,jewelry" },
  { title: "Origami-Nachmittag", description: "Papier falten leicht gemacht: von einfachen Kranichen bis zu kniffligen Figuren.", category: "Kreativität", locationType: "indoor", ageRange: { min: 6, max: 99 }, isFree: true, imageKeyword: "origami,paper" },

  // Musik & Kultur
  { title: "Open-Air-Konzert im Park", description: "Live-Musik unter freiem Himmel mit lokalen Bands.", category: "Musik & Kultur", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "concert,outdoor" },
  { title: "Kindertheater: Die kleine Hexe", description: "Zauberhafte Theateraufführung für die ganze Familie.", category: "Musik & Kultur", locationType: "indoor", ageRange: { min: 4, max: 99 }, isFree: false, price: 10, imageKeyword: "theater,stage" },
  { title: "Museumsführung für Familien", description: "Interaktive Führung durch das Stadtmuseum, extra für kleine Entdecker aufbereitet.", category: "Musik & Kultur", locationType: "indoor", ageRange: { min: 6, max: 99 }, isFree: false, price: 6, imageKeyword: "museum,exhibit" },
  { title: "Trommelworkshop", description: "Gemeinsam trommeln und den eigenen Rhythmus finden, keine Vorkenntnisse nötig.", category: "Musik & Kultur", locationType: "indoor", ageRange: { min: 6, max: 99 }, isFree: true, imageKeyword: "drums,music" },

  // Essen & Trinken
  { title: "Kochkurs: Pasta selbst gemacht", description: "Frische Pasta von Grund auf selbst herstellen, gemeinsames Essen inklusive.", category: "Essen & Trinken", locationType: "indoor", ageRange: { min: 10, max: 99 }, isFree: false, price: 20, imageKeyword: "pasta,cooking" },
  { title: "Backworkshop für Kinder", description: "Kekse und kleine Kuchen backen und verzieren.", category: "Essen & Trinken", locationType: "indoor", ageRange: { min: 5, max: 12 }, isFree: false, price: 10, imageKeyword: "baking,cookies" },
  { title: "Streetfood-Festival", description: "Kulinarische Weltreise mit Foodtrucks und Live-Musik.", category: "Essen & Trinken", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "streetfood,foodtruck" },
  { title: "Picknick im Grünen", description: "Gemeinsames Picknick mit Spielen für die ganze Familie, jeder bringt etwas mit.", category: "Essen & Trinken", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "picnic,family" },

  // Bildung
  { title: "Kinderuni: Warum ist der Himmel blau?", description: "Spannende Experimente und einfache Erklärungen für neugierige Kinder.", category: "Bildung", locationType: "indoor", ageRange: { min: 6, max: 12 }, isFree: true, imageKeyword: "science,kids" },
  { title: "Coding-Workshop für Teenager", description: "Erste Schritte in der Programmierung mit einem eigenen kleinen Spielprojekt.", category: "Bildung", locationType: "indoor", ageRange: { min: 12, max: 17 }, isFree: false, price: 15, imageKeyword: "coding,laptop" },
  { title: "Sprachkurs Englisch für Kids", description: "Spielerisch Englisch lernen mit Liedern, Spielen und kleinen Geschichten.", category: "Bildung", locationType: "indoor", ageRange: { min: 5, max: 10 }, isFree: false, price: 12, imageKeyword: "classroom,kids" },
  { title: "Lese-Nachmittag in der Bibliothek", description: "Vorlesestunde und Buchempfehlungen für kleine und große Leseratten.", category: "Bildung", locationType: "indoor", ageRange: { min: 3, max: 99 }, isFree: true, imageKeyword: "library,reading" },

  // Familie
  { title: "Familienfrühstück im Park", description: "Gemütliches Frühstück im Grünen mit Spielangeboten für Kinder.", category: "Familie", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "breakfast,family" },
  { title: "Spieletag für die ganze Familie", description: "Brett- und Kartenspiele für jedes Alter, Anfänger willkommen.", category: "Familie", locationType: "indoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "boardgame,family" },
  { title: "Familien-Flohmarkt", description: "Kinderkleidung, Spielzeug und mehr: Flohmarkt rund ums Familienleben.", category: "Familie", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "fleamarket" },

  // Feste & Feiern
  { title: "Sommerfest im Stadtpark", description: "Musik, Essen und Spiele: das große Sommerfest für die ganze Nachbarschaft.", category: "Feste & Feiern", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "summerfestival" },
  { title: "Laternenfest für Kinder", description: "Laternenumzug mit Musik, im Anschluss gibt es Punsch und Gebäck.", category: "Feste & Feiern", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "lantern,kids" },
  { title: "Weihnachtsmarkt-Bummel", description: "Gemeinsamer Bummel über den Weihnachtsmarkt mit Glühwein und Kinderpunsch.", category: "Feste & Feiern", locationType: "outdoor", ageRange: { min: 0, max: 99 }, isFree: true, imageKeyword: "christmasmarket" },
];

function coverImageFor(keyword: string, lock: number) {
  return `https://loremflickr.com/800/600/${keyword}?lock=${lock}`;
}

function imagesFor(keyword: string, lock: number) {
  return [
    `https://loremflickr.com/800/600/${keyword}?lock=${lock + 1000}`,
    `https://loremflickr.com/800/600/${keyword}?lock=${lock + 2000}`,
  ];
}

async function run() {
  await dbConnection();

  const categories = await EventCategory.find({});
  if (categories.length === 0) {
    throw new Error("Hiç kategori bulunamadı. Önce `npx tsx scripts/seedCategories.ts` çalıştır.");
  }
  const categoryIdByName = new Map(categories.map((c) => [c.name, c._id]));

  const creators = await User.find({ role: { $in: ["organizer", "admin"] } });
  if (creators.length === 0) {
    throw new Error("Organizer/admin kullanıcı bulunamadı. Önce `npx tsx scripts/seedUsers.ts` çalıştır.");
  }

  const { deletedCount } = await Event.deleteMany({ title: { $in: EVENTS.map((e) => e.title) } });
  console.log(`${deletedCount} mevcut seed event silindi.`);

  for (const [i, e] of EVENTS.entries()) {
    const categoryId = categoryIdByName.get(e.category);
    if (!categoryId) {
      console.warn(`Kategori bulunamadı, atlanıyor: "${e.category}"`);
      continue;
    }

    const place = PLACES[i % PLACES.length]!;
    const creator = creators[i % creators.length]!;
    const startDate = dayjs().add(7 + i, "day").toDate();

    await Event.create({
      title: e.title,
      description: e.description,
      coverImage: coverImageFor(e.imageKeyword, i),
      images: imagesFor(e.imageKeyword, i),
      categoryId,
      locationType: e.locationType,
      ageRange: e.ageRange,
      createdBy: creator._id,
      status: "approved",
      isFree: e.isFree,
      price: e.isFree ? null : { amount: e.price ?? 10, currency: "EUR" },
      schedule: {
        startDate,
        startTime: "10:00",
        endTime: "13:00",
      },
      location: {
        venueName: null,
        addressLine: `Musterstraße ${(i % 20) + 1}`,
        city: place.city,
        state: place.state,
        zipCode: place.zipCode,
        country: "DE",
        coordinates: { type: "Point", coordinates: [place.lng, place.lat] },
      },
      capacity: { max: 20 + (i % 5) * 15, current: 0 },
    });
    console.log(`"${e.title}" (${e.category}) oluşturuldu.`);
  }

  console.log(`\nToplam: ${EVENTS.length} event.`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
