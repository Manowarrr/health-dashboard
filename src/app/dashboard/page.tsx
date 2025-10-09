// MODULE_CONTRACT:
// PURPOSE: [Главная страница дашборда. Отображает сводку данных и предоставляет
//           интерфейс для добавления новых записей.]
// SCOPE: [UI, Дашборд, Ввод данных.]
// KEYWORDS_MODULE: [ui, page, dashboard, client-component, data-display]
// LINKS_TO_MODULE: [components/ui/Modal.tsx, components/AddDataForm.tsx, components/dashboard/NutritionSummaryWidget.tsx, app/actions.ts]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

import { getDailyNutritionSummary } from '../actions';
import AddDataMain from './_components/AddDataMain';
import NutritionSummaryWidget from '../../components/dashboard/NutritionSummaryWidget';

// START_COMPONENT_DashboardPage
// CONTRACT:
// PURPOSE: [Основной компонент страницы. Является серверным компонентом, который
//           асинхронно загружает данные и рендерит дочерние клиентские компоненты.]
export default async function DashboardPage() {
    
    // START_DATA_FETCHING_BLOCK: [Загрузка данных о питании при рендеринге страницы на сервере.]
    const nutritionSummary = await getDailyNutritionSummary();
    // END_DATA_FETCHING_BLOCK

    // START_RENDER_BLOCK: [Рендеринг JSX страницы.]
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold text-white mb-6">Главная Панель</h1>
            
            <div className="space-y-6">
                {/* START_WIDGET_RENDERING_BLOCK: [Отображение виджета сводки по питанию.] */}
                <NutritionSummaryWidget summary={nutritionSummary} />
                {/* END_WIDGET_RENDERING_BLOCK */}

                {/* START_ADD_DATA_COMPONENT_BLOCK: [Отображение основного клиентского компонента для добавления данных.] */}
                <AddDataMain />
                {/* END_ADD_DATA_COMPONENT_BLOCK */}
            </div>
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_DashboardPage

