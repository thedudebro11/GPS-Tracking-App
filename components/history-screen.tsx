"use client"

import { useEffect, useState, useRef } from "react"
import {
  Calendar,
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
import { MapView } from "@/components/map-view"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SupabaseClient } from "@supabase/supabase-js"
import { useUser } from "@/app/context/UserContext"


type LocationEntry = {
  id: number
  latitude: number
  longitude: number
  accuracy: number
  address?: string
  created_at: string
  triggered_at?: string
  is_emergency?: boolean
  is_active_tracking?: boolean
}

export function HistoryScreen() {
  const { isPremium } = useUser()
  const [locations, setLocations] = useState<LocationEntry[]>([])
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h")
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [focusedLocation, setFocusedLocation] = useState<LocationEntry | null>(null)
  const channelRef = useRef<ReturnType<SupabaseClient['channel']> | null>(null)
  const { refreshUserStatus } = useUser()


  useEffect(() => {
    refreshUserStatus()
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchAll = async (
    supabase: SupabaseClient,
    userId: string,
    timeRange: "24h" | "7d" | "30d",
    setLocations: (data: LocationEntry[]) => void
  ) => {
    const now = Date.now()
    const rangeLimit = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    }
    const fromTime = new Date(now - rangeLimit[timeRange]).toISOString()

    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", fromTime)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setLocations(data as LocationEntry[])
      console.log("🛰️ Live fetched locations:", data)
    } else {
      console.error("❌ Fetch failed:", error)
    }

    console.log("🛰️ Live fetched locations:", data)
    setLocations((data || []) as LocationEntry[])

  }


  useEffect(() => {
    const supabase = createClientComponentClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })


    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await fetchAll(supabase, user.id, timeRange, setLocations)

      // Unsubscribe old channel if it exists
      if (channelRef.current) {
        channelRef.current.unsubscribe()
      }

      const channel = supabase
        .channel(`realtime-location-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "locations"
          },
          (payload) => {
            console.log("🧠 SUBSCRIPTION FIRED", payload)
            fetchAll(supabase, user.id, timeRange, setLocations)
          }
        )
        .subscribe()

      channelRef.current = channel
    }

    setup()

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe()
        channelRef.current = null
      }
    }
  }, [timeRange])


  const sorted = [...locations].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const merged = sorted.map((entry, index) => ({
    ...entry,
    is_active_tracking: index === 0,
  }))

  const displayedLocations = showAll ? merged : merged.slice(0, 5)


  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Location History</h1>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "24h" | "7d" | "30d")}>
            <SelectTrigger className="w-[100px] bg-blue-500 border-blue-400 text-white">
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

      <main className="flex-1 overflow-y-auto p-4 pb-[7rem] space-y-4">
        <div className="bg-gray-100 h-64 rounded-lg overflow-hidden mb-4 relative">
          <MapView
            key={focusedLocation ? `focused-${focusedLocation.latitude}-${focusedLocation.longitude}` : "latest"}
            locations={
              focusedLocation
                ? [{ ...focusedLocation, is_active_tracking: true }]
                : sorted.length > 0
                  ? [{ ...sorted[0], is_active_tracking: true }]
                  : []
            }
            focusedLocation={focusedLocation}
          />
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

              return (
                <Collapsible
                  key={uniqueKey}
                  open={expandedLocation === uniqueKey}
                  onOpenChange={() =>
                    setExpandedLocation(expandedLocation === uniqueKey ? null : uniqueKey)
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
                        <div className="flex justify-end mt-3 space-x-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Share2 className="h-3 w-3 mr-1" />
                            Share This Location
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                            onClick={() => setFocusedLocation(location)}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            View on Map
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
            {!isPremium ? (
              <>
                <p className="text-sm text-blue-700">
                  Free plan stores location history for 24 hours only.
                </p>
                <Button variant="link" className="text-blue-700 p-0 h-auto mt-1">
                  Upgrade to Premium for 30-day history
                </Button>
              </>
            ) : (
              <p className="text-sm text-blue-700">
                You’re on Premium — full 30-day location history unlocked. 🎉
              </p>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  )
}
