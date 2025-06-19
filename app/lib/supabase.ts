import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase設定:', { 
  url: supabaseUrl?.substring(0, 30) + '...', 
  hasKey: !!supabaseAnonKey 
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase環境変数が設定されていません')
  throw new Error('Supabase環境変数が設定されていません。.env.localファイルを確認してください。')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface DatabaseProgress {
  id: string
  user_id: string
  phases: any // JSON
  updated_at: string
  created_at: string
}

export interface DatabaseExperiment {
  id: string
  user_id: string
  name: string
  date: string
  model_type: string
  avg_fps: number
  avg_inference_time: number
  avg_cpu_temp: number
  fitness?: number
  parameters: any // JSON
  notes?: string
  created_at: string
  updated_at: string
}

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

export const signInWithPassword = async (email: string, password: string) => {
  try {
    console.log('signInWithPassword呼び出し:', { email })
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log('signInWithPassword結果:', { data: !!data, error })
    return { data, error }
  } catch (err) {
    console.error('signInWithPasswordエラー:', err)
    throw err
  }
}

export const signUp = async (email: string, password: string) => {
  try {
    console.log('signUp呼び出し:', { email })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    console.log('signUp結果:', { data: !!data, error })
    return { data, error }
  } catch (err) {
    console.error('signUpエラー:', err)
    throw err
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}