"use client";

import * as React from "react";
import { cn } from "cn";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { ResponsiveModalProps } from "./types";
import { useMediaQuery } from "@/features/users/hooks/useMediaQuery";

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-(600px) veya sm:max-w-2xl">
          <DialogHeader>
          
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>
                {/*  Make changes to your profile here. Click save when you&apos;re
              done. */}{" "}
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
            {children}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="text-left">
           
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        
              {children}
         
        </DrawerContent>
      </Drawer>
    );
  }
}
