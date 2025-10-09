План Разработки (Development Plan)
1. Анализ Вариантов Решения

Для MVP выбран монолитный подход на Next.js с использованием Supabase в качестве BaaS (Backend-as-a-Service).

    Плюсы:

        Скорость разработки: Supabase предоставляет готовую БД, API, аутентификацию, избавляя от необходимости писать бэкенд с нуля.

        Единый язык: Весь код пишется на TypeScript (фронтенд, серверные функции, бизнес-логика).

        Простота деплоя: Легко разворачивается на Vercel.

        Масштабируемость: Архитектура Next.js и Supabase хорошо масштабируется для будущих нужд.

    Минусы:

        Зависимость от стороннего сервиса (Supabase).

    Вывод: Для MVP это оптимальный вариант, обеспечивающий максимальную скорость и простоту реализации.

2. Семантический Граф Функций (Верхнеуровневый)

<App>
    <AuthenticationLayer>
        <LoginComponent />
        <SupabaseClientAuth />
        <AuthMiddleware />
    </AuthenticationLayer>

    <DataEntryLayer>
        <AddDataModal>
            <AddDataFormComponent>
                <AddProductForm />
                <AddFoodLogForm />
                <!-- Other forms... -->
            </AddDataFormComponent>
        </AddDataModal>
    </DataEntryLayer>

    <PresentationLayer>
        <DashboardPage>
            <NutritionSummaryWidget />
            <!-- Other widgets... -->
        </DashboardPage>
        <HistoryPage>
            <AnalyticsChart />
        </HistoryPage>
    </PresentationLayer>

    <BusinessLogicLayer (ServerActions)>
        <addProduct />
        <addFoodLog />
        <getDailyNutritionSummary />
        <getProducts />
        <!-- Other actions... -->
    </BusinessLogicLayer>

    <DatabaseLayer (Supabase)>
        <Tables (Products, FoodLog, Users, etc.) />
        <RLSPolicies />
        <Triggers />
    </DatabaseLayer>
</App>

3. Пошаговый Алгоритм Разработки

    Этап 0: Настройка и Схема

        [DONE] Инициализация проекта Next.js.

        [DONE] Настройка проекта Supabase.

        [DONE] Генерация и применение SQL-скрипта для создания схемы БД.

    Этап 1: Фундамент и Аутентификация

        [DONE] Интеграция Supabase SDK в Next.js (создание клиентов для сервера и клиента).

        [DONE] Настройка Middleware для защиты роутов.

        [DONE] Создание страницы входа (/login).

        [DONE] Настройка триггера в БД для автоматического создания профиля пользователя.

        [DONE] Создание базового Layout для защищенной зоны (/dashboard).

    Этап 2: Реализация Ввода Данных (Вертикальный срез "Питание")

        [DONE] Создание модального окна для добавления записей.

        [DONE] Создание Server Action и UI-формы для добавления Продукта в справочник.

        [DONE] Создание Server Actions (getProducts, addFoodLog) и UI-формы для логирования Приема пищи.

        [WIP] Далее: Реализация форм для тренировок, сна и т.д.

    Этап 3: Визуализация Данных

        [DONE] Создание Server Action (getDailyNutritionSummary) для получения сводки по питанию за день.

        [DONE] Создание виджета NutritionSummaryWidget для отображения этой сводки на дашборде.

        [TODO] Создание других виджетов (активность, сон).

        [TODO] Создание страницы "История" с графиками на базе Recharts.

    Этап 4: Реализация остального функционала

        [TODO] Полная реализация ввода данных для тренировок, сна, измерений и т.д.

        [TODO] Реализация функционала постановки и отслеживания целей.