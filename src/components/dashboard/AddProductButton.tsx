// MODULE_CONTRACT:
// PURPOSE: [Предоставляет кнопку для открытия модального окна с формой добавления продукта.]
// SCOPE: [UI, Продукты, Управление состоянием]
// KEYWORDS_MODULE: [button, product, modal, ui, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.2]

'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import AddDataForm from '../AddDataForm';

// START_COMPONENT_AddProductButton
// CONTRACT:
// PURPOSE: [Рендерит кнопку и управляет состоянием модального окна для добавления продукта.]
export default function AddProductButton() {
    // START_STATE_MANAGEMENT: [Состояние для управления видимостью модального окна.]
    const [isModalOpen, setIsModalOpen] = useState(false);
    // END_STATE_MANAGEMENT

    // START_RENDER_BLOCK
    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
                Добавить продукт
            </button>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Добавить новый продукт"
            >
                <AddDataForm initialType="product" />
            </Modal>
        </>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_AddProductButton