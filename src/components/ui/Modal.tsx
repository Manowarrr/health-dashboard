// MODULE_CONTRACT:
// PURPOSE: [Предоставляет универсальный, переиспользуемый компонент модального окна (popup).
//           Управляет отображением контента поверх основного интерфейса.]
// SCOPE: [UI, компоненты.]
// KEYWORDS_MODULE: [ui, component, modal, popup, client-component]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2]

'use client';

import { PropsWithChildren } from "react";

// START_COMPONENT_PROPS_TYPE: [Определение типов для пропсов компонента.]
type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
};
// END_COMPONENT_PROPS_TYPE

// START_COMPONENT_Modal
// CONTRACT:
// PURPOSE: [Основной компонент модального окна. Рендерит дочерние элементы внутри стилизованной рамки,
//           управляет видимостью и закрытием по клику на фон или кнопку.]
export default function Modal({ isOpen, onClose, title, children }: PropsWithChildren<ModalProps>) {
    // START_VISIBILITY_CHECK: [Проверка, должно ли окно быть видимым.]
    if (!isOpen) {
        return null;
    }
    // END_VISIBILITY_CHECK

    // START_RENDER_BLOCK: [Рендеринг JSX компонента.]
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative"
                onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие по клику внутри окна
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        {/* Крестик для закрытия (можно заменить на иконку) */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_Modal
