"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { HelpCircle, icons, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type DataTableFeatures } from "@/components/shared/table/data-table-features";
import { Badge } from "@/components/ui/badge";
import { CategoryDTO } from "../types/categories";
import { Switch } from "@/components/ui/switch";
import DynamicIcon from "@/components/shared/table/DynamicIcon";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<DataTableFeatures, CategoryDTO>();

export const createCategoryColumns = (handlers: {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) => [
  columnHelper.accessor("icon", {
    header: "IKON",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-kanban-card-bg">
          <DynamicIcon name={category.icon} />
        </div>
      );
    },
  }),

  columnHelper.accessor("name", {
    header: "AD VE SLUG",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="font-heading text-sm font-medium text-foreground">
            {category.name}
          </span>
          <Badge
            variant="secondary"
            className="w-fit truncate rounded-full border-0 bg-muted px-2 py-1 text-xs font-normal text-muted-foreground"
          >
            {category.slug}
          </Badge>
        </div>
      );
    },
  }),
  columnHelper.accessor("description", {
    header: "AÇIKLAMA",

    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex flex-col min-w-0">
          <span className="text-foreground wrap-break-word text-xs font-body leading-6 font-normal">
            {category.description}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor("isActive", {
    header: "DURUM",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex flex-col  min-w-0">
          <Switch className={cn("bg-secondary")} checked={category.isActive} />
        </div>
      );
    },
  }),

  columnHelper.display({
    header: "ISLEMLER",
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="h-8 w-8 p-0" />}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => handlers.onEdit?.(category?._id)}
              >
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlers.onDelete?.(category?._id)}
              >
                Sil
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
