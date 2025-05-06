"use client"

import { useEffect, useState } from "react"
import { Battery, Signal, AlertTriangle, Share2, MapPin, Maximize2, Copy } from "lucide-react"
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
import { MapView } from "./map-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function HomeScreen() {
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
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

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.")
      return
    }

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          setCurrentLocation({
            latitude,
            longitude,
            accuracy,
            updatedAt: new Date(),
          })
          // 🚀 Send location to backend
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude,
              longitude,
              accuracy,
            }),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to save location")
              console.log("📍 Location saved to backend")
            })
            .catch((err) => {
              console.error("❌ Error saving location:", err)
            })

        },
        (error) => {
          console.error("Error getting geolocation:", error)
        },
        { enableHighAccuracy: true }
      )
    }


    updateLocation()
    const intervalId = setInterval(updateLocation, 30000)

    return () => clearInterval(intervalId)
  }, [])




  useEffect(() => {
    if (currentLocation?.updatedAt) {
      setFormattedTime(currentLocation.updatedAt.toLocaleTimeString())
      setRelativeTime(formatTimeAgo(currentLocation.updatedAt))
    }
  }, [currentLocation])



  const copyCoordinates = () => {
    if (!currentLocation) return
    const coordText = `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
    navigator.clipboard.writeText(coordText).then(
      () => {
        toast({
          title: "Coordinates copied",
          description: "Location coordinates copied to clipboard",
        })
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Could not copy coordinates to clipboard",
          variant: "destructive",
        })
      }
    )
  }
  if (!currentLocation) {
    return <div className="p-4 text-center text-gray-500">Fetching current location...</div>
  }
  return (
    <div className="flex flex-col h-full">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">SafeSteps</h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Battery className="h-5 w-5 mr-1" />
              <span className="text-sm">{batteryLevel}%</span>
            </div>
            <div className="flex items-center">
              <Signal className="h-5 w-5" />
              <span className="text-sm">{signalStrength}/5</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6">
        <Card className="shadow-md border-blue-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-center">Current Location</h2>
              <p className="text-gray-500 text-center">
                Last updated: {formattedTime} ({relativeTime})
              </p>
            </div>

            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shadow-sm border border-gray-200">
              {currentLocation && <MapView latitude={currentLocation.latitude} longitude={currentLocation.longitude} />}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="absolute top-2 left-2 bg-white shadow-md z-10">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90vw] h-[80vh] p-0">
                  <DialogHeader className="p-4 pb-0">
                    <DialogTitle>Location Map</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 h-full p-4 pt-0">
                    <div className="w-full h-full">
                      {currentLocation && <MapView latitude={currentLocation.latitude} longitude={currentLocation.longitude} zoom={15} interactive={true} />}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {currentLocation && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Latitude</p>
                    <div className="flex items-center">
                      <p className="font-mono">{currentLocation.latitude.toFixed(6)}°</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Longitude</p>
                    <div className="flex items-center">
                      <p className="font-mono">{currentLocation.longitude.toFixed(6)}°</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-between items-center">
                    <Button variant="outline" size="sm" className="text-xs mt-1" onClick={copyCoordinates}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Coordinates
                    </Button>
                    <div>
                      <p className="text-gray-500 text-xs">Accuracy</p>
                      <p className="text-xs">±{currentLocation.accuracy} meters</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 font-medium">Address</p>
                    <p>{currentLocation.address}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "100%" }}></div>
            </div>
            <p className="text-sm text-gray-500 text-center">Next update in: 28 minutes</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white h-16 rounded-xl shadow-md" onClick={() => setShowEmergencyAlert(true)}>
            <AlertTriangle className="mr-2 h-5 w-5" />
            Trigger Emergency Alert
          </Button>

          <Button size="lg" variant="outline" className="border-blue-300 text-blue-700 h-16 rounded-xl shadow-sm" onClick={() => setShowShareDialog(true)}>
            <Share2 className="mr-2 h-5 w-5" />
            Share Location History
          </Button>
        </div>
      </main>

      <AlertDialog open={showEmergencyAlert} onOpenChange={setShowEmergencyAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trigger Emergency Alert</AlertDialogTitle>
            <AlertDialogDescription>
              This will send an emergency alert with your current location to all your emergency contacts. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Send Emergency Alert</AlertDialogAction>
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
            <AlertDialogAction className="bg-blue-600 hover:bg-blue-700">Generate Link</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "just now"
  if (diffInMinutes === 1) return "1 minute ago"
  return `${diffInMinutes} minutes ago`
}
