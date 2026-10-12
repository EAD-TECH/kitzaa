import "dotenv/config";
import dayjs from "dayjs";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import Event from "../src/models/eventModel.js";
import EventCategory from "../src/models/eventCategoryModel.js";
import User from "../src/models/userModel.js";

const TITLE_PREFIX = "dashboard-seed";

async function run() {
  await dbConnection();

  const category = await EventCategory.findOne({});
  const creators = await User.find({ role: { $in: ["organizer", "admin"] } });
  const attendees = await User.find({ role: "user" });

  if (!category || creators.length === 0 || attendees.length === 0) {
    throw new Error(
      "Kategori, organizer/admin ve en az bir user gerekli. Mevcut seed scriptlerini tekrar çalıştırma.",
    );
  }

  const { deletedCount } = await Event.deleteMany({
    title: { $regex: `^${TITLE_PREFIX} ` },
  });
  console.log(`${deletedCount} eski dashboard-seed etkinliği silindi.`);

  // i=11 en eski ay, i=0 bu ay. Dashboard trend penceresi ile aynı.
  const eventsPerMonth = [3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9, 10];
  let created = 0;

  for (let i = 11; i >= 0; i--) {
    const month = dayjs().subtract(i, "month");
    const createdAt = (
      i === 0 ? month.subtract(2, "day") : month.date(8)
    )
      .startOf("day")
      .toDate();
    const joinedAt = dayjs(createdAt).add(1, "day").toDate();
    const label = month.format("YYYY-MM");
    const count = eventsPerMonth[11 - i]!;

    for (let n = 0; n < count; n++) {
      const pending = i === 0 && n < 2;
      const picked = attendees.slice(0, 2 + (n % 2));
      const participantCount = 2 + (11 - i);
      const participants = pending
        ? []
        : picked.map((user) => ({
            userId: user._id,
            status: "confirmed" as const,
            participantCount,
            joinedAt,
          }));
      const current = participants.reduce(
        (sum, participant) => sum + participant.participantCount,
        0,
      );
      const creator = creators[(created + n) % creators.length]!;

      const event = await Event.create({
        title: `${TITLE_PREFIX} ${label} ${n + 1}`,
        description: "Dashboard geçmiş verisi için mock etkinlik.",
        categoryId: category._id,
        locationType: "outdoor",
        ageRanges: ["all-ages"],
        createdBy: creator._id,
        status: pending ? "pending" : i === 0 ? "approved" : "completed",
        approvedAt: pending ? null : createdAt,
        isFree: true,
        schedule: {
          startDate: createdAt,
          startTime: "10:00",
          endTime: "12:00",
        },
        location: {
          addressLine: "Musterstraße 1",
          city: "Berlin",
          state: "Berlin",
          zipCode: "10115",
          country: "DE",
          coordinates: { type: "Point", coordinates: [13.405, 52.52] },
        },
        capacity: { max: 40, current },
        participants,
      });

      await Event.updateOne(
        { _id: event._id },
        { $set: { createdAt, updatedAt: createdAt } },
        { timestamps: false },
      );

      created++;
      console.log(
        `${event.title} (${pending ? "pending" : "dolu"}, katılımcı: ${current})`,
      );
    }
  }

  console.log(`\nToplam: ${created} dashboard-seed etkinliği.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});