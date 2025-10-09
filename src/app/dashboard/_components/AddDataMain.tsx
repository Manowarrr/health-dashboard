// MODULE_CONTRACT:
// PURPOSE: [Предоставляет основной КЛИЕНТСКИЙ компонент для страницы дашборда.
//           Отвечает за интерактивные элементы, такие как кнопка "Добавить запись"
//           и управление состоянием модального окна.]
// SCOPE: [UI, Дашборд, Управление состоянием, Клиентские компоненты.]
// KEYWORDS_MODULE: [ui, component, dashboard, client-component, modal, state]
// LINKS_TO_MODULE: [components/ui/Modal.tsx, components/AddDataForm.tsx]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import AddDataForm from '../../../components/AddDataForm';

// START_COMPONENT_AddDataMain
// CONTRACT:
// PURPOSE: [Основной компонент, инкапсулирующий клиентскую логику дашборда.]
export default function AddDataMain() {
    // START_STATE_MANAGEMENT: [Состояние для управления видимостью модального окна.]
    const [isModalOpen, setIsModalOpen] = useState(false);
    // END_STATE_MANAGEMENT

    // START_RENDER_BLOCK: [Рендеринг JSX компонента.]
    return (
        <>
            {/* START_ADD_BUTTON_BLOCK: [Кнопка для открытия модального окна.] */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out z-50"
            >
                Добавить запись
            </button>
            {/* END_ADD_BUTTON_BLOCK */}

            {/* START_MODAL_BLOCK: [Модальное окно с формой для добавления данных.] */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Добавить новую запись"
            >
                <AddDataForm />
            </Modal>
            {/* END_MODAL_BLOCK */}
        </>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_AddDataMain

