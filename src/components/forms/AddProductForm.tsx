// MODULE_CONTRACT:
// PURPOSE: [Предоставляет UI-компонент формы для добавления нового продукта
//           в личный справочник пользователя.]
// SCOPE: [UI, Формы, Ввод данных, Продукты.]
// KEYWORDS_MODULE: [ui, component, form, product, client-component]
// LINKS_TO_MODULE: [app/actions.ts]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2, Business Requirement: Прямой ввод калорий]

'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addProduct, type FormState } from '../../app/actions';

// START_COMPONENT_SubmitButton
// CONTRACT:
// PURPOSE: [Отображает кнопку отправки формы, которая показывает состояние ожидания.]
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
            {pending ? 'Добавление...' : 'Добавить продукт'}
        </button>
    );
}
// END_COMPONENT_SubmitButton


// START_COMPONENT_AddProductForm
// CONTRACT:
// PURPOSE: [Основной компонент формы. Управляет состоянием формы и отправляет данные
//           на сервер с помощью Server Action.]
// INPUTS:
//   - onBack: () => void - Функция для возврата к предыдущему экрану.
export default function AddProductForm({ onBack }: { onBack: () => void }) {
    // START_STATE_MANAGEMENT: [Инициализация состояния формы с помощью useFormState.]
    const initialState: FormState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(addProduct, initialState);
    // END_STATE_MANAGEMENT

    // START_RENDER_BLOCK: [Рендеринг JSX компонента.]
    return (
        <div className="space-y-4">
            {/* START_HEADER_BLOCK: [Заголовок и кнопка "назад".] */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="text-blue-400 hover:text-blue-300">
                    &larr; Назад к выбору
                </button>
                <h4 className="text-lg font-medium text-gray-300">Новый продукт</h4>
            </div>
            {/* END_HEADER_BLOCK */}

            {/* START_FORM_BLOCK: [HTML-форма для ввода данных о продукте.] */}
            <form action={dispatch} className="space-y-4">
                {/* START_FIELD_name: [Поле для ввода названия продукта.] */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400">Название продукта</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {state.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
                </div>
                {/* END_FIELD_name */}

                {/* START_MACRO_GRID: [Сетка для ввода КБЖУ.] */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* START_FIELD_calories: [Поле для ввода калорий.] */}
                    <div>
                        <label htmlFor="calories" className="block text-sm font-medium text-gray-400">Калории (ккал)</label>
                        <input
                            id="calories"
                            name="calories"
                            type="number"
                            step="0.1"
                            required
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {state.errors?.calories && <p className="text-red-500 text-xs mt-1">{state.errors.calories[0]}</p>}
                    </div>
                    {/* END_FIELD_calories */}

                    {/* START_FIELD_protein: [Поле для ввода белков.] */}
                    <div>
                        <label htmlFor="protein" className="block text-sm font-medium text-gray-400">Белки (г)</label>
                        <input
                            id="protein"
                            name="protein"
                            type="number"
                            step="0.1"
                            required
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                         {state.errors?.protein && <p className="text-red-500 text-xs mt-1">{state.errors.protein[0]}</p>}
                    </div>
                    {/* END_FIELD_protein */}

                    {/* START_FIELD_fat: [Поле для ввода жиров.] */}
                    <div>
                        <label htmlFor="fat" className="block text-sm font-medium text-gray-400">Жиры (г)</label>
                        <input
                            id="fat"
                            name="fat"
                            type="number"
                            step="0.1"
                            required
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                         {state.errors?.fat && <p className="text-red-500 text-xs mt-1">{state.errors.fat[0]}</p>}
                    </div>
                    {/* END_FIELD_fat */}

                    {/* START_FIELD_carbs: [Поле для ввода углеводов.] */}
                    <div>
                        <label htmlFor="carbs" className="block text-sm font-medium text-gray-400">Углеводы (г)</label>
                        <input
                            id="carbs"
                            name="carbs"
                            type="number"
                            step="0.1"
                            required
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                         {state.errors?.carbs && <p className="text-red-500 text-xs mt-1">{state.errors.carbs[0]}</p>}
                    </div>
                    {/* END_FIELD_carbs */}
                </div>
                {/* END_MACRO_GRID */}

                {/* START_OPTIONAL_MACRO_GRID: [Сетка для ввода опциональных макронутриентов.] */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* START_FIELD_fiber: [Поле для ввода клетчатки.] */}
                    <div>
                        <label htmlFor="fiber" className="block text-sm font-medium text-gray-400">Клетчатка (г)</label>
                        <input
                            id="fiber"
                            name="fiber"
                            type="number"
                            step="0.1"
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* END_FIELD_fiber */}

                    {/* START_FIELD_sugar: [Поле для ввода сахара.] */}
                    <div>
                        <label htmlFor="sugar" className="block text-sm font-medium text-gray-400">Сахар (г)</label>
                        <input
                            id="sugar"
                            name="sugar"
                            type="number"
                            step="0.1"
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* END_FIELD_sugar */}

                    {/* START_FIELD_alcohol: [Поле для ввода алкоголя.] */}
                    <div>
                        <label htmlFor="alcohol" className="block text-sm font-medium text-gray-400">Алкоголь (г)</label>
                        <input
                            id="alcohol"
                            name="alcohol"
                            type="number"
                            step="0.1"
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* END_FIELD_alcohol */}

                    {/* START_FIELD_caffeine: [Поле для ввода кофеина.] */}
                    <div>
                        <label htmlFor="caffeine" className="block text-sm font-medium text-gray-400">Кофеин (мг)</label>
                        <input
                            id="caffeine"
                            name="caffeine"
                            type="number"
                            step="0.1"
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* END_FIELD_caffeine */}
                </div>
                {/* END_OPTIONAL_MACRO_GRID */}

                <SubmitButton />
            </form>
            {/* END_FORM_BLOCK */}
            
            {/* START_STATUS_MESSAGE_BLOCK: [Отображение сообщения о результате операции.] */}
            {state.message && <p className={`text-sm mt-2 ${state.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>{state.message}</p>}
            {/* END_STATUS_MESSAGE_BLOCK */}
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_AddProductForm

