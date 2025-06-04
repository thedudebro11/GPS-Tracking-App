// app/settings/page.tsx (server component)
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return <div className="p-4 text-center">You must be logged in</div>
  }

  return (
    <div className="p-4">
      {/* Your protected settings UI */}
    </div>
  )
}
