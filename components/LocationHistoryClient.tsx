"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

type LocationEntry = {
  id: number
  latitude: number
  longitude: number
  accuracy: number
  created_at: string
  is_emergency?: boolean
}

export function LocationHistoryClient() {
  const [locations, setLocations] = useState<LocationEntry[]>([])

  const fetchLocationHistory = async () => {
    console.log("⏱️ Fetching location history...")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`, {
        cache: "no-store",
      })

      const json = await res.json()
      if (!json.success || !Array.isArray(json.locations)) throw new Error("Invalid response")

      const newData = json.locations

      const isDifferent = JSON.stringify(newData) !== JSON.stringify(locations)
      if (isDifferent) {
        console.log("🔄 Updating UI with new locations")
        setLocations(newData)
      } else {
        console.log("⏸️ No change in data")
      }
    } catch (err) {
      console.error("❌ Error loading location history:", err)
    }
  }

  useEffect(() => {
    fetchLocationHistory()
    const interval = setInterval(fetchLocationHistory, 15000) // every 15 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    console.log("🧩 Updated Locations:", locations)
  }, [locations])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📍 Location History</h1>
      {locations.length === 0 ? (
        <p>No location entries yet.</p>
      ) : (
        locations
          .slice()
          .reverse()
          .map((loc) => (
            <Card key={loc.id} className={`mb-4 shadow ${loc.is_emergency ? "border-red-500" : ""}`}>
              <CardContent className="p-4 space-y-1">
                <p><strong>Latitude:</strong> {loc.latitude}</p>
                <p><strong>Longitude:</strong> {loc.longitude}</p>
                <p><strong>Accuracy:</strong> ±{loc.accuracy.toFixed(2)} meters</p>
                <p><strong>Time:</strong> {new Date(loc.created_at).toLocaleString()}</p>
                {loc.is_emergency && <p className="text-red-600 font-semibold">🚨 Emergency Ping</p>}
              </CardContent>
            </Card>
          ))
      )}
    </div>
  )
}
