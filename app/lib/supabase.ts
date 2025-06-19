import { createClient } from '@supabase/supabase-js'

// 環境変数を取得し、前後の空白と改行を除去
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://ezlvxuxofwwnhepjwnfe.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bHZ4dXhvZnd3bmhlcGp3bmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNDQyMTcsImV4cCI6MjA2NTkyMDIxN30.VR4SLmmr0_okN1j2ofCyqJJtcizUZYPsTn9qV-bJ78w'

console.log('Supabase設定:', { 
  url: supabaseUrl?.substring(0, 30) + '...', 
  hasKey: !!supabaseAnonKey,
  urlLength: supabaseUrl?.length,
  keyLength: supabaseAnonKey?.length
})

// URLとキーの形式を検証（デバッグ用に一時的に無効化）
console.log('URL:', supabaseUrl)
console.log('Key length:', supabaseAnonKey.length)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

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
    
    // 入力値をバリデーション
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    
    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('メールアドレスとパスワードが必要です')
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
    })
    console.log('signUp結果:', { data: !!data, error })
    return { data, error }
  } catch (err) {
    console.error('signUpエラー:', err)
    if (err instanceof Error && err.message.includes('Invalid value')) {
      console.error('Invalid value エラー詳細:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
    }
    throw err
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}