'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !authData.user) return { error: error?.message || 'Login failed.' }

  const { data: userData } = await supabase
    .from('users')
    .select('is_premium')
    .eq('id', authData.user.id)
    .single()

  return {
    success: true,
    isPremium: userData?.is_premium ?? false,
  }
}
