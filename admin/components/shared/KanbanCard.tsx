import { CircleDot, MoreHorizontal } from "lucide-react";
import type { KanbanCardProps } from "@/components/shared/types";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function KanbanCard({ data }: { data: KanbanCardProps }) {
  const formattedTime = new Date(data.time).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      size="sm"
      className="w-full ring-0 border border-kanban-card-border bg-kanban-card-bg rounded-xl shadow-kanban-card"
    >
      <CardHeader>
        <div className="flex flex-col gap-2">
          {/* baslık*/}
          <CardTitle className="font-heading text-base font-normal leading-normal text-kanban-card-title">
            {data.title}
          </CardTitle>

          {/* time*/}
          <CardDescription className="text-sm text-muted-foreground">
            {formattedTime}
          </CardDescription>

          {/* kategori */}
          {data.category && (
            <Badge className="w-fit border-0 bg-(--cream-50) text-(--brown-500) rounded-full text-xs font-normal">
              <CircleDot size={12} className="mr-1" />
              {data.category}
            </Badge>
          )}
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="text-(--brown-500)">
                <MoreHorizontal size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              className="w-fit min-w-0 bg-card text-kanban-card-title"
            >
              {/* dinamik akyonlar kısmım */}
              <DropdownMenuItem
                className="text-kanban-card-title focus:text-kanban-card-title"
                onClick={() => data.onReview && data.onReview(data.id)}
              >
                İncele
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-kanban-card-title focus:text-kanban-card-title"
                onClick={() => data.onEdit && data.onEdit(data.id)}
              >
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => data.onDelete && data.onDelete(data.id)}
              >
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      {data.description ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
