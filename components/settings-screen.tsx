"use client"

import { useState } from "react"
import { Bell, Clock, Battery, Shield, ChevronRight, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function SettingsScreen() {
  const [trackingEnabled, setTrackingEnabled] = useState(true)
  const [trackingFrequency, setTrackingFrequency] = useState("30")
  const [extendedHistory, setExtendedHistory] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm opacity-90 mt-1">Configure your SafeSteps experience</p>
      </header>

      <main className="flex-1 p-4 space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Battery className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Label htmlFor="tracking-toggle" className="font-medium">
                    GPS Tracking
                  </Label>
                  <p className="text-sm text-gray-500">Enable location tracking</p>
                </div>
              </div>
              <Switch id="tracking-toggle" checked={trackingEnabled} onCheckedChange={setTrackingEnabled} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Label htmlFor="frequency-select" className="font-medium">
                    Tracking Frequency
                  </Label>
                  <p className="text-sm text-gray-500">How often to update location</p>
                </div>
              </div>
              <Select value={trackingFrequency} onValueChange={setTrackingFrequency} disabled={!trackingEnabled}>
                <SelectTrigger id="frequency-select" className="w-[130px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Every 30 min</SelectItem>
                  <SelectItem value="60">Every 60 min</SelectItem>
                  <SelectItem value="10" disabled>
                    <div className="flex items-center">
                      <span>Every 10 min</span>
                      <Crown className="h-3 w-3 ml-1 text-amber-500" />
                    </div>
                  </SelectItem>
                  <SelectItem value="5" disabled>
                    <div className="flex items-center">
                      <span>Every 5 min</span>
                      <Crown className="h-3 w-3 ml-1 text-amber-500" />
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Label htmlFor="history-toggle" className="font-medium">
                    Extended History
                  </Label>
                  <p className="text-sm text-gray-500">Store location for 30 days</p>
                </div>
              </div>
              <div className="flex items-center">
                <Crown className="h-4 w-4 mr-2 text-amber-500" />
                <Switch
                  id="history-toggle"
                  checked={extendedHistory}
                  onCheckedChange={setExtendedHistory}
                  disabled={true}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Label className="font-medium">Notification Settings</Label>
                  <p className="text-sm text-gray-500">Configure alerts and notifications</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Crown className="h-6 w-6 mr-2 text-amber-300" />
              <h2 className="text-xl font-bold">Upgrade to Premium</h2>
            </div>
            <p className="mb-4 text-blue-100">
              Get access to faster tracking intervals, unlimited contacts, 30-day history, and more.
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-100">Starting at</p>
                <p className="text-xl font-bold">$9.99/month</p>
              </div>
              <Button className="bg-white text-blue-700 hover:bg-blue-50">Upgrade Now</Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 pt-2">
          <p>SafeSteps v1.0.0</p>
          <Button variant="link" className="text-xs text-gray-500 h-auto p-0 mt-1">
            Privacy Policy
          </Button>
          {" • "}
          <Button variant="link" className="text-xs text-gray-500 h-auto p-0">
            Terms of Service
          </Button>
        </div>
      </main>
    </div>
  )
}
