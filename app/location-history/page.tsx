// app/location-history/page.tsx

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"



type LocationEntry = {
  id: number
  latitude: number
  longitude: number
  accuracy: number
  created_at: string
}

export default function LocationHistoryPage() {
  const [locations, setLocations] = useState<LocationEntry[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`)
      .then((res) => res.json())
      .then(setLocations)
      .catch(console.error)
  }, [])

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
            <Card key={loc.id} className="mb-4 shadow">
              <CardContent className="p-4 space-y-1">
                <p><strong>Latitude:</strong> {loc.latitude}</p>
                <p><strong>Longitude:</strong> {loc.longitude}</p>
                <p><strong>Accuracy:</strong> ±{loc.accuracy.toFixed(2)} meters</p>
                <p><strong>Time:</strong> {new Date(loc.created_at).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))
      )}
    </div>
  )
}
