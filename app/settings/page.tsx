// app/settings/page.tsx

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { SettingsScreen } from "@/components/settings-screen"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check for user presence
  if (!user || !user.created_at) {
    // Redirect to login if user is not authenticated or missing required info
    redirect("/login")
  }

  // Explicitly construct only the expected fields
  const safeUser = {
    email: user.email ?? "N/A",
    created_at: user.created_at,
    user_metadata: {
      is_premium: user.user_metadata?.is_premium ?? false,
    },
  }

  return <SettingsScreen user={safeUser} />
}
