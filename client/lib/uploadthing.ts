import { genUploader } from "uploadthing/client"
import type { FileRoute } from "uploadthing/types"

// client/ ve server/ ayrı TS projeleri olduğu için server/src/configs/uploadthing.ts
// içindeki OurFileRouter tipi doğrudan import edilemiyor. Bu yüzden burada sadece
// "eventImage" route'unun şeklini (input/output) elle kopyalıyoruz — üretilen değeri
// hiç kullanmıyoruz, sadece uploadFiles'a doğru tipleri vermek için.
// Server'daki eventImage tanımı değişirse (uploadRouter.eventImage), bunu da güncelle.
type OurFileRouter = {
  eventImage: FileRoute<{
    input: { eventId?: string }
    output: null
    errorShape: unknown
  }>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const { uploadFiles } = genUploader<OurFileRouter>({
  url: `${API_URL}/api/uploadthing`,
})
