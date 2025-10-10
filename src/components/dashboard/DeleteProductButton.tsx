// MODULE_CONTRACT:
// PURPOSE: [Предоставляет кнопку для удаления продукта с подтверждением.]
// SCOPE: [UI, Продукты, Мутации данных]
// KEYWORDS_MODULE: [button, product, delete, ui, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.2]

'use client';

import { deleteProduct } from '../../app/actions';

// START_COMPONENT_DeleteProductButton
// CONTRACT:
// PURPOSE: [Рендерит кнопку "Удалить", которая при нажатии запрашивает подтверждение
//           и вызывает Server Action для удаления продукта.]
// INPUTS:
//   - productId: string - ID продукта для удаления.
export default function DeleteProductButton({ productId }: { productId: string }) {
    // START_FORM_ACTION_SETUP: [Привязка Server Action к функции, которая будет вызвана формой.]
    const deleteProductWithId = deleteProduct.bind(null, productId);
    // END_FORM_ACTION_SETUP

    // START_RENDER_BLOCK
    return (
        <form
            action={deleteProductWithId}
            onSubmit={(e) => {
                // START_CONFIRMATION_DIALOG: [Запрос подтверждения у пользователя перед отправкой формы.]
                if (!confirm('Вы уверены, что хотите удалить этот продукт?')) {
                    e.preventDefault();
                }
                // END_CONFIRMATION_DIALOG
            }}
        >
            <button type="submit" className="font-medium text-red-500 hover:underline">
                Удалить
            </button>
        </form>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_DeleteProductButton