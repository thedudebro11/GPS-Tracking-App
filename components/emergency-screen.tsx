"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Calendar, Share2, ChevronDown, ChevronUp, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/app/context/UserContext"


type EmergencyEntry = {
  id: number
  user_id: string
  latitude: number
  longitude: number
  accuracy: number
  message: string
  triggered_at: string
}

export function EmergencyScreen() {
  const [alerts, setAlerts] = useState<EmergencyEntry[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState("24h")
  const { isPremium } = useUser()
  const { refreshUserStatus } = useUser()


  useEffect(() => {
    refreshUserStatus()
  }, [])


  useEffect(() => {
    const fetchAlerts = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergencies`)
        .then((res) => res.json())
        .then(setAlerts)
        .catch(console.error)
    }

    fetchAlerts() // initial fetch
    const interval = setInterval(fetchAlerts, 10000) // every 10 seconds

    return () => clearInterval(interval) // cleanup
  }, [])


  const toggle = (id: number) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-red-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Emergency History</h1>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "24h" | "7d" | "30d")}>
            <SelectTrigger className="w-[100px] bg-red-500 border-red-400 text-white">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d" disabled={!isPremium}>
                <div className="flex items-center">
                  <span>Last 7d</span>
                  {!isPremium && <Crown className="h-3 w-3 ml-1 text-amber-500" />}
                </div>
              </SelectItem>
              <SelectItem value="30d" disabled={!isPremium}>
                <div className="flex items-center">
                  <span>Last 30d</span>
                  {!isPremium && <Crown className="h-3 w-3 ml-1 text-amber-500" />}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Recent Emergency Alerts</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            Last 24 hours
          </div>
        </div>

        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No emergency alerts recorded yet.</p>
        ) : (
          alerts
            .slice()
            .reverse()
            .map((alert) => (
              <Collapsible key={alert.id} open={expanded === alert.id} onOpenChange={() => toggle(alert.id)}>
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <CollapsibleTrigger className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-full mr-3">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-red-700">Alert from {alert.user_id}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(alert.triggered_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      {expanded === alert.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 mt-3 border-t">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Latitude</p>
                          <p>{alert.latitude.toFixed(6)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Longitude</p>
                          <p>{alert.longitude.toFixed(6)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Accuracy</p>
                          <p>±{alert.accuracy.toFixed(2)} meters</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500">Message</p>
                          <p>{alert.message}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500">Time</p>
                          <p>{new Date(alert.triggered_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share This Alert
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            ))
        )}
      </main>
    </div>
  )
}
