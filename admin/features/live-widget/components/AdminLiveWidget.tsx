'use client'

import { useSocketConnection } from "../hooks/useSocketConnections"

export default function AdminLiveWidget() {
useSocketConnection()

  return (
    <div>AdminLiveWidget</div>
  )
}
