// components/BackgroundPinger.tsx
"use client"

import { useEffect } from "react"

export function BackgroundPinger() {
  useEffect(() => {
    const pingLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords
          const isEmergency = localStorage.getItem("emergencyMode") === "true"
          const pingInterval = Number(localStorage.getItem("pingInterval") || 30000)

          const payload = {
            latitude,
            longitude,
            accuracy,
            user_id: "guest",
            message: isEmergency ? "Auto emergency ping" : "Regular ping",
            is_emergency: isEmergency,
          }

          const endpoint = isEmergency
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/alerts`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/locations`

          try {
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
            const data = await res.json()
            console.log("✅ Background ping sent:", data)
          } catch (error) {
            console.error("❌ Background ping failed:", error)
          }
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      )
    }

    pingLocation()
    const intervalId = setInterval(pingLocation, 30000)
    return () => clearInterval(intervalId)
  }, [])

  return null // Silent background task
}
