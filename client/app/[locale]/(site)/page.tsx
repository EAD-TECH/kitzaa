import { HeroSection } from "@/features/home/components/Hero";
import { UpcomingEvents } from "@/features/home/components/UpcomingEvents";
import { OrganizerSection } from "@/features/home/components/OrganizerSection";
import { AiEventSearch } from "@/features/ai/components/AiEventSearch";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <AiEventSearch />
      <UpcomingEvents />
      <OrganizerSection />
    </>
  );
}
