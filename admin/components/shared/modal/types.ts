import React from "react"

export interface ResponsiveModalProps {
  title:string
  description?:React.ReactNode
  isOpen:boolean
  onClose: (open:boolean) => void
  children:React.ReactNode
  tag?:string

  
}