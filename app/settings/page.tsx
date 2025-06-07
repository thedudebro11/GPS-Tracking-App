"use client"

import { SettingsScreen } from "@/components/settings-screen"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { type User } from "@supabase/supabase-js"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const supabase = createClientComponentClient()

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
  }, [])

  if (!user) return <div>Loading...</div>

  return <SettingsScreen user={user} isPremium={isPremium} />
}
