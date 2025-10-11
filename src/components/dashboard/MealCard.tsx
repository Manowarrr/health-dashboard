'use client';

import type { Meal } from '../../app/actions';
import { DeleteMealButton } from './DeleteMealButton';

/*
* MODULE_CONTRACT:
* PURPOSE: [Отображает карточку одного приема пищи с полной информацией о КБЖУ и составе.]
* SCOPE: [UI, Журнал питания, Отображение данных, Компонент]
* INPUT: [Объект 'meal' типа 'Meal']
* OUTPUT: [Компонент React 'MealCard']
* KEYWORDS_MODULE: [meal, card, nutrition, ui, client_component]
*/

// KEY_USE_CASES:
// - MealCard: NutritionPage (Rendering) -> Renders MealCard for each meal -> DisplaysMealSummaryAndComposition

// START_COMPONENT_MealCard
// CONTRACT:
// PURPOSE: [Рендерит детальную карточку для одного приема пищи.]
// INPUTS:
//   - meal: Meal - Полный объект приема пищи с рассчитанным КБЖУ.
// OUTPUTS:
//   - JSX.Element - React-компонент, представляющий карточку.
// KEYWORDS: [data_display, nutrition_summary, meal_composition]

export function MealCard({ meal }: { meal: Meal }) {
    // START_RENDER_BLOCK: [Рендеринг основной структуры карточки.]
    return (
        <div className="bg-gray-800 rounded-2xl shadow-lg transition-all hover:shadow-cyan-500/10">
            {/* START_HEADER_BLOCK: [Заголовок карточки с названием, временем и кнопкой удаления.] */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-start">
                <div>
                    <h2 className="font-bold text-xl text-white capitalize">{meal.meal_type}</h2>
                    <p className="text-sm text-gray-400">
                        {new Date(meal.logged_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <DeleteMealButton id={meal.id} />
            </div>
            {/* END_HEADER_BLOCK */}

            {/* START_SUMMARY_BLOCK: [Секция с итоговым КБЖУ для приема пищи.] */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                    <p className="text-xs text-gray-400">Калории</p>
                    <p className="text-lg font-bold text-white">{Math.round(meal.total_calories)}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-400">Белки</p>
                    <p className="text-lg font-bold text-white">{Math.round(meal.total_protein)} г</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-400">Жиры</p>
                    <p className="text-lg font-bold text-white">{Math.round(meal.total_fat)} г</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-400">Углеводы</p>
                    <p className="text-lg font-bold text-white">{Math.round(meal.total_carbs)} г</p>
                </div>
            </div>
            {/* END_SUMMARY_BLOCK */}
            
            {/* START_COMPOSITION_BLOCK: [Секция со списком продуктов и рецептов.] */}
            {meal.food_log.length > 0 && (
                 <div className="p-4 border-t border-gray-700">
                    <h3 className="font-semibold text-sm text-gray-300 mb-2">Состав:</h3>
                    <ul className="space-y-1">
                        {meal.food_log.map((log) => (
                            <li key={log.id} className="text-gray-400 text-sm flex justify-between">
                                <span>- {log.products?.name || log.recipes?.name}</span>
                                {log.weight_g && <span className="text-gray-500">{log.weight_g} г</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* END_COMPOSITION_BLOCK */}
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_MealCard