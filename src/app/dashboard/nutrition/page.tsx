import { createClient } from '../../../../lib/supabase/server';
import { notFound } from 'next/navigation';
import { getMealsForDate, Meal } from '../../actions';
import { DeleteMealButton } from '../../../components/dashboard/DeleteMealButton';

/*
* MODULE_CONTRACT:
* PURPOSE: [Страница для отображения журнала питания пользователя.]
* SCOPE: [UI, Журнал питания, Отображение данных]
* INPUT: [Нет]
* OUTPUT: [Компонент React 'NutritionPage']
* KEYWORDS_MODULE: [nutrition, food_log, page, server_component, ui]
*/

// KEY_USE_CASES:
// - NutritionPage: User (Reviewing Nutrition) -> Navigates to page -> ViewsListOfMealsForSelectedDay

export default async function NutritionPage() {
    
    // #START_DATA_FETCHING: [Получение данных о приемах пищи за сегодняшний день.]
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return notFound();
    }
    
    const today = new Date();
    const meals = await getMealsForDate(today);
    // #END_DATA_FETCHING


    // #START_RENDER_BLOCK: [Рендеринг основной структуры страницы.]
    return (
        <main>
            <h1 className="font-semibold text-2xl text-white mb-6">Журнал питания</h1>
            
            {/* #START_CALENDAR_PLACEHOLDER: [Заглушка для календаря навигации по дням.] */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-center text-gray-400">Здесь будет календарь для навигации по дням.</p>
            </div>
            {/* #END_CALENDAR_PLACEHOLDER */}

            {/* #START_MEAL_LIST_BLOCK: [Отображение списка приемов пищи.] */}
            <div className="space-y-4">
                {meals.length > 0 ? (
                    meals.map((meal) => (
                        <div key={meal.id} className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-semibold text-lg text-white capitalize">{meal.meal_type}</h2>
                                    <p className="text-sm text-gray-400 mb-2">
                                        {meal.logged_at.split('T')[1]?.slice(0, 5) || ''}
                                    </p>
                                </div>
                                <DeleteMealButton id={meal.id} />
                            </div>
                            <ul>
                                {meal.food_log.map((log) => (
                                    <li key={log.id} className="text-gray-300">
                                        - {log.products?.name || log.recipes?.name}
                                        {log.weight_g && ` (${log.weight_g} г)`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-center text-gray-400">За сегодняшний день еще нет записей о приемах пищи.</p>
                    </div>
                )}
            </div>
            {/* #END_MEAL_LIST_BLOCK */}
        </main>
    );
    // #END_RENDER_BLOCK
}