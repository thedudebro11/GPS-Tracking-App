"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeScreen } from "@/components/home-screen"
import { ContactsScreen } from "@/components/contacts-screen"
import { SettingsScreen } from "@/components/settings-screen"
import { HistoryScreen } from "@/components/history-screen"
import { Home, Users, Settings, Clock, AlertTriangle } from "lucide-react"
import { EmergencyScreen } from "@/components/emergency-screen"


export default function SafeStepsApp() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      <div className="flex-1 overflow-auto pb-16">
        <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsContent value="home" className="flex-1 p-0 m-0">
            <HomeScreen />
          </TabsContent>
          <TabsContent value="contacts" className="flex-1 p-0 m-0">
            <ContactsScreen />
          </TabsContent>
          <TabsContent value="settings" className="flex-1 p-0 m-0">
            <SettingsScreen />
          </TabsContent>
          <TabsContent value="history" className="flex-1 p-0 m-0">
            <HistoryScreen />
          </TabsContent>
          <TabsContent value="alerts" className="flex-1 p-0 m-0">
            <EmergencyScreen />
          </TabsContent>


          <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
            <TabsList className="w-full h-16 grid grid-cols-4 bg-transparent">
              <TabsTrigger
                value="home"
                className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50 rounded-none"
              >
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">Home</span>
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50 rounded-none"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs mt-1">Contacts</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50 rounded-none"
              >
                <Clock className="h-5 w-5" />
                <span className="text-xs mt-1">History</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50 rounded-none"
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs mt-1">Settings</span>
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="flex flex-col items-center justify-center data-[state=active]:bg-red-50 rounded-none"
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs mt-1">Alerts</span>
              </TabsTrigger>

            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
