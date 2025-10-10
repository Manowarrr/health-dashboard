// MODULE_CONTRACT:
// PURPOSE: [Создает основной каркас (layout) для всех защищенных страниц дашборда.
//           Включает в себя боковую панель навигации (Sidebar) и область для основного контента.
//           Также проверяет, аутентифицирован ли пользователь, и если нет - перенаправляет на /login.]
// SCOPE: [Навигация, структура интерфейса, защита роутов.]
// KEYWORDS_MODULE: [layout, navigation, sidebar, protected-route, ui, nextjs]
// LINKS_TO_MODULE: [lib/supabase/server.ts] 
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

// START_COMPONENT_DashboardLayout
// CONTRACT:
// PURPOSE: [Асинхронный серверный компонент, который получает сессию пользователя и рендерит дочерние страницы
//           внутри основного макета с боковой панелью.]
export default async function DashboardLayout({ children }: PropsWithChildren) {
    // START_AUTHENTICATION_CHECK: [Проверка сессии пользователя на сервере.]
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }
    // END_AUTHENTICATION_CHECK

    // START_RENDER_BLOCK: [Рендеринг JSX компонента.]
    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* START_SIDEBAR_COMPONENT: [Боковая панель навигации.] */}
            <aside className="w-64 flex-shrink-0 bg-gray-800 p-6">
                <div className="text-2xl font-bold mb-8">HealthApp</div>
                <nav>
                    <ul>
                        {/* START_NAV_ITEM_DASHBOARD */}
                        <li className="mb-4">
                            <a href="/dashboard" className="flex items-center p-2 text-base font-normal text-white rounded-lg bg-gray-700">
                                <span className="ml-3">Дашборд</span>
                            </a>
                        </li>
                        {/* END_NAV_ITEM_DASHBOARD */}

                        {/* START_NAV_ITEM_NUTRITION */}
                        <li className="mb-4">
                            <a href="/dashboard/nutrition" className="flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700">
                                <span className="ml-3">Питание</span>
                            </a>
                        </li>
                        {/* END_NAV_ITEM_NUTRITION */}

                        {/* START_NAV_DROPDOWN_REFERENCES */}
                        <li className="mb-4">
                            {/* In a real component, this would be a dropdown/accordion */}
                            <span className="flex items-center p-2 text-base font-normal text-gray-500 rounded-lg">
                                <span className="ml-3 font-semibold">Справочники</span>
                            </span>
                            <ul className="pl-4 mt-2 space-y-2">
                                <li>
                                    <a href="/dashboard/products" className="flex items-center p-2 text-sm font-normal text-gray-400 rounded-lg hover:bg-gray-700">
                                        <span className="ml-3">Продукты</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/dashboard/recipes" className="flex items-center p-2 text-sm font-normal text-gray-400 rounded-lg hover:bg-gray-700">
                                        <span className="ml-3">Рецепты</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        {/* END_NAV_DROPDOWN_REFERENCES */}
                        
                        <li className="mb-4">
                            <a href="#" className="flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700">
                                <span className="ml-3">Цели</span>
                            </a>
                        </li>
                        <li className="mb-4">
                            <a href="#" className="flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700">
                                <span className="ml-3">История</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                 <div className="absolute bottom-6">
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 w-full">
                           <span className="ml-3">Выйти</span>
                        </button>
                    </form>
                </div>
            </aside>
            {/* END_SIDEBAR_COMPONENT */}

            {/* START_MAIN_CONTENT_AREA: [Основная область для дочерних страниц.] */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
            {/* END_MAIN_CONTENT_AREA */}
        </div>
    );
}
// END_COMPONENT_DashboardLayout

