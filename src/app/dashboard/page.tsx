
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { BarChart, Users, Clock, CheckCircle, XCircle, Loader2  } from "lucide-react"

interface Queue {
  id: string
  status: "pending" | "in_process" | "completed" | "failed"
}

interface Stats {
  totalQueues: number
  pendingQueues: number
  completedQueues: number
  activeWorkers: number
  inProgressQueues: number
  failedQueues: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalQueues: 0,
    pendingQueues: 0,
    completedQueues: 0,
    activeWorkers: 0,
    inProgressQueues: 0,
    failedQueues: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.post("/api/queues", {})
      const queues: Queue[] = response.data

      // Calculate stats from queues data
      const stats = {
        totalQueues: queues.length,
        pendingQueues: queues.filter(q => q.status === "pending").length,
        inProgressQueues: queues.filter(q => q.status === "in_process").length,
        completedQueues: queues.filter(q => q.status === "completed").length,
        failedQueues: queues.filter(q => q.status === "failed").length,
        activeWorkers: 0 // This might need to come from a different API endpoint
      }

      setStats(stats)
    } catch (error) {
      console.error("Failed to fetch queues:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <BarChart className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Queues</p>
              <p className="text-2xl font-bold">{stats.totalQueues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Queues</p>
              <p className="text-2xl font-bold">{stats.pendingQueues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgressQueues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Queues</p>
              <p className="text-2xl font-bold">{stats.completedQueues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg mr-4">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed Tasks</p>
              <p className="text-2xl font-bold">{stats.failedQueues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg mr-4">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Workers</p>
              <p className="text-2xl font-bold">{stats.activeWorkers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-black">Queue Status Overview</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Pending</span>
              <span className="text-sm font-medium text-gray-700">
                {stats.totalQueues > 0 ? Math.round((stats.pendingQueues / stats.totalQueues) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalQueues > 0 ? (stats.pendingQueues / stats.totalQueues) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">In Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {stats.totalQueues > 0 ? Math.round((stats.inProgressQueues / stats.totalQueues) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalQueues > 0 ? (stats.inProgressQueues / stats.totalQueues) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Completed</span>
              <span className="text-sm font-medium text-gray-700">
                {stats.totalQueues > 0 ? Math.round((stats.completedQueues / stats.totalQueues) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalQueues > 0 ? (stats.completedQueues / stats.totalQueues) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Failed</span>
              <span className="text-sm font-medium text-gray-700">
                {stats.totalQueues > 0 ? Math.round((stats.failedQueues / stats.totalQueues) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalQueues > 0 ? (stats.failedQueues / stats.totalQueues) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}