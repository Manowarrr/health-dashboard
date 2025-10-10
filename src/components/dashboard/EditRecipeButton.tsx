// MODULE_CONTRACT:
// PURPOSE: [Предоставляет кнопку для открытия модального окна с формой редактирования рецепта.]
// SCOPE: [UI, Рецепты, Управление состоянием]
// KEYWORDS_MODULE: [button, recipe, edit, modal, ui, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.3]

'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import { Recipe } from '../../app/actions';
import EditRecipeForm from '../forms/EditRecipeForm';

// START_COMPONENT_EditRecipeButton
// CONTRACT:
// PURPOSE: [Рендерит кнопку "Редактировать" и управляет модальным окном для редактирования рецепта.]
// INPUTS:
//   - recipe: Recipe - Объект рецепта для редактирования.
export default function EditRecipeButton({ recipe }: { recipe: Omit<Recipe, 'total_calories' | 'total_protein' | 'total_fat' | 'total_carbs'> }) {
    // START_STATE_MANAGEMENT: [Состояние для управления видимостью модального окна.]
    const [isModalOpen, setIsModalOpen] = useState(false);
    // END_STATE_MANAGEMENT

    // START_RENDER_BLOCK
    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="font-medium text-indigo-400 hover:underline"
            >
                Редактировать
            </button>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={`Редактировать рецепт: ${recipe.name}`}
            >
                <EditRecipeForm recipe={recipe} onFormSuccess={() => setIsModalOpen(false)} />
            </Modal>
        </>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_EditRecipeButton