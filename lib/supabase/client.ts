// MODULE_CONTRACT:
// PURPOSE: [Предоставляет функцию для создания КЛИЕНТСКОГО (браузерного) экземпляра Supabase.
//           Этот клиент предназначен для использования в 'use client' компонентах.]
// SCOPE: [Клиентская аутентификация, взаимодействие с Supabase из браузера.]
// KEYWORDS_MODULE: [supabase, client-component, browser, auth]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 1]

import { createBrowserClient } from '@supabase/ssr'

// START_FUNCTION_createClient
// CONTRACT:
// PURPOSE: [Создает и возвращает синглтон-экземпляр клиента Supabase для использования в браузере.]
// OUTPUTS: [SupabaseClient] - Клиент Supabase.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
// END_FUNCTION_createClient
