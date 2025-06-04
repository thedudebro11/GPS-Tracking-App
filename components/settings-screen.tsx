"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Bell, User, Shield, Sun, Crown, FileText, MessageSquare } from "lucide-react"
import { useState } from "react"

export function SettingsScreen() {
  const [theme, setTheme] = useState("Light")

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md rounded-b-lg">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm opacity-90 mt-1">Manage your SafeSteps account and preferences</p>
      </header>

      <main className="flex-1 p-4 space-y-6">

        {/* Top Settings */}
        <Card>
          <CardContent className="p-4 space-y-3">

            {/* Account */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold">Account</p>
                  <p className="text-sm text-gray-500">Update your profile and change password</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold">Notifications</p>
                  <p className="text-sm text-gray-500">Manage alerts and app notifications</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Privacy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold">Privacy</p>
                  <p className="text-sm text-gray-500">Permissions and security options</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Appearance */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sun className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold">Appearance</p>
                  <p className="text-sm text-gray-500">Theme preference</p>
                </div>
              </div>
              <Button variant="outline" className="text-xs px-3 py-1">
                {theme}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade to Premium */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Crown className="h-6 w-6 mr-2 text-amber-300" />
              <h2 className="text-xl font-bold">Upgrade to Premium</h2>
            </div>
            <p className="mb-4 text-blue-100">
              Get 30-day location history and more
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

        {/* Data Export & Feedback */}
        <Card>
          <CardContent className="p-4 space-y-3">

            {/* Data Export */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <p className="font-semibold">Data Export</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Feedback */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-3" />
                <p className="font-semibold">Feedback</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-2">
          <p>SafeSteps v1.0.0</p>
          <Button variant="link" className="text-xs text-gray-500 h-auto p-0 mt-1">Privacy Policy</Button>
          {" • "}
          <Button variant="link" className="text-xs text-gray-500 h-auto p-0">Terms of Service</Button>
        </div>
      </main>
    </div>
  )
}
