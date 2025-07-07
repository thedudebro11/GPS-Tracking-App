"use client"

import { SettingsScreen } from "@/components/settings-screen"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { type User } from "@supabase/supabase-js"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"

export default function SettingsPage() {
  const session = useSupabaseSession()
  const [user, setUser] = useState<User | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    // Wait until session is ready before doing anything
    if (!session) return

    

    const load = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      const user = data.user
      setUser(user)

      const { data: profile } = await supabase
        .from("users")
        .select("is_premium")
        .eq("id", user.id)
        .single()

      setIsPremium(profile?.is_premium ?? false)
    }

    load()
  }, [session]) // only run once session is available

  if (!session || !user) return <div>Loading settings...</div>

  return <SettingsScreen user={user} isPremium={isPremium} />
}
