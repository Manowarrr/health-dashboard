// MODULE_CONTRACT:
// PURPOSE: [Отображает главную страницу дашборда. Это первая страница, которую видит
//           пользователь после успешной аутентификации. На данный момент является заглушкой.]
// SCOPE: [Отображение сводной информации.]
// KEYWORDS_MODULE: [dashboard, page, ui, server-component]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

// START_COMPONENT_DashboardPage
// CONTRACT:
// PURPOSE: [Простой серверный компонент, отображающий заголовок и приветственное сообщение.]
export default function DashboardPage() {
    // START_RENDER_BLOCK: [Рендеринг JSX компонента.]
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Главная Панель</h1>
            <div className="p-6 bg-gray-800 rounded-lg">
                <p>Добро пожаловать в ваш персональный дашборд здоровья!</p>
                <p>Здесь будут отображаться виджеты с вашими данными.</p>
            </div>
        </div>
    );
}
// END_COMPONENT_DashboardPage
