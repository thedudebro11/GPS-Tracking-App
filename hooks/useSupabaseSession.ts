"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Session } from "@supabase/supabase-js"

export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        supabase.auth.signOut().then(() => {
          router.push("/login")
        })
      } else {
        setSession(session)
      }
    })
  }, [])

  return session
}
