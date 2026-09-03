import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { EventDTO } from "../../types/event.types"

const MAX_VISIBLE_AVATARS = 8

interface ParticipantAvatarsProps {
  event: EventDTO
}

const ParticipantAvatars = ({ event }: ParticipantAvatarsProps) => {
  const participants = event.participantsPreview
  const visible = participants.slice(0, MAX_VISIBLE_AVATARS)
  const remaining = participants.length - visible.length

  return (
    <div className="order-2 flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 desktop:order-3">
      <h2 className="font-heading text-base font-semibold text-foreground">
        Teilnehmer
      </h2>

      {participants.length === 0 ? (
        <p className="text-sm text-muted-foreground">Noch keine Teilnehmer</p>
      ) : (
        <AvatarGroup>
          {visible.map((participant) => (
            <Tooltip key={participant._id}>
              <TooltipTrigger>
                <Avatar>
                  {participant.avatarUrl && (
                    <AvatarImage src={participant.avatarUrl} alt={participant.username} />
                  )}
                  <AvatarFallback>{participant.username.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{participant.username}</TooltipContent>
            </Tooltip>
          ))}

          {remaining > 0 && <AvatarGroupCount>+{remaining}</AvatarGroupCount>}
        </AvatarGroup>
      )}
    </div>
  )
}

export default ParticipantAvatars
