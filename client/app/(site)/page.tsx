import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 py-32 text-center text-foreground">
      <h1 className="max-w-md font-heading text-3xl font-semibold text-balance">
        Kitzaa
      </h1>
      <p className="max-w-md font-body text-base text-muted-foreground">
        Etkinlik keşfetme ve organizasyon platformu — <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-muted-foreground">app/(site)/page.tsx</code> üzerinde geliştirme devam ediyor.
      </p>
      <Button variant="default">Başla</Button>
    </div>
  );
}
