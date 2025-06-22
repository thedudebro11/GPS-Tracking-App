'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies as nextCookies } from 'next/headers'

function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name) => {
          const cookies = await nextCookies()
          return cookies.get(name)?.value
        },
        set: async () => {
          // No-op: Cannot set cookies in Server Actions
        },
        remove: async () => {
          // No-op: Cannot remove cookies in Server Actions
        }
      }
    }
  )
}

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error || !authData.user) {
    return { error: error?.message || 'Login failed.' }
  }

  const { data: userData } = await supabase
    .from('users')
    .select('is_premium')
    .eq('id', authData.user.id)
    .single()

  return {
    success: true,
    isPremium: userData?.is_premium ?? false
  }
}
