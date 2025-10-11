// MODULE_CONTRACT:
// PURPOSE: [Предоставляет UI-форму для добавления нового рецепта, включая его состав.]
// SCOPE: [UI, Формы, Рецепты, Управление состоянием]
// KEYWORDS_MODULE: [form, recipe, constructor, ui, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.3]

'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addRecipe, FormState, getProducts, Product } from '../../app/actions';
import { useEffect, useState } from 'react';

// START_COMPONENT_SubmitButton
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-400">
            {pending ? 'Сохранение...' : 'Сохранить рецепт'}
        </button>
    );
}
// END_COMPONENT_SubmitButton

type Ingredient = {
    id: string; // a temporary unique id for the row
    productId: string;
    weight: number;
};

// START_COMPONENT_AddRecipeForm
// CONTRACT:
// PURPOSE: [Рендерит форму-конструктор для создания нового рецепта и его состава.]
// INPUTS:
//   - onFormSuccess: () => void - Callback-функция, вызываемая при успешном добавлении рецепта.
export default function AddRecipeForm({ onFormSuccess }: { onFormSuccess: () => void; }) {
    const initialState: FormState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(addRecipe, initialState);
    
    const [products, setProducts] = useState<Product[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    // START_EFFECT_PRODUCT_FETCH: [Загрузка списка продуктов при монтировании компонента.]
    useEffect(() => {
        getProducts().then(setProducts);
    }, []);
    // END_EFFECT_PRODUCT_FETCH

    // START_EFFECT_SUCCESS_HANDLER: [При успешном ответе от сервера вызываем callback.]
    useEffect(() => {
        if (state.status === 'success') {
            onFormSuccess();
        }
    }, [state, onFormSuccess]);
    // END_EFFECT_SUCCESS_HANDLER

    // START_INGREDIENT_HANDLERS_BLOCK: [Функции для управления списком ингредиентов.]
    const addIngredient = () => {
        setIngredients([...ingredients, { id: Date.now().toString(), productId: '', weight: 0 }]);
    };

    const removeIngredient = (id: string) => {
        setIngredients(ingredients.filter(ing => ing.id !== id));
    };

    const handleIngredientChange = (id: string, field: 'productId' | 'weight', value: string | number) => {
        setIngredients(ingredients.map(ing => 
            ing.id === id ? { ...ing, [field]: value } : ing
        ));
    };
    // END_INGREDIENT_HANDLERS_BLOCK

    // START_RENDER_BLOCK
    return (
        <form action={dispatch} className="space-y-6">
            {/* --- Recipe Name --- */}
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

            {/* --- Ingredients List --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Ингредиенты</h3>
                {ingredients.map((ingredient, index) => (
                    <div key={ingredient.id} className="grid grid-cols-12 gap-2 items-center">
                        <input type="hidden" name={`ingredients[${index}][id]`} value={ingredient.id} />
                        <select
                            name={`ingredients[${index}][productId]`}
                            value={ingredient.productId}
                            onChange={(e) => handleIngredientChange(ingredient.id, 'productId', e.target.value)}
                            className="col-span-6 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="" disabled>Выберите продукт</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input
                            type="number"
                            name={`ingredients[${index}][weight]`}
                            value={ingredient.weight}
                            onChange={(e) => handleIngredientChange(ingredient.id, 'weight', Number(e.target.value))}
                            placeholder="Вес (г)"
                            className="col-span-4 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button type="button" onClick={() => removeIngredient(ingredient.id)} className="col-span-2 text-red-500 hover:text-red-700">
                            Удалить
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient} className="text-indigo-400 hover:text-indigo-300">
                    + Добавить ингредиент
                </button>
            </div>
            
            <SubmitButton />

            {state.status === 'error' && state.message && (
                <p className="mt-2 text-sm text-red-500">{state.message}</p>
            )}
        </form>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_AddRecipeForm