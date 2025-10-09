// MODULE_CONTRACT:
// PURPOSE: [Перехватывает все входящие запросы к серверу Next.js для управления сессиями пользователей.
//           Обновляет истекшие токены аутентификации и гарантирует, что клиент Supabase,
//           используемый в серверных компонентах, имеет самую актуальную информацию о сессии.]
// SCOPE: [Перехват запросов, управление сессиями, обновление cookie.]
// INPUT: [Объект HTTP Request.]
// OUTPUT: [Объект HTTP Response (потенциально с обновленными cookie).]
// KEYWORDS_MODULE: [middleware, nextjs, supabase, authentication, session_management]
// LINKS_TO_MODULE: [lib/supabase/utils.ts]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 1: Фундамент и Аутентификация]

// MODULE_MAP:
// FUNC [Основная функция middleware для обработки запросов] => middleware
// CONST [Конфигурация matcher для определения, к каким путям применяется middleware] => config

// KEY_USE_CASES:
// - [SessionRefresh]: User (Navigates to protected page) -> Middleware intercepts request and refreshes session cookie -> UserSessionIsValidForServerComponent

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// START_FUNCTION_middleware
// CONTRACT:
// PURPOSE: [Основная логика middleware. Создает серверный клиент Supabase в контексте запроса,
//           пытается обновить сессию и передает управление дальше по цепочке.]
// INPUTS:
//   - request: [NextRequest] - [Входящий HTTP-запрос.]
// OUTPUTS:
//   - [NextResponse] - [Ответ, который будет отправлен клиенту.]
// SIDE_EFFECTS: [Может обновить аутентификационные cookie в ответе.]
// TEST_CONDITIONS_SUCCESS_CRITERIA:
//   - [Middleware должен успешно обрабатывать запросы как для аутентифицированных, так и для анонимных пользователей.]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 1]
// KEYWORDS: [middleware, request, response, session, cookies]
// LINKS: []
export async function middleware(request: NextRequest) {
  // START_RESPONSE_INITIALIZATION: [Создание изменяемого объекта ответа на основе входящего запроса.]
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
  // END_RESPONSE_INITIALIZATION

  // START_SUPABASE_CLIENT_CREATION: [Создание экземпляра Supabase, привязанного к текущему циклу запрос-ответ.]
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  // END_SUPABASE_CLIENT_CREATION

  // START_SESSION_REFRESH: [Получение сессии пользователя для обновления токена, если необходимо.]
  // This will refresh session if expired - important for Server Components
  await supabase.auth.getUser()
  // END_SESSION_REFRESH

  // START_RETURN_RESPONSE: [Возврат ответа для продолжения обработки запроса.]
  return response
  // END_RETURN_RESPONSE
}
// END_FUNCTION_middleware

// START_CONST_config
// CONTRACT:
// PURPOSE: [Конфигурация Next.js, которая указывает, какие пути должны обрабатываться этим middleware.
//           Исключает служебные пути для оптимизации производительности.]
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
// END_CONST_config
