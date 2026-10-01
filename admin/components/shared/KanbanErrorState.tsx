import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface KanbanErrorStateProps {
  onRetry: () => void;
}

export default function KanbanErrorState({ onRetry }: KanbanErrorStateProps) {
  return (
    <Alert className="max-w-md mx-auto mt-12 bg-card border-border text-foreground">
      <AlertCircle className="h-4 w-4 text-muted-foreground" />
      <AlertTitle className="font-semibold"> İletişim Koptu!</AlertTitle>
      <AlertDescription className="flex flex-col gap-4 mt-2">
        <p>Sunucu yanıt vermiyor olabilir.</p>
        <Button
          variant="outline"
          onClick={onRetry}
          className="w-fit rounded-full px-4 py-2 bg-muted text-foreground font-normal "
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Tekrar Dene
        </Button>
      </AlertDescription>
    </Alert>
  );
}
