// MODULE_CONTRACT:
// PURPOSE: [Отображает таблицу с рецептами пользователя, полученными с сервера.]
// SCOPE: [Отображение данных, рецепты]
// KEYWORDS_MODULE: [recipes, table, ui, dashboard, server-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.3]

import { getRecipes, Recipe } from "../../app/actions";
// import DeleteRecipeButton from "./DeleteRecipeButton";
// import EditRecipeButton from "./EditRecipeButton";

// START_COMPONENT_RecipesTable
// CONTRACT:
// PURPOSE: [Асинхронный серверный компонент для получения и отображения списка рецептов.]
// INPUTS:
//   - query: string - Поисковый запрос для фильтрации рецептов.
export default async function RecipesTable({ query }: { query: string }) {
    // START_DATA_FETCH_BLOCK: [Получение списка рецептов с помощью Server Action.]
    const recipes = await getRecipes(query);
    // END_DATA_FETCH_BLOCK

    // START_EMPTY_STATE_BLOCK: [Отображение сообщения, если список рецептов пуст.]
    if (recipes.length === 0) {
        return <p>Рецепты не найдены. Попробуйте другой поисковый запрос или добавьте новый рецепт.</p>;
    }
    // END_EMPTY_STATE_BLOCK

    // START_RENDER_BLOCK: [Рендеринг таблицы с рецептами.]
    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        <th scope="col" className="py-3 px-6">Название</th>
                        <th scope="col" className="py-3 px-6">Дата создания</th>
                        <th scope="col" className="py-3 px-6">
                            <span className="sr-only">Действия</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {recipes.map((recipe: Recipe) => (
                        <tr key={recipe.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                            <th scope="row" className="py-4 px-6 font-medium whitespace-nowrap text-white">
                                {recipe.name}
                            </th>
                            <td className="py-4 px-6">{new Date(recipe.created_at).toLocaleDateString()}</td>
                            <td className="py-4 px-6 text-right space-x-4">
                                {/* <EditRecipeButton recipe={recipe} /> */}
                                {/* <DeleteRecipeButton recipeId={recipe.id} /> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_RecipesTable