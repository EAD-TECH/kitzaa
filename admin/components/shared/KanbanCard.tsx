import { CircleDot, MoreHorizontal } from "lucide-react";
import type { KanbanCardProps } from "@/components/shared/types";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Progress, ProgressLabel, ProgressValue } from "../ui/progress";

export function KanbanCard({ data }: { data: KanbanCardProps }) {
  return (
    <Card
      onClick={() => {
        data.onClick && data.onClick(data.id);
      }}
      size="sm"
      className="w-full cursor-pointer ring-0 border border-kanban-card-border bg-kanban-card-bg rounded-xl shadow-kanban-card"
    >
      <CardHeader>
        <div className="flex min-w-0 flex-col gap-2">
          {/* baslık*/}
          <CardTitle className="font-heading min-w-0 wrap-break-word text-base font-normal leading-normal text-kanban-card-title">
            {data.title}
          </CardTitle>

          {data.subtitle && (
            <CardDescription className="min-w-0 wrap-break-word text-sm text-muted-foreground">
              {data.subtitle}
            </CardDescription>
          )}

          {/* time*/}
          <CardDescription className="min-w-0 wrap-break-word text-sm text-muted-foreground">
            {data.time || "Tarih belirtilmemiş"}
          </CardDescription>

          {/* kategori */}
          {data.category && (
            <Badge className="w-fit max-w-full min-w-0  border-0 bg-kanban-card-bg text-kanban-card-muted rounded-full text-xs font-normal">
              <CircleDot size={12} className="mr-1 truncate" />
              {data.category}
            </Badge>
          )}
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="min-h-10 min-w-10 text-kanban-card-muted"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreHorizontal size={20} />
                </Button>
              }
            ></DropdownMenuTrigger>
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

      {data.icon}

      {data.description ? (
        <CardContent>
          <p className="wrap-break-word text-left text-sm text-muted-foreground sm:text-xs">
            {data.description}
          </p>
        </CardContent>
      ) : null}

      <CardFooter>
        {data.progressPercentage != undefined && (
          <Progress value={data.progressPercentage} className="w-full max-w-sm">
            <ProgressLabel>Doluluk oranı</ProgressLabel>
            <ProgressValue />
          </Progress>
        )}
      </CardFooter>
    </Card>
  );
}
