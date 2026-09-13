import { CheckCircle2 } from "lucide-react"

interface EventContentProps {
  description: string
  highlights?: string[]
}

const EventContent = ({ description, highlights }: EventContentProps) => {
  const paragraphs = description.split("\n").filter(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Über das Event
        </h2>
        <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
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
