
import { DrawerClose, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import type { ReusableDrawerHeaderProps } from "../types"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReusableDrawerHeader({title,tag,subtitle}:ReusableDrawerHeaderProps) {
  return (
    <>
      <DrawerHeader className="flex-row  items-start justify-between gap-4 text-left pb-4">
          <div className="flex min-w-0 flex-col gap-2">
            <DrawerTitle className="font-heading text-sm font-normal uppercase tracking-wider text-(--terracotta-600)">
             {/*  Başvuru Detayı */} {title }
            </DrawerTitle>
            <p className="font-heading text-xl font-normal leading-8 text-(--brown-500)">
              {/* Yeni organizatör başvurularını incele */} 
              
              {tag}
            </p>
            <DrawerDescription className="text-sm font-normal text-(--brown-500)">
          {/*     Operasyon - Bugün, 14:00 */}  {subtitle}
             </DrawerDescription>
          </div>

          <DrawerClose
            render={<Button variant="ghost" size="icon" className="shrink-0" />}
          >
            <X className="size-5" />
            <span className="sr-only">Kapat</span>
          </DrawerClose>
        </DrawerHeader>
    </>
  )
}
