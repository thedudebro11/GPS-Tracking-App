'use client';

import { LocationHistoryClient } from "@/components/LocationHistoryClient"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"

export default function LocationHistoryPage() {
  const session = useSupabaseSession()

  if (!session) return <div>Loading session...</div>
  return <LocationHistoryClient />
}
