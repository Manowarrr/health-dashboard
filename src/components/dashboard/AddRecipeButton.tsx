// MODULE_CONTRACT:
// PURPOSE: [Предоставляет кнопку для открытия модального окна с формой добавления рецепта.]
// SCOPE: [UI, Рецепты, Управление состоянием]
// KEYWORDS_MODULE: [button, recipe, modal, ui, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.3]

'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
// This component will be created in the next step.
import AddRecipeForm from '../forms/AddRecipeForm';

// START_COMPONENT_AddRecipeButton
// CONTRACT:
// PURPOSE: [Рендерит кнопку и управляет состоянием модального окна для добавления рецепта.]
export default function AddRecipeButton() {
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
                Добавить рецепт
            </button>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Добавить новый рецепт"
            >
                <AddRecipeForm onFormSuccess={() => setIsModalOpen(false)} />
            </Modal>
        </>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_AddRecipeButton