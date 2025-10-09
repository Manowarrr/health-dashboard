// MODULE_CONTRACT:
// PURPOSE: [Предоставляет серверный обработчик (API Route) для выхода пользователя из системы.
//           Удаляет сессию пользователя и перенаправляет его на главную страницу.]
// SCOPE: [Аутентификация, управление сессиями.]
// KEYWORDS_MODULE: [api-route, auth, signout, server-action, supabase]
// LINKS_TO_MODULE: [lib/supabase/server.ts] 
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 1]

import { createClient } from '../../../../lib/supabase/server' 
import { type NextRequest, NextResponse } from 'next/server'

// START_FUNCTION_POST
// CONTRACT:
// PURPOSE: [Обрабатывает POST-запрос на выход из системы.]
// INPUTS:
//   - request: [NextRequest] - Объект входящего запроса.
// OUTPUTS:
//   - [NextResponse] - Ответ с перенаправлением на главную страницу.
// SIDE_EFFECTS: [Удаляет cookie сессии пользователя.]
export async function POST(request: NextRequest) {
    // START_SUPABASE_CLIENT_INIT: [Инициализация серверного клиента Supabase.]
    const supabase = createClient()
    // END_SUPABASE_CLIENT_INIT

    // START_SIGN_OUT_ACTION: [Вызов метода signOut для завершения сессии.]
    await supabase.auth.signOut()
    // END_SIGN_OUT_ACTION

    // START_REDIRECT_RESPONSE: [Формирование и возврат ответа с редиректом.]
    return NextResponse.redirect(new URL('/', request.url), {
        status: 302,
    })
    // END_REDIRECT_RESPONSE
}
// END_FUNCTION_POST

