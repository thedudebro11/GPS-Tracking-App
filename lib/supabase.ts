import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// If you don't have database types, just omit them:
export const supabase = createClientComponentClient()
