"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import CollapsibleSidebar from "@/components/ui/collapsible-sidebar"
import Header from "@/components/ui/header"

interface UserData {
  username: string
  role: "admin" | "worker"
}

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token && pathname !== "/login") {
      router.push("/login")
      return
    }
    const stored = localStorage.getItem("userData")
    if (stored) {
      setUserData(JSON.parse(stored))
    }
  }, [pathname])

  if (pathname === "/login" || !userData) {
    return <>{children}</>
  }

  const handleToggle = () => setIsExpanded(!isExpanded)

  return (
    <div className="min-h-screen flex">
      <CollapsibleSidebar isExpanded={isExpanded} onToggle={handleToggle} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header username={userData.username} role={userData.role} />
        <main className="flex-1 bg-gray-50 p-8 min-w-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}