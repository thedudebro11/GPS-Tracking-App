"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  Download,
  Share2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"



type LocationEntry = {
  id: number
  latitude: number
  longitude: number
  accuracy: number
  address?: string
  created_at: string
  triggered_at?: string
  is_emergency?: boolean
}

export function HistoryScreen() {
  const [locations, setLocations] = useState<LocationEntry[]>([])
  const [emergencies, setEmergencies] = useState<LocationEntry[]>([])
  const [timeRange, setTimeRange] = useState("24h")
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.emergencies)) {
          const formatted = data.emergencies.map((e: LocationEntry) => ({
            ...e,
            created_at: e.triggered_at,
            is_emergency: true,
          }))
          setEmergencies(formatted)
        }
      })
      .catch(err => {
        console.error("❌ Failed to fetch emergencies:", err)
      })
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📍 Location API Response:", data)
        if (Array.isArray(data.locations)) {
          const sorted = data.locations.sort(
            (a: LocationEntry, b: LocationEntry) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          setLocations(sorted)
        } else {
          console.error("❌ Invalid format for locations:", data)
          setLocations([])
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch locations:", err)
        setLocations([])
      })
  }, [])

  const merged = [...locations, ...emergencies]
  const sorted = merged.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  console.log("📦 Merged Locations + Emergencies:", sorted)

  const displayedLocations = showAll ? sorted : sorted.slice(0, 5)

  return (
    <div className="flex flex-col h-full">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Location History</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[100px] bg-blue-500 border-blue-400 text-white">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d" disabled>
                <div className="flex items-center">
                  <span>Last 7d</span>
                  <Crown className="h-3 w-3 ml-1 text-amber-500" />
                </div>
              </SelectItem>
              <SelectItem value="30d" disabled>
                <div className="flex items-center">
                  <span>Last 30d</span>
                  <Crown className="h-3 w-3 ml-1 text-amber-500" />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4 relative">
          <div className="text-center text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p>Map view will appear here</p>
            <p className="text-xs">(Map integration required)</p>
          </div>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button variant="outline" size="sm" className="bg-white shadow-sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="bg-white shadow-sm" disabled>
              <Download className="h-4 w-4 mr-1" />
              <Crown className="h-3 w-3 mr-1 text-amber-500" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Recent Locations</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            Last 24 hours
          </div>
        </div>

        <div className="space-y-3">
          {displayedLocations.length > 0 ? (
            displayedLocations.map((location) => {
              const keyPrefix = location.is_emergency ? 'emergency-' : 'location-'
              const uniqueKey = `${keyPrefix}${location.id}`

              console.log("🧪 Location Entry:", location)

              return (
                <Collapsible
                  key={uniqueKey}
                  open={expandedLocation === uniqueKey}
                  onOpenChange={() =>
                    setExpandedLocation(
                      expandedLocation === uniqueKey ? null : uniqueKey
                    )
                  }
                >
                  <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <CollapsibleTrigger className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {location.address || "Unknown Location"}
                              {location.is_emergency && (
                                <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-0.5 rounded">
                                  🚨 EMERGENCY
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {isClient &&
                                new Date(location.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                            </p>
                          </div>
                        </div>
                        {expandedLocation === uniqueKey ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-3 mt-3 border-t">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Latitude</p>
                            <p>{location.latitude.toFixed(6)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Longitude</p>
                            <p>{location.longitude.toFixed(6)}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500">Timestamp</p>
                            <p>{isClient && new Date(location.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Share2 className="h-3 w-3 mr-1" />
                            Share This Location
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              )
            })
          ) : (
            <p className="text-sm text-gray-500 text-center mt-6">
              No location entries available.
            </p>
          )}

          {locations.length > 5 && (
            <div className="flex justify-center mt-2">
              <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show Less" : "Show All"}
              </Button>
            </div>
          )}
        </div>

        <Card className="bg-blue-50 border-blue-200 mt-4">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-blue-700">
              Free plan stores location history for 24 hours only.
            </p>
            <Button variant="link" className="text-blue-700 p-0 h-auto mt-1">
              Upgrade to Premium for 30-day history
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
