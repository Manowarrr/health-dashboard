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
        <div className="bg-gray-800 rounded-2xl shadow-lg divide-y divide-gray-700">
            {/* START_HEADER_BLOCK: [Объединенный заголовок с названием, временем и КБЖУ.] */}
            <div className="p-4 flex justify-between items-start">
                {/* Левая часть: Название и время */}
                <div className="flex-grow">
                    <h2 className="font-bold text-xl text-white capitalize">{meal.meal_type}</h2>
                    <p className="text-sm text-gray-400">
                        {meal.logged_at.substring(11, 16)}  {/* Исправлено отображение времени */}
                    </p>
                </div>

                {/* Правая часть: КБЖУ */}
                <div className="ml-6 flex-shrink-0 grid grid-cols-4 gap-x-4 text-center">
                    <div>
                        <p className="text-xs text-gray-400">Калории</p>
                        <p className="text-lg font-bold text-white">{Math.round(meal.total_calories)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Белки</p>
                        <p className="text-lg font-bold text-white">{Math.round(meal.total_protein)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Жиры</p>
                        <p className="text-lg font-bold text-white">{Math.round(meal.total_fat)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Углеводы</p>
                        <p className="text-lg font-bold text-white">{Math.round(meal.total_carbs)}</p>
                    </div>
                </div>
            </div>
            {/* END_HEADER_BLOCK */}

            {/* START_COMPOSITION_BLOCK: [Секция со списком продуктов, рецептов и кнопкой удаления.] */}
            {meal.food_log.length > 0 && (
                <div className="p-4 space-y-3">
                    <ul className="space-y-2">
                        {meal.food_log.map((log) => (
                            <li key={log.id} className="text-gray-300 text-sm flex justify-between items-center bg-gray-900/50 p-2 rounded-md">
                                <span>{log.products?.name || log.recipes?.name}</span>
                                {log.weight_g && <span className="font-mono text-gray-400">{log.weight_g} г</span>}
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end pt-2">
                         <DeleteMealButton id={meal.id} />
                    </div>
                </div>
            )}
            {/* END_COMPOSITION_BLOCK */}
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_MealCard