// MODULE_CONTRACT:
// PURPOSE: [Предоставляет UI-компонент формы для записи приема пищи в журнал.]
// SCOPE: [UI, Формы, Журнал питания.]
// KEYWORDS_MODULE: [ui, component, form, food-log, client-component, server-actions]
// LINKS_TO_MODULE: [app/actions.ts]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addFoodLog, FormState, getProducts } from '../../app/actions';
import { useEffect, useState } from 'react';

// START_TYPE_DEFINITION_Product
type Product = {
    id: string;
    name: string;
};
// END_TYPE_DEFINITION_Product


// START_COMPONENT_SubmitButton
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:bg-gray-500"
        >
            {pending ? 'Сохранение...' : 'Добавить в журнал'}
        </button>
    );
}
// END_COMPONENT_SubmitButton


// START_COMPONENT_AddFoodLogForm
// CONTRACT:
// PURPOSE: [Основной компонент формы. Загружает список продуктов пользователя
//           и отправляет данные в Server Action 'addFoodLog'.]
export default function AddFoodLogForm({ onBack }: { onBack: () => void }) {
    // START_STATE_MANAGEMENT: [Управление состоянием формы и списком продуктов.]
    const initialState: FormState = { message: '', errors: {} };
    const [state, dispatch] = useFormState(addFoodLog, initialState);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const [time, setTime] = useState(getCurrentTime());
    // END_STATE_MANAGEMENT

    // START_DATA_FETCHING_EFFECT: [Загрузка списка продуктов при монтировании компонента.]
    useEffect(() => {
        async function fetchProducts() {
            try {
                const userProducts = await getProducts();
                setProducts(userProducts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);
    // END_DATA_FETCHING_EFFECT

    // START_RENDER_BLOCK: [Рендеринг JSX компонента формы.]
    return (
        <form action={dispatch} className="space-y-4">
            <button onClick={onBack} type="button" className="text-blue-400 hover:text-blue-300 mb-2">
                &larr; Назад к выбору
            </button>
            
            {/* START_FORM_FIELD_PRODUCT_SELECT: [Поле для выбора продукта.] */}
            <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-300">Продукт</label>
                {loading ? <p className="text-gray-400">Загрузка продуктов...</p> : (
                    <select id="productId" name="productId" required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        {products.length === 0 ? (
                             <option disabled>Сначала добавьте продукты в базу</option>
                        ) : (
                            products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                        )}
                    </select>
                )}
                 {state.errors?.productId && <p className="text-red-500 text-xs mt-1">{state.errors.productId[0]}</p>}
            </div>
            {/* END_FORM_FIELD_PRODUCT_SELECT */}
            
            {/* START_FORM_FIELD_WEIGHT: [Поле для ввода веса продукта.] */}
            <div>
                 <label htmlFor="weight" className="block text-sm font-medium text-gray-300">Вес (г)</label>
                 <input type="number" id="weight" name="weight" step="1" required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                 {state.errors?.weight && <p className="text-red-500 text-xs mt-1">{state.errors.weight[0]}</p>}
            </div>
            {/* END_FORM_FIELD_WEIGHT */}

            {/* START_FORM_FIELD_MEAL_TYPE: [Поле для выбора типа приема пищи.] */}
            <div>
                <label htmlFor="mealType" className="block text-sm font-medium text-gray-300">Тип приема пищи</label>
                <select id="mealType" name="mealType" required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="breakfast">Завтрак</option>
                    <option value="lunch">Обед</option>
                    <option value="dinner">Ужин</option>
                    <option value="snack">Перекус</option>
                </select>
                {state.errors?.mealType && <p className="text-red-500 text-xs mt-1">{state.errors.mealType[0]}</p>}
            </div>
            {/* END_FORM_FIELD_MEAL_TYPE */}

            {/* START_FORM_FIELD_TIME: [Поле для ввода времени приема пищи.] */}
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-300">Время</label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {state.errors?.time && <p className="text-red-500 text-xs mt-1">{state.errors.time[0]}</p>}
            </div>
            {/* END_FORM_FIELD_TIME */}
            
            <SubmitButton />

            {/* START_FORM_MESSAGE_AREA: [Отображение сообщений от Server Action.] */}
            {state.message && <p className={`text-sm mt-2 ${state.errors ? 'text-red-500' : 'text-green-500'}`}>{state.message}</p>}
            {/* END_FORM_MESSAGE_AREA */}
        </form>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_AddFoodLogForm
