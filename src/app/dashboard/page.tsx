// MODULE_CONTRACT:
// PURPOSE: [Отображает главную страницу дашборда. Содержит приветствие,
//           кнопку для добавления данных и управляет видимостью модального окна.]
// SCOPE: [UI, Дашборд.]
// KEYWORDS_MODULE: [dashboard, ui, client-component, state-management]
// LINKS_TO_MODULE: [components/ui/Modal.tsx]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

'use client';

import { useState } from "react";
import Modal from "../../components/ui/Modal";

// START_COMPONENT_DashboardPage
// CONTRACT:
// PURPOSE: [Основной компонент страницы дашборда. Управляет состоянием модального окна
//           и отображает основной контент страницы.]
export default function DashboardPage() {
    // START_STATE_MANAGEMENT: [Управление состоянием видимости модального окна.]
    const [isModalOpen, setModalOpen] = useState(false);
    // END_STATE_MANAGEMENT

    // START_RENDER_BLOCK: [Рендеринг JSX компонента.]
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Главная Панель</h1>
                <button 
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Добавить запись
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                <p>Добро пожаловать в ваш персональный дашборд здоровья!</p>
                <p>Здесь будут отображаться виджеты с вашими данными.</p>
            </div>
            
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                title="Добавить новую запись"
            >
                {/* Здесь будет форма для добавления данных */}
                <p className="text-gray-400">Форма для ввода данных появится на следующем шаге.</p>
            </Modal>
        </>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_DashboardPage

