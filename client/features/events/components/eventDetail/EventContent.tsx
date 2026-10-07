import { CheckCircle2 } from "lucide-react"
import { isHtml, sanitizeRichText } from "@/lib/sanitizeRichText"

interface EventContentProps {
  description: string
  highlights?: string[]
}

// Tailwind preflight liste/kalın yazı stillerini sıfırlıyor — editördeki görünümün aynısı
// için HTML içindeki etiketlere burada stil veriyoruz. Boş <p>'ler editörde boş satır.
const RICH_TEXT_CLASSNAME =
  "text-sm leading-6 text-muted-foreground [&_p]:my-1.5 [&_p:empty]:h-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"

const EventContent = ({ description, highlights }: EventContentProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Über das Event
        </h2>
        {isHtml(description) ? (
          // Server Component: temizleme sunucuda yapılıyor, tarayıcıya sanitize-html gitmiyor.
          <div
            className={RICH_TEXT_CLASSNAME}
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(description) }}
          />
        ) : (
          <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
            {description.split("\n").filter(Boolean).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>

      {highlights && highlights.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-base font-semibold text-foreground">
            Was dich erwartet
          </h3>
          <ul className="flex flex-col gap-2">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default EventContent
