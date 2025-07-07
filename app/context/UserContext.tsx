"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"


type UserContextType = {
  isPremium: boolean
  refreshUserStatus: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  isPremium: false,
  refreshUserStatus: async () => {},
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false)


  const refreshUserStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsPremium(false)
      return
    }

    const { data, error } = await supabase
      .from("users")
      .select("is_premium")
      .eq("id", user.id)
      .single()

    if (!error && data?.is_premium) {
      setIsPremium(true)
    } else {
      setIsPremium(false)
    }
  }

  useEffect(() => {
    refreshUserStatus()
  }, [])

  return (
    <UserContext.Provider value={{ isPremium, refreshUserStatus }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
