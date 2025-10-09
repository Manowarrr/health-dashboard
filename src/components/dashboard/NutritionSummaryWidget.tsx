// MODULE_CONTRACT:
// PURPOSE: [Отображает виджет с итоговой информацией по питанию за день (КБЖУ).]
// SCOPE: [UI, Дашборд, Визуализация данных.]
// KEYWORDS_MODULE: [ui, component, widget, dashboard, nutrition, client-component]
// LINKS_TO_MODULE: [recharts]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { NutritionSummary } from '../../app/actions';

// START_TYPE_DEFINITION_WidgetProps
// CONTRACT:
// PURPOSE: [Определяет props для компонента виджета.]
type WidgetProps = {
    summary: NutritionSummary;
};
// END_TYPE_DEFINITION_WidgetProps

const COLORS = ['#0088FE', '#FF8042', '#00C49F']; // Белки, Жиры, Углеводы

// START_COMPONENT_NutritionSummaryWidget
// CONTRACT:
// PURPOSE: [Основной компонент виджета. Принимает данные о питании и отображает их
//           в виде карточек и круговой диаграммы.]
export default function NutritionSummaryWidget({ summary }: WidgetProps) {
    // START_DATA_PREPARATION_BLOCK: [Подготовка данных для диаграммы.]
    const pieData = [
        { name: 'Белки', value: summary.total_protein * 4 },
        { name: 'Жиры', value: summary.total_fat * 9 },
        { name: 'Углеводы', value: summary.total_carbs * 4 },
    ].filter(item => item.value > 0); // Не отображаем секторы с нулевым значением
    // END_DATA_PREPARATION_BLOCK

    // START_RENDER_BLOCK: [Рендеринг JSX компонента.]
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Сводка по питанию за сегодня</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* START_METRICS_DISPLAY_BLOCK: [Отображение числовых показателей.] */}
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Калории</p>
                    <p className="text-2xl font-bold text-white">{Math.round(summary.total_calories)}</p>
                    <p className="text-xs text-gray-500">ккал</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Белки</p>
                    <p className="text-2xl font-bold text-white">{Math.round(summary.total_protein)}</p>
                    <p className="text-xs text-gray-500">г</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Жиры</p>
                    <p className="text-2xl font-bold text-white">{Math.round(summary.total_fat)}</p>
                    <p className="text-xs text-gray-500">г</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Углеводы</p>
                    <p className="text-2xl font-bold text-white">{Math.round(summary.total_carbs)}</p>
                    <p className="text-xs text-gray-500">г</p>
                </div>
                {/* END_METRICS_DISPLAY_BLOCK */}
            </div>
            {/* START_PIE_CHART_BLOCK: [Отображение круговой диаграммы распределения макронутриентов.] */}
            {pieData.length > 0 && (
                <div className="mt-6" style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
            {/* END_PIE_CHART_BLOCK */}
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_NutritionSummaryWidget
