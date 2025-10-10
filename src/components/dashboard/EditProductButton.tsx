// MODULE_CONTRACT:
// PURPOSE: [Предоставляет кнопку "Редактировать" и управляет модальным окном для изменения продукта.]
// SCOPE: [UI, Продукты, Мутации данных, Управление состоянием]
// KEYWORDS_MODULE: [button, product, edit, modal, ui, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.2]

'use client';

import { useState } from 'react';
import { Product } from '../../app/actions';
import Modal from '../ui/Modal';
import EditProductForm from '../forms/EditProductForm';

// START_COMPONENT_EditProductButton
// CONTRACT:
// PURPOSE: [Рендерит кнопку "Редактировать" и модальное окно с формой для редактирования.]
// INPUTS:
//   - product: Product - Объект продукта для передачи в форму редактирования.
export default function EditProductButton({ product }: { product: Product }) {
    // START_STATE_MANAGEMENT: [Состояние для управления видимостью модального окна.]
    const [isModalOpen, setIsModalOpen] = useState(false);
    // END_STATE_MANAGEMENT

    // START_CALLBACK_FORM_SUCCESS: [Callback для закрытия модального окна после успешного обновления.]
    const handleFormSuccess = () => {
        setIsModalOpen(false);
    };
    // END_CALLBACK_FORM_SUCCESS

    // START_RENDER_BLOCK
    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="font-medium text-blue-500 hover:underline"
            >
                Редактировать
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Редактировать: ${product.name}`}
            >
                <EditProductForm product={product} onFormSuccess={handleFormSuccess} />
            </Modal>
        </>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_EditProductButton