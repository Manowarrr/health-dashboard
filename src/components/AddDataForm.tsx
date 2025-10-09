// MODULE_CONTRACT:
// PURPOSE: [Основной компонент для добавления данных. Управляет выбором типа записи (еда, тренировка и т.д.)
//           и отображает соответствующую форму для ввода.]
// SCOPE: [UI, Формы, Ввод данных.]
// KEYWORDS_MODULE: [ui, component, form, data-entry, client-component]
// LINKS_TO_MODULE: [components/forms/AddProductForm.tsx, components/forms/AddFoodLogForm.tsx]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

'use client';

import { useState } from "react";
import AddProductForm from "./forms/AddProductForm";
import AddFoodLogForm from "./forms/AddFoodLogForm";

// START_TYPE_DEFINITION_DataType
// CONTRACT:
// PURPOSE: [Определяет возможные типы данных, которые пользователь может добавить.]
type DataType = 'food' | 'workout' | 'sleep' | 'product' | null;
// END_TYPE_DEFINITION_DataType


// START_COMPONENT_AddDataForm
// CONTRACT:
// PURPOSE: [Главный компонент формы. Управляет внутренним состоянием для выбора типа данных
//           и рендерит либо меню выбора, либо конкретную форму.]
export default function AddDataForm() {
    // START_STATE_MANAGEMENT: [Состояние для отслеживания выбранного типа данных.]
    const [selectedType, setSelectedType] = useState<DataType>(null);
    // END_STATE_MANAGEMENT

    // START_RENDER_BLOCK: [Рендеринг JSX компонента.]
    // START_CONDITIONAL_RENDERING_BLOCK: [Условный рендеринг в зависимости от selectedType.]
    if (selectedType === 'product') {
        return <AddProductForm onBack={() => setSelectedType(null)} />;
    }

    if (selectedType === 'food') {
        return <AddFoodLogForm onBack={() => setSelectedType(null)} />;
    }

    if (selectedType) {
        return (
            // START_FORM_PLACEHOLDER: [Заглушка для будущих форм.]
            <div>
                <button onClick={() => setSelectedType(null)} className="text-blue-400 hover:text-blue-300 mb-4">
                    &larr; Назад к выбору
                </button>
                <p className="text-center text-gray-400">Здесь будет форма для '{selectedType}'.</p>
            </div>
            // END_FORM_PLACEHOLDER
        );
    }
    
    return (
        // START_TYPE_SELECTOR_UI: [Интерфейс для выбора типа добавляемой записи.]
        <div className="space-y-4">
            <h4 className="text-lg font-medium text-center text-gray-300 mb-6">Что вы хотите добавить?</h4>
            <button
                onClick={() => setSelectedType('food')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
                Прием пищи
            </button>
            <button
                onClick={() => setSelectedType('workout')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
                Тренировку
            </button>
            <button
                onClick={() => setSelectedType('sleep')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
                Запись о сне
            </button>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-gray-800 px-2 text-sm text-gray-400">Управление</span>
                </div>
            </div>
            <button
                onClick={() => setSelectedType('product')}
                className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
                Добавить продукт в базу
            </button>
        </div>
        // END_TYPE_SELECTOR_UI
    );
    // END_CONDITIONAL_RENDERING_BLOCK
    // END_RENDER_BLOCK
}
// END_COMPONENT_AddDataForm

