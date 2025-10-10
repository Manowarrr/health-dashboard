// MODULE_CONTRACT:
// PURPOSE: [Предоставляет UI-форму для добавления нового рецепта.]
// SCOPE: [UI, Формы, Рецепты]
// KEYWORDS_MODULE: [form, recipe, ui, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.3]

'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addRecipe, FormState } from '../../app/actions';
import { useEffect } from 'react';

// START_COMPONENT_SubmitButton
// CONTRACT:
// PURPOSE: [Отображает кнопку отправки формы с состоянием загрузки.]
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-400">
            {pending ? 'Добавление...' : 'Добавить рецепт'}
        </button>
    );
}
// END_COMPONENT_SubmitButton


// START_COMPONENT_AddRecipeForm
// CONTRACT:
// PURPOSE: [Рендерит форму для создания нового рецепта и обрабатывает ее состояние.]
// INPUTS:
//   - onFormSuccess: () => void - Callback-функция, вызываемая при успешном добавлении рецепта.
export default function AddRecipeForm({ onFormSuccess }: { onFormSuccess: () => void; }) {
    const initialState: FormState = { message: '', errors: {} };
    const [state, dispatch] = useFormState(addRecipe, initialState);

    // START_EFFECT_SUCCESS_HANDLER: [При успешном ответе от сервера вызываем callback.]
    useEffect(() => {
        if (state.message.includes('успешно добавлен')) {
            onFormSuccess();
        }
    }, [state, onFormSuccess]);
    // END_EFFECT_SUCCESS_HANDLER

    // START_RENDER_BLOCK
    return (
        <form action={dispatch} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Название рецепта</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
                {state.errors?.name && <p className="mt-1 text-sm text-red-500">{state.errors.name.join(', ')}</p>}
            </div>
            
            <SubmitButton />

            {state.message && !state.message.includes('успешно') && (
                <p className="mt-2 text-sm text-red-500">{state.message}</p>
            )}
        </form>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_AddRecipeForm