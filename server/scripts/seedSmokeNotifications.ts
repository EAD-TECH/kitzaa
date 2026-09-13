import "dotenv/config";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import User from "../src/models/userModel.js";
import Event from "../src/models/eventModel.js";
import Post from "../src/models/postModel.js";
import { Notification } from "../src/models/notificationModel.js";

async function run() {
  await dbConnection();

  const recipient = await User.findOne({ email: "elif.user@example.com" });
  if (!recipient) {
    throw new Error("elif.user bulunamadı. Önce npx tsx scripts/seedElifUsers.ts çalıştır.");
  }

  const sender = await User.findOne({
    email: { $ne: recipient.email },
    role: { $in: ["user", "organizer"] },
  });

  const event = await Event.findOne({ status: "approved", slug: { $exists: true, $ne: "" } }).sort({
    createdAt: -1,
  });

  const post = await Post.findOne({}).sort({ createdAt: -1 });

  await Notification.deleteMany({
    recipientId: recipient._id,
    title: { $regex: /^\[SMOKE\]/ },
  });

  const docs: Record<string, unknown>[] = [];

  if (event) {
    docs.push({
      recipientId: recipient._id,
      senderId: sender?._id ?? null,
      type: "nearby_event",
      title: "[SMOKE] Neue Veranstaltung in deiner Stadt",
      message: `Schau dir „${event.title}“ an.`,
      relatedId: event._id,
      relatedModel: "Event",
      linkNotification: `/events/${event.slug}`,
      isRead: false,
    });
  }

  if (post) {
    docs.push({
      recipientId: recipient._id,
      senderId: sender?._id ?? post.authorId,
      type: "post_comment",
      title: "[SMOKE] Neuer Kommentar",
      message: "Jemand hat deinen Beitrag kommentiert.",
      relatedId: post._id,
      relatedModel: "Post",
      linkNotification: `/posts/${post._id}`,
      isRead: false,
    });
  }

  if (docs.length === 0) {
    throw new Error("Approved event veya post yok. Önce event/post seed çalıştır.");
  }

  const created = await Notification.insertMany(docs);
  console.log(`elif.user için ${created.length} smoke bildirim:`);
  created.forEach((n) => {
    console.log(`- ${n.type}: ${n.linkNotification}`);
  });

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
