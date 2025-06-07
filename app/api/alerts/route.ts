import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  const { latitude, longitude, accuracy, user_id, is_emergency } = body

  const { data, error } = await supabase
    .from('locations')
    .insert([{ latitude, longitude, accuracy, user_id, is_emergency }])

  if (error) {
    console.error('❌ Supabase insert error (alerts):', error)
    return NextResponse.json({ status: 'error', error }, { status: 500 })
  }

  return NextResponse.json({ status: 'success', data }, { status: 200 })
}
