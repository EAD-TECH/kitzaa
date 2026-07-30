
import { createUploadthing, UploadThingError, type FileRouter } from "uploadthing/express";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import type { Request } from "express";
import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import type { AccessTokenPayload } from "../helpers/generateJwt.js";

const f = createUploadthing();   // bununla uploudThing routelarini olusturuyoruz.
export const utapi = new UTApi();  // UploadThing'in sunucu tarafı API istemcisi. Dosya silme, listeleme gibi UploadThing'in kendi depolamasına yönelik işlemler için kullanılıyor

// authentication.ts ile ayni mantik: token'i cozup kullaniciyi bul.
async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UploadThingError("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  let decoded: AccessTokenPayload;
  try {
    decoded = jwt.verify(token!, process.env.ACCESS_KEY!) as AccessTokenPayload;
  } catch {
    throw new UploadThingError("Invalid or expired token.");
  }

  const user = await User.findById(decoded._id);

  if (!user || !user.isActive) {
    throw new UploadThingError("Unauthorized");
  }

  return user;
}


export const uploadRouter = {

  // 1. Profil fotografi kapisi: sadece image dosyalarini kabul et, max 4mb olsun. max 1 dosya
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {   
      const user = await getUserFromRequest(req);
      return { userId: user._id.toString(), previousAvatarUrl: user.avatarUrl ?? null };
    })
    .onUploadComplete(async ({ metadata, file }) => {  // metadata middlewareden gelen veri, file yüklenen dosyanin bilgisi
      if (metadata.previousAvatarUrl) {
        const oldKey = metadata.previousAvatarUrl.split("/").pop()!; // önceden bir avatar varsa siliyoruz.
        await utapi.deleteFiles(oldKey);
      }
      await User.findByIdAndUpdate(metadata.userId, { avatarUrl: file.url });
    }),

  // 2. Event fotografi kapisi: coklu dosya, sadece event sahibi/admin yukleyebilir.
  eventImage: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .input(z.object({ eventId: z.string() }))// bu, frontend'in upload isteğiyle birlikte göndermesi gereken ekstra veriyi tanımlıyor. Profil fotoğrafında böyle bir şeye gerek yoktu (kimin yükleyeceği zaten token'dan belliydi), ama event fotoğrafında hangi event'e yükleneceğini bilmemiz gerekiyor — bu yüzden frontend, upload isteğiyle birlikte { eventId: "64f..." } göndermek zorunda. Zod, bu verinin doğru formatta (string) geldiğini garanti ediyor.
    .middleware(async ({ req, input }) => {
      const user = await getUserFromRequest(req);
      const event = await Event.findById(input.eventId);

      if (!event) {
        throw new UploadThingError("Event not found");
      }

      const isOwner = event.createdBy.equals(user._id);
      if (!isOwner && user.role !== "admin") {
        throw new UploadThingError("You do not have permission to upload images for this event.");
      }

      return { eventId: input.eventId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await Event.findByIdAndUpdate(metadata.eventId, { $push: { images: file.url } });
    }),

  // 3. Social kapisi: model hazir olunca onUploadComplete icini dolduracaksin.
  socialImage: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      const user = await getUserFromRequest(req);
      return { userId: user._id.toString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Social image uploaded by", metadata.userId, file.url);
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;