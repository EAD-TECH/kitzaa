"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

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

import { AdminUserDTO } from "../types/users.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type DataTableFeatures } from "@/components/shared/table/data-table-features";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

const columnHelper = createColumnHelper<DataTableFeatures, AdminUserDTO>();

export const createColumns = (handlers: {
 
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) => [
  columnHelper.accessor("email", {
    id: "email",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar ?? undefined} alt={user.firstName} />
            <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm ">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-xs truncate  text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      );
    },
  }),

  columnHelper.accessor("role", {
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Badge
          className={cn(
            "w-24  p-3 font-heading justify-center border-0 rounded-full text-xs font-normal",
          )}
        >
          {user.role}
        </Badge>
      );
    },
  }),

  columnHelper.accessor("createdAt", {
    cell: ({ row }) => {
      const user = row.original;
      const createdAt = new Date(user.createdAt);
      const dayMonth = createdAt.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return (
        <span className="min-w-0 wrap-break-word text-sm text-muted-foreground">
          {user.createdAt ? dayMonth : "Tarih belirtilmemiş"}
        </span>
      );
    },
  }),

  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
              <DropdownMenuItem onClick={()=>handlers.onEdit?.(user?._id)}>Düzenle</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>handlers.onDelete?.(user?._id)}>Sil</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
