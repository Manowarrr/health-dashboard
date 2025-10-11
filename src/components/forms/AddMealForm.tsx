'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState, useCallback } from 'react';
import { addMeal, FoodSearchResult, FormState, searchFoodItems } from '../../app/actions';
import { useDebounce } from 'use-debounce';

/*
* MODULE_CONTRACT:
* PURPOSE: [Модуль содержит UI-компонент формы для создания и логирования нового приема пищи.]
* SCOPE: [UI, формы, управление состоянием, ввод данных о питании]
* INPUT: [Нет]
* OUTPUT: [Компонент React 'AddMealForm']
* KEYWORDS_MODULE: [form, meal_constructor, food_log, client_component, ui]
*
* MODULE_MAP:
* COMPONENT [Основной компонент-конструктор для приема пищи] => AddMealForm
*   STATE [Состояние для хранения списка добавленных продуктов и рецептов] => items
*   STATE [Состояние для управления поисковым запросом] => searchTerm
*   STATE [Состояние для хранения результатов поиска] => searchResults
*   FUNC [Обработчик для добавления элемента в прием пищи] => handleAddItem
*   FUNC [Обработчик для удаления элемента из приема пищи] => handleRemoveItem
*/

// KEY_USE_CASES:
// - AddMealForm: User (Logging Meal) -> Selects meal type, adds products/recipes, and submits -> MealLogged
// - SearchFunctionality: User (Adding Item) -> Types in search bar -> ReceivesListOfMatchingFoods

type MealItem = {
    id: string;
    name: string;
    type: 'product' | 'recipe';
    weight?: number;
};

export default function AddMealForm() {
    // #START_COMPONENT_STATE_SETUP: [Инициализация состояний формы.]
    const [items, setItems] = useState<MealItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [showWeightInput, setShowWeightInput] = useState<FoodSearchResult | null>(null);
    const [currentWeight, setCurrentWeight] = useState('');
    // #END_COMPONENT_STATE_SETUP

    // #START_FORM_SUBMISSION_SETUP: [Настройка обработки отправки формы с помощью useFormState.]
    const initialState: FormState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(addMeal, initialState);
    // #END_FORM_SUBMISSION_SETUP

    // #START_DATA_FETCHING: [Получение данных для формы, например, списка продуктов и рецептов.]
    useEffect(() => {
        const fetchItems = async () => {
            if (debouncedSearchTerm.length > 2) {
                const results = await searchFoodItems(debouncedSearchTerm);
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        };
        fetchItems();
    }, [debouncedSearchTerm]);
    // #END_DATA_FETCHING

    // #START_EVENT_HANDLERS: [Обработчики для добавления и удаления элементов.]
    const handleSelectSearchResult = (item: FoodSearchResult) => {
        if (item.type === 'product') {
            setShowWeightInput(item);
        } else {
            handleAddItem(item);
        }
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleAddItem = (item: FoodSearchResult, weight?: number) => {
        const newItem: MealItem = {
            id: item.id,
            name: item.name,
            type: item.type,
        };
        if (weight) {
            newItem.weight = weight;
        }
        setItems([...items, newItem]);
        setShowWeightInput(null);
        setCurrentWeight('');
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };
    // #END_EVENT_HANDLERS

    return (
        <form action={dispatch}>
            <input type="hidden" name="items" value={JSON.stringify(items.map(item => ({ id: item.id, type: item.type, weight: item.weight })))} />
            <div className="rounded-md bg-gray-800 p-4 md:p-6">
                {/* #START_MEAL_DETAILS_BLOCK: [Поля для выбора типа и времени приема пищи.] */}
                <div className="mb-4">
                    <label htmlFor="mealType" className="mb-2 block text-sm font-medium text-white">
                        Тип приема пищи
                    </label>
                    <select
                        id="mealType"
                        name="mealType"
                        className="peer block w-full rounded-md border border-gray-600 bg-gray-700 py-2 pl-3 text-sm text-white outline-2 placeholder:text-gray-400"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Выберите тип
                        </option>
                        <option value="breakfast">Завтрак</option>
                        <option value="lunch">Обед</option>
                        <option value="dinner">Ужин</option>
                        <option value="snack">Перекус</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="loggedAt" className="mb-2 block text-sm font-medium text-white">
                        Время приема пищи
                    </label>
                    <input
                        type="datetime-local"
                        id="loggedAt"
                        name="loggedAt"
                        className="peer block w-full rounded-md border border-gray-600 bg-gray-700 py-2 px-3 text-sm text-white outline-2 placeholder:text-gray-400"
                    />
                </div>
                {/* #END_MEAL_DETAILS_BLOCK */}

                {/* #START_ITEM_SEARCH_BLOCK: [Интерфейс для поиска и добавления продуктов/рецептов.] */}
                <div className="mb-4 relative">
                    <label htmlFor="search" className="mb-2 block text-sm font-medium text-white">
                        Добавить в прием пищи
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Поиск продуктов или рецептов..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="peer block w-full rounded-md border border-gray-600 bg-gray-700 py-2 px-3 text-sm text-white outline-2 placeholder:text-gray-400"
                    />
                    {searchResults.length > 0 && (
                        <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                            {searchResults.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelectSearchResult(item)}
                                    className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                                >
                                    {item.name} <span className="text-xs text-gray-400">({item.type === 'product' ? 'продукт' : 'рецепт'})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {showWeightInput && (
                    <div className="mb-4 p-3 bg-gray-700 rounded-md">
                        <p className="mb-2 text-sm text-white">Введите вес для: <strong>{showWeightInput.name}</strong></p>
                        <input
                            type="number"
                            value={currentWeight}
                            onChange={(e) => setCurrentWeight(e.target.value)}
                            className="peer block w-full rounded-md border-gray-600 bg-gray-700 py-2 px-3 text-sm text-white"
                            placeholder="Вес в граммах"
                        />
                        <div className="mt-2 flex gap-2">
                             <button type="button" onClick={() => handleAddItem(showWeightInput, Number(currentWeight))} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Добавить
                            </button>
                             <button type="button" onClick={() => setShowWeightInput(null)} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">
                                Отмена
                            </button>
                        </div>
                    </div>
                )}
                {/* #END_ITEM_SEARCH_BLOCK */}

                {/* #START_ITEM_LIST_BLOCK: [Отображение списка добавленных в прием пищи элементов.] */}
                <div className="mt-6 flow-root">
                    <h3 className="text-sm font-medium text-white mb-2">Состав приема пищи:</h3>
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            {items.length > 0 ? (
                                <ul className="divide-y divide-gray-600">
                                    {items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center py-2">
                                            <span className="text-white">{item.name} {item.weight && `(${item.weight} г)`}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                Удалить
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400">Еще ничего не добавлено.</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* #END_ITEM_LIST_BLOCK */}
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button type="button" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
                    Отмена
                </button>
                <SubmitButton />
            </div>
             {state.message && (
                <div aria-live="polite" className={`mt-2 text-sm ${state.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    <p>{state.message}</p>
                </div>
            )}
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-gray-400"
        >
            Добавить прием пищи
        </button>
    );
}