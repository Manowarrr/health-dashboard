// MODULE_CONTRACT:
// PURPOSE: [Предоставляет кнопку для удаления рецепта с диалогом подтверждения.]
// SCOPE: [UI, Рецепты, Мутации данных]
// KEYWORDS_MODULE: [button, recipe, delete, ui, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.3]

'use client';

import { deleteRecipe } from '../../app/actions';

// START_COMPONENT_DeleteRecipeButton
// CONTRACT:
// PURPOSE: [Рендерит кнопку, которая при нажатии запрашивает подтверждение и вызывает Server Action для удаления рецепта.]
// INPUTS:
//   - recipeId: string - ID рецепта для удаления.
export default function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
    
    // START_ACTION_HANDLER_BLOCK: [Обработчик, который показывает подтверждение и вызывает Server Action.]
    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить этот рецепт?')) {
            await deleteRecipe(recipeId);
        }
    };
    // END_ACTION_HANDLER_BLOCK

    // START_RENDER_BLOCK
    return (
        <button onClick={handleDelete} className="font-medium text-red-500 hover:underline">
            Удалить
        </button>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_DeleteRecipeButton