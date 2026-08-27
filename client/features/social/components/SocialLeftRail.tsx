import { Camera, Images, MapPin } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import backgroundPattern from "../../../public/images/event-pattern.png";

const mockProfile = {
  name: "Lena Hofmann",
  username: "lena.hofmann",
  city: "Berlin",
  initials: "LH",
  avatar: "/images/user-image.png",
};

function SocialLeftRail() {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={mockProfile.avatar} alt={mockProfile.name} />
            <AvatarFallback>{mockProfile.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-heading text-base font-semibold">{mockProfile.name}</p>
            <p className="truncate text-sm text-muted-foreground">@{mockProfile.username}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {mockProfile.city}
          <Badge variant="secondary">Familie</Badge>
        </div>
      </section>

      <section className="relative isolate overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
        <Image
          src={backgroundPattern}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-8 -z-10 w-44 opacity-20 invert"
        />

        <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/15">
          <Camera className="size-5" />
        </div>

        <p className="mt-3 font-heading text-xl font-semibold">Moment teilen</p>
        <p className="mt-2 text-sm text-primary-foreground/85">
          Fotos von euren Events gehören hierher – von Waldabenteuern bis zum Workshop.
        </p>

        <p className="mt-4 flex items-center gap-2 rounded-full bg-primary-foreground/12 px-3 py-2 text-sm text-primary-foreground/80">
          <Images className="size-4 shrink-0" />
          <span className="truncate">Was möchtest du heute teilen?</span>
        </p>
      </section>
    </div>
  );
}

export default SocialLeftRail;
