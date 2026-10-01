import "dotenv/config";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import Event from "../src/models/eventModel.js";
import type { AgeRange } from "../src/types/event.types.js";

// Tek seferlik migration: events.ageRange -> events.ageRanges (string[]).
// Çalıştırma: npx tsx scripts/migrateAgeRanges.ts
// Idempotent: tekrar çalıştırılırsa zaten taşınmış dokümanlara dokunmaz.
//
// Mongoose modeli artık "ageRange" alanını tanımadığı için ham collection (Event.collection)
// üzerinden çalışılır; aksi halde strict mode eski alanı okumaz/silmez.
//
// Eski veride iki format var:
//   - enum string'i: "7-10"                -> ["7-10"]
//   - enum'dan önceki obje: { min, max }   -> aralığın kesiştiği gruplar; 4 çocuk grubunun
//                                              hepsini kapsıyorsa ["all-ages"]

const VALID_AGE_RANGES: readonly AgeRange[] = ["0-3", "4-6", "7-10", "10-14", "parents", "all-ages"];

const CHILD_BUCKETS: { range: AgeRange; min: number; max: number }[] = [
  { range: "0-3", min: 0, max: 3 },
  { range: "4-6", min: 4, max: 6 },
  { range: "7-10", min: 7, max: 10 },
  { range: "10-14", min: 10, max: 14 },
];

function isAgeRange(value: unknown): value is AgeRange {
  return typeof value === "string" && (VALID_AGE_RANGES as readonly string[]).includes(value);
}

function toAgeRanges(legacy: unknown): AgeRange[] | null {
  if (isAgeRange(legacy)) return [legacy];

  if (legacy && typeof legacy === "object") {
    const { min, max } = legacy as { min?: unknown; max?: unknown };
    if (typeof min !== "number" || typeof max !== "number" || min > max) return null;

    const overlapping = CHILD_BUCKETS.filter((b) => min <= b.max && max >= b.min).map((b) => b.range);
    if (overlapping.length === CHILD_BUCKETS.length) return ["all-ages"];
    return overlapping.length > 0 ? overlapping : null;
  }

  return null;
}

async function run() {
  await dbConnection();

  const events = Event.collection;

  // 1) Eski değeri (string ya da {min,max}) diziye çevir, eski alanı kaldır.
  const legacyDocs = await events
    .find({ ageRange: { $exists: true }, ageRanges: { $exists: false } }, { projection: { ageRange: 1, title: 1 } })
    .toArray();

  const ops = legacyDocs.map((doc) => {
    const converted = toAgeRanges(doc.ageRange);
    if (!converted) {
      console.warn(`Tanınmayan ageRange ${JSON.stringify(doc.ageRange)} ("${doc.title}") -> ["all-ages"]`);
    }
    return {
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { ageRanges: converted ?? ["all-ages"] }, $unset: { ageRange: "" } },
      },
    };
  });

  if (ops.length > 0) {
    const migrated = await events.bulkWrite(ops);
    console.log(`${migrated.modifiedCount} event ageRange -> ageRanges olarak taşındı.`);
  } else {
    console.log("Taşınacak event yok.");
  }

  // 2) Her iki alan da yoksa (eski/eksik kayıt) "all-ages" varsayılanı ver —
  //    client'taki edit formu da eksik değeri aynı şekilde "all-ages" kabul ediyordu.
  const defaulted = await events.updateMany(
    { ageRange: { $exists: false }, ageRanges: { $exists: false } },
    { $set: { ageRanges: ["all-ages"] } },
  );
  console.log(`${defaulted.modifiedCount} event'e varsayılan ["all-ages"] atandı.`);

  // 3) Eski alan zaten taşınmışsa ama kalıntı olarak duruyorsa temizle.
  const cleaned = await events.updateMany(
    { ageRange: { $exists: true } },
    { $unset: { ageRange: "" } },
  );
  console.log(`${cleaned.modifiedCount} event'ten kalıntı ageRange alanı silindi.`);

  // 4) Eski index'i kaldır, yeni (multikey) index'i oluştur.
  try {
    await events.dropIndex("ageRange_1");
    console.log('Eski "ageRange_1" index\'i silindi.');
  } catch {
    console.log('"ageRange_1" index\'i bulunamadı, atlanıyor.');
  }
  // syncIndexes yerine createIndexes: şemada olmayan (elle eklenmiş) index'leri silmez.
  await Event.createIndexes();
  console.log("Yeni index'ler oluşturuldu.");

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
