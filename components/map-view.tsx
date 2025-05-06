"use client"

import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Loader2 } from "lucide-react"

// In a real app, you would store this in an environment variable
// This is a public token for demonstration purposes only
mapboxgl.accessToken = "pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xsZnRqaDh5MDJ1eTNlbzR6bGp4eTJreSJ9.qRBNOm4UPtpgRYn4-ryg9A"

interface MapViewProps {
  latitude: number
  longitude: number
  zoom?: number
  interactive?: boolean
  className?: string
}

export function MapView({ latitude, longitude, zoom = 14, interactive = true, className = "" }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom: zoom,
      interactive: interactive,
      attributionControl: true,
    })

    // Add navigation controls if interactive
    if (interactive) {
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    }

    // Add a marker at the specified location
    marker.current = new mapboxgl.Marker({ color: "#FF0000" }).setLngLat([longitude, latitude]).addTo(map.current)

    // Add a pulsing dot to indicate current position
    const el = document.createElement("div")
    el.className = "pulse-dot"
    el.style.width = "20px"
    el.style.height = "20px"
    el.style.borderRadius = "50%"
    el.style.backgroundColor = "rgba(66, 135, 245, 0.4)"
    el.style.position = "absolute"
    el.style.transform = "translate(-50%, -50%)"
    el.style.animation = "pulse 1.5s infinite"

    // Add the pulsing dot to the map
    new mapboxgl.Marker(el, { anchor: "center" }).setLngLat([longitude, latitude]).addTo(map.current)

    // Add CSS for the pulsing animation
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    // Set loading to false when the map is loaded
    map.current.on("load", () => {
      setLoading(false)
    })

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      document.head.removeChild(style)
    }
  }, [latitude, longitude, zoom, interactive])

  // Update marker position if coordinates change
  useEffect(() => {
    if (map.current && marker.current) {
      marker.current.setLngLat([longitude, latitude])
      map.current.flyTo({
        center: [longitude, latitude],
        essential: true,
      })
    }
  }, [latitude, longitude])

  return (
    <div className={`relative w-full h-full rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      )}
    </div>
  )
}
