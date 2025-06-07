import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  // 🔍 Log request and env variables
  console.log("📥 Incoming data:", body)
  console.log("🧪 ENV:", process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { latitude, longitude, accuracy, user_id, is_emergency, id, ...rest } = body


  const payload = {
  latitude,
  longitude,
  accuracy,
  user_id,
  is_emergency,
}

const { data, error } = await supabase
  .from('locations')
  .insert([payload])


  if (error) {
    console.error('❌ Supabase insert error:', error)
    return NextResponse.json({ status: 'error', error }, { status: 500 })
  }

  return NextResponse.json({ status: 'success', data }, { status: 200 })
}
