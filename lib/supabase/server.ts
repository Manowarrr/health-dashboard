// MODULE_CONTRACT:
// PURPOSE: [Предоставляет функцию для создания СЕРВЕРНОГО экземпляра Supabase.
//           Этот клиент предназначен для использования в Server Components, Server Actions и Route Handlers.]
// SCOPE: [Серверная аутентификация, безопасное взаимодействие с БД.]
// KEYWORDS_MODULE: [supabase, server-component, cookies, auth]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 1]

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// START_FUNCTION_createClient
// CONTRACT:
// PURPOSE: [Создает и возвращает экземпляр клиента Supabase для использования на сервере,
//           используя cookie для управления сессией.]
// OUTPUTS: [SupabaseClient] - Клиент Supabase.
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
// END_FUNCTION_createClient
