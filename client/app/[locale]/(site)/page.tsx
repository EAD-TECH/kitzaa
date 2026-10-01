import { HeroSection } from "@/features/home/components/Hero";
import { UpcomingEvents } from "@/features/home/components/UpcomingEvents";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <UpcomingEvents />
    </>
  );
}
