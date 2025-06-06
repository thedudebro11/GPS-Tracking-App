"use client"

import { useEffect, useState } from "react"
import {
  Battery,
  Signal,
  AlertTriangle,
  Share2,
  MapPin,
  Maximize2,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { MapView } from "./map-view"
import { BackgroundPinger } from "./BackgroundPinger"
import { signOut } from "@/lib/auth"



type HomeScreenProps = {
  isPremium: boolean
  setActiveTab: (tab: string) => void
}

export function HomeScreen({ isPremium, setActiveTab }: HomeScreenProps) {

  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showEmergencySetup, setShowEmergencySetup] = useState(false)
  const [showTrackingSettings, setShowTrackingSettings] = useState(false)
  const [emergencyMode, setEmergencyMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("emergencyMode") === "true"
    }
    return false
  })

  const [pingInterval, setPingInterval] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pingInterval")
      return stored ? Number(stored) : 30000
    }
    return 30000
  })
  const [trackingEnabled, setTrackingEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTrackingEnabled") === "true"
    }
    return false
  })


  const { toast } = useToast()
  const [formattedTime, setFormattedTime] = useState("")
  const [relativeTime, setRelativeTime] = useState("")


  type LocationData = {
    latitude: number
    longitude: number
    accuracy: number
    address?: string
    updatedAt: Date
  }

  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const batteryLevel = 78
  const signalStrength = 4

  // Persist state
  useEffect(() => {
    localStorage.setItem("emergencyMode", emergencyMode.toString())
  }, [emergencyMode])

  useEffect(() => {
    localStorage.setItem("pingInterval", pingInterval.toString())
  }, [pingInterval])

  useEffect(() => {
    if (!navigator.geolocation) return

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          const updatedAt = new Date()
          setCurrentLocation({ latitude, longitude, accuracy, updatedAt })
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      )
    }

    updateLocation() // run once
  }, [])


  // UI Time
  useEffect(() => {
    if (currentLocation?.updatedAt) {
      setFormattedTime(currentLocation.updatedAt.toLocaleTimeString())
      setRelativeTime(formatTimeAgo(currentLocation.updatedAt))
    }
  }, [currentLocation])

  const copyCoordinates = () => {
    if (!currentLocation) return
    const text = `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
    navigator.clipboard.writeText(text).then(
      () => toast({ title: "Coordinates copied" }),
      () => toast({ title: "Failed to copy", variant: "destructive" })
    )
  }

  const sendEmergencyAlert = async () => {
    if (!currentLocation) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          accuracy: currentLocation.accuracy,
          user_id: "guest",
          message: "User triggered emergency alert!",
          is_emergency: true,
        }),
      })

      const data = await res.json()
      toast({
        title: "🚨 Emergency Sent",
        description: data.status || "Alert stored successfully.",
      })
    } catch (err) {
      console.error("Emergency alert failed", err)
      toast({
        title: "Error",
        description: "Failed to send emergency alert.",
        variant: "destructive",
      })
    }
  }

  if (!currentLocation) {
    return <div className="p-4 text-center text-gray-500">Fetching current location...</div>
  }

  return (
    <>
      <BackgroundPinger />
      {isPremium ? (
  <p className="text-green-600 text-sm">Premium feature unlocked!</p>
) : (
  <button onClick={() => setActiveTab("settings")} className="text-blue-600 underline text-sm">
    Upgrade to Premium to use this feature
  </button>
)}


      <div className="flex flex-col min-h-screen">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">SafeSteps</h1>
            <div className="flex space-x-3">
              <div className="flex items-center">
                <button
                  onClick={async () => {
                    await signOut()
                    window.location.href = "/login"
                  }}
                  className="text-sm text-white underline hover:text-red-300 transition"
                >
                  Log Out
                </button>
              </div>

              <div className="flex items-center">
                
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-[7rem] space-y-6">
          <Card className="shadow-md border-blue-100">
            <CardContent className="p-6 pb-8">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Current Location</h2>
                <p className="text-gray-500">Last updated: {formattedTime} ({relativeTime})</p>
              </div>

              <div className="relative h-48 w-full rounded-lg mb-4 overflow-hidden shadow-sm border">
                <MapView
                  locations={[{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    created_at: currentLocation.updatedAt.toISOString(),
                    is_emergency: emergencyMode,
                    is_active_tracking: true
                  }]}
                />





                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="absolute top-2 left-2 bg-white shadow-md">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[90vw] h-[80vh] p-0">
                    <DialogHeader className="p-4 pb-0">
                      <DialogTitle>Location Map</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 p-4 pt-0">
                      {currentLocation && (
                        <MapView
                          locations={[{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            created_at: new Date().toISOString(),
                            is_emergency: emergencyMode,
                            is_active_tracking: true
                          }]}
                        />


                      )}

                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Latitude</p>
                  <p className="font-mono">{currentLocation.latitude.toFixed(6)}°</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Longitude</p>
                  <p className="font-mono">{currentLocation.longitude.toFixed(6)}°</p>
                </div>
                <div className="col-span-2 flex justify-between items-center">
                  <Button size="sm" variant="outline" className="text-xs" onClick={copyCoordinates}>
                    <Copy className="h-3 w-3 mr-1" /> Copy Coordinates
                  </Button>
                  <div>
                    <p className="text-gray-500 text-xs">Accuracy</p>
                    <p className="text-xs">±{currentLocation.accuracy} meters</p>
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "100%" }}></div>
              </div>
              <p className="text-sm text-center text-gray-500">
                Next update in {pingInterval / 1000} seconds
              </p>

              <Button
                variant="default"
                className="w-full bg-green-600 text-white hover:bg-green-700"
                onClick={() => setShowTrackingSettings(true)}
              >
                📡 Active Tracking
              </Button>
              {showTrackingSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
                    <h2 className="text-lg font-semibold mb-4">Active Tracking Settings</h2>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={trackingEnabled}
                          onChange={(e) => setTrackingEnabled(e.target.checked)}
                        />
                        <span>Enable Active Tracking</span>
                      </label>

                      <div>
                        <label className="text-sm font-medium">Ping Interval:</label>
                        <select
                          value={pingInterval}
                          onChange={(e) => setPingInterval(Number(e.target.value))}
                          className="w-full border rounded p-2 mt-1"
                        >
                          <option value={30000}>Every 30 seconds</option>
                          <option value={60000}>Every 1 minute</option>
                          <option value={300000}>Every 5 minutes</option>
                        </select>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setShowTrackingSettings(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => {
                            setShowTrackingSettings(false)
                            localStorage.setItem("activeTrackingEnabled", trackingEnabled.toString())
                            localStorage.setItem("pingInterval", pingInterval.toString())
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              <div className="mt-4">
                <Button
                  size="lg"
                  className={`h-16 w-full rounded-xl shadow-md ${emergencyMode ? "bg-gray-300 text-black" : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  onClick={() => {
                    if (emergencyMode) {
                      setEmergencyMode(false)
                    } else {
                      setShowEmergencySetup(true)
                    }
                  }}
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  {emergencyMode ? "Turn Off Emergency Mode" : "Activate Emergency Mode"}
                </Button>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-700 rounded-xl py-3 px-4 text-base font-semibold flex items-center justify-center hover:bg-blue-50 transition"
                  onClick={() => setShowShareDialog(true)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Location History
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <AlertDialog open={showEmergencySetup} onOpenChange={setShowEmergencySetup}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Activate Emergency Mode</AlertDialogTitle>
              <AlertDialogDescription>
                SafeSteps will send your GPS location to emergency contacts at the selected interval.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4">
              <select
                className="w-full border px-2 py-1 rounded-md"
                value={pingInterval}
                onChange={(e) => setPingInterval(Number(e.target.value))}
              >
                <option value={30000}>Every 30 seconds</option>
                <option value={60000}>Every 1 minute</option>
                <option value={1800000}>Every 30 minutes</option>
              </select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  sendEmergencyAlert()
                  setEmergencyMode(true)
                  setShowEmergencySetup(false)
                }}
              >
                Start Emergency Mode
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Share Location History</AlertDialogTitle>
              <AlertDialogDescription>
                Generate a secure link to share your location history for the next 24 hours.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-blue-600 hover:bg-blue-700">
                Generate Link
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diff < 1) return "just now"
  if (diff === 1) return "1 minute ago"
  return `${diff} minutes ago`
}
