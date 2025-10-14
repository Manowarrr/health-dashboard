import { createClient } from '../../../../lib/supabase/server';
import { notFound } from 'next/navigation';
import { getMealsForDate, Meal } from '../../actions';
import { MealCard } from '../../../components/dashboard/MealCard';
import AddMealButton from '../../../components/dashboard/AddMealButton';

/*
* MODULE_CONTRACT:
* PURPOSE: [Страница для отображения журнала питания пользователя с использованием компонента MealCard.]
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
            <div className="max-w-4xl mx-auto px-4">
                {/* #START_PAGE_HEADER_BLOCK: [Заголовок страницы и кнопка для добавления приема пищи.] */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="font-semibold text-2xl text-white">Журнал питания</h1>
                    <AddMealButton />
                </div>
                {/* #END_PAGE_HEADER_BLOCK */}

                {/* #START_CALENDAR_PLACEHOLDER: [Заглушка для календаря навигации по дням.] */}
                <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <p className="text-center text-gray-400">Здесь будет календарь для навигации по дням.</p>
                </div>
                {/* #END_CALENDAR_PLACEHOLDER */}

                {/* #START_MEAL_LIST_BLOCK: [Отображение списка приемов пищи с использованием компонента MealCard.] */}
                <div className="space-y-6">
                    {meals.length > 0 ? (
                        meals.map((meal) => (
                            <MealCard key={meal.id} meal={meal} />
                        ))
                    ) : (
                        <div className="p-8 bg-gray-800 rounded-lg text-center">
                            <p className="text-gray-400">За сегодняшний день еще нет записей о приемах пищи.</p>
                        </div>
                    )}
                </div>
                {/* #END_MEAL_LIST_BLOCK */}
            </div>
        </main>
    );
    // #END_RENDER_BLOCK
}