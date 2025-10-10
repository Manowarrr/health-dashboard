// MODULE_CONTRACT:
// PURPOSE: [Предоставляет форму для редактирования существующего продукта.]
// SCOPE: [UI, Формы, Продукты, Мутации данных]
// KEYWORDS_MODULE: [form, product, edit, ui, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.2]

'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateProduct, Product, FormState } from '../../app/actions';
import { useEffect } from 'react';

// START_COMPONENT_SubmitButton
// CONTRACT:
// PURPOSE: [Кнопка отправки формы, которая показывает состояние pending.]
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:bg-gray-500">
            {pending ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
    );
}
// END_COMPONENT_SubmitButton

// START_COMPONENT_EditProductForm
// CONTRACT:
// PURPOSE: [Рендерит форму для редактирования продукта и обрабатывает ее отправку.]
// INPUTS:
//   - product: Product - Объект продукта для редактирования.
//   - onFormSuccess: () => void - Callback, вызываемый при успешном обновлении.
export default function EditProductForm({ product, onFormSuccess }: { product: Product, onFormSuccess: () => void }) {
    const initialState: FormState = { message: '', errors: {} };
    const updateProductWithId = updateProduct.bind(null, product.id);
    const [state, dispatch] = useFormState(updateProductWithId, initialState);

    // START_EFFECT_SUCCESS_HANDLER: [Эффект для отслеживания успешной отправки и закрытия модального окна.]
    useEffect(() => {
        if (state.message.includes('успешно обновлен')) {
            onFormSuccess();
        }
    }, [state, onFormSuccess]);
    // END_EFFECT_SUCCESS_HANDLER

    // START_RENDER_BLOCK
    return (
        <form action={dispatch} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Название продукта</label>
                <input type="text" id="name" name="name" defaultValue={product.name} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                {state.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name.join(', ')}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="calories" className="block text-sm font-medium text-gray-300">Калории (на 100г)</label>
                    <input type="number" id="calories" name="calories" defaultValue={product.calories_per_100g} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                    {state.errors?.calories && <p className="text-sm text-red-500 mt-1">{state.errors.calories.join(', ')}</p>}
                </div>
                <div>
                    <label htmlFor="protein" className="block text-sm font-medium text-gray-300">Белки (на 100г)</label>
                    <input type="number" id="protein" name="protein" defaultValue={product.protein_per_100g} step="0.1" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                    {state.errors?.protein && <p className="text-sm text-red-500 mt-1">{state.errors.protein.join(', ')}</p>}
                </div>
                <div>
                    <label htmlFor="fat" className="block text-sm font-medium text-gray-300">Жиры (на 100г)</label>
                    <input type="number" id="fat" name="fat" defaultValue={product.fat_per_100g} step="0.1" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                    {state.errors?.fat && <p className="text-sm text-red-500 mt-1">{state.errors.fat.join(', ')}</p>}
                </div>
                <div>
                    <label htmlFor="carbs" className="block text-sm font-medium text-gray-300">Углеводы (на 100г)</label>
                    <input type="number" id="carbs" name="carbs" defaultValue={product.carbs_per_100g} step="0.1" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                    {state.errors?.carbs && <p className="text-sm text-red-500 mt-1">{state.errors.carbs.join(', ')}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="fiber" className="block text-sm font-medium text-gray-300">Клетчатка (г)</label>
                    <input type="number" id="fiber" name="fiber" defaultValue={product.fiber_per_100g || ''} step="0.1" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="sugar" className="block text-sm font-medium text-gray-300">Сахар (г)</label>
                    <input type="number" id="sugar" name="sugar" defaultValue={product.sugar_per_100g || ''} step="0.1" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="alcohol" className="block text-sm font-medium text-gray-300">Алкоголь (г)</label>
                    <input type="number" id="alcohol" name="alcohol" defaultValue={product.alcohol_per_100g || ''} step="0.1" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="caffeine" className="block text-sm font-medium text-gray-300">Кофеин (мг)</label>
                    <input type="number" id="caffeine" name="caffeine" defaultValue={product.caffeine_per_100g_mg || ''} step="0.1" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
            </div>

            <SubmitButton />

            {state.message && !state.message.includes('успешно') && <p className="text-sm text-red-500 text-center mt-2">{state.message}</p>}
        </form>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_EditProductForm