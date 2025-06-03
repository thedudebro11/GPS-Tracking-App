"use client"

import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type LocationEntry = {
  latitude: number
  longitude: number
  is_emergency?: boolean
  is_active_tracking?: boolean
  created_at?: string
}

type MapViewProps = {
  locations: LocationEntry[]
  focusedLocation?: LocationEntry | null
}

export function MapView({ locations, focusedLocation }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  function createPulsingMarkerElement(color: "red" | "blue" = "red") {
    const el = document.createElement("div")
    el.classList.add("pulse-marker", color)
    return el
  }

  useEffect(() => {
    if (!mapContainerRef.current || !Array.isArray(locations) || locations.length === 0) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [locations[0].longitude, locations[0].latitude],
      zoom: 13,
      interactive: true,
    })

    mapRef.current = map

    locations.forEach((loc) => {
      console.log("Marker status", {
        emergency: loc.is_emergency,
        active: loc.is_active_tracking,
        location: loc,
      })

      const marker = loc.is_emergency
        ? new mapboxgl.Marker({ element: createPulsingMarkerElement("red") })
        : loc.is_active_tracking
        ? new mapboxgl.Marker({ element: createPulsingMarkerElement("blue") })
        : new mapboxgl.Marker({ color: "blue" })

      marker
        .setLngLat([loc.longitude, loc.latitude])
        .setPopup(
          new mapboxgl.Popup().setText(
            `${loc.is_emergency ? "🚨 Emergency" : "Ping"}\n${new Date(loc.created_at ?? "").toLocaleString()}`
          )
        )
        .addTo(map)
    })

    return () => map.remove()
  }, [locations])

  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [focusedLocation.longitude, focusedLocation.latitude],
        zoom: 15,
        essential: true,
      })
    }
  }, [focusedLocation])

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 text-xs rounded-md px-2 py-1 shadow z-10">
        🔵 = Normal &nbsp;&nbsp; 🔴 = Emergency
      </div>
    </div>
  )
}
