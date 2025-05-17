"use client"

import { Loader2 } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Loader2 className="h-16 w-16 animate-spin text-gray-400" />
    </div>
  )
}