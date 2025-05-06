"use client"

import "mapbox-gl/dist/mapbox-gl.css" // ✅ ADD THIS LINE FIRST
import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"


mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type MapViewProps = {
  latitude: number
  longitude: number
  zoom?: number
  interactive?: boolean
}

export function MapView({
  latitude,
  longitude,
  zoom = 13,
  interactive = false,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom,
      interactive,
    })

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map)

    return () => map.remove()
  }, [latitude, longitude, zoom, interactive])

  return <div ref={mapContainerRef} className="w-full h-full rounded-md overflow-hidden" />
}
