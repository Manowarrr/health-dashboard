// MODULE_CONTRACT:
// PURPOSE: [Служит в качестве основной точки входа в приложение (`/`).
//           Проверяет статус аутентификации пользователя и перенаправляет его
//           либо на дашборд (`/dashboard`), либо на страницу входа (`/login`).]
// SCOPE: [Маршрутизация, аутентификация.]
// KEYWORDS_MODULE: [routing, entrypoint, redirect, server-component]
// LINKS_TO_MODULE: [lib/supabase/server.ts] // UPDATED LINK
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

import { createClient } from "../../lib/supabase/server"; 
import { redirect } from "next/navigation";

// START_COMPONENT_HomePage
// CONTRACT:
// PURPOSE: [Серверный компонент, который не рендерит UI, а выполняет серверную логику
//           перенаправления на основе статуса сессии пользователя.]
export default async function HomePage() {
    // START_SESSION_CHECK_AND_REDIRECT: [Получение сессии и выполнение редиректа.]
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    } else {
        redirect("/login");
    }
    // END_SESSION_CHECK_AND_REDIRECT

    return null;
}
// END_COMPONENT_HomePage

