// MODULE_CONTRACT:
// PURPOSE: [Предоставляет UI для поиска продуктов и управляет состоянием поискового запроса в URL.]
// SCOPE: [Поиск, UI, управление состоянием URL]
// KEYWORDS_MODULE: [search, filter, ui, client-component, nextjs]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.2]

'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

// START_COMPONENT_ProductSearch
// CONTRACT:
// PURPOSE: [Рендерит поле ввода для поиска и обновляет параметр 'q' в URL с задержкой.]
export default function ProductSearch() {
    // START_HOOKS_SETUP: [Инициализация хуков для работы с URL и роутером.]
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    // END_HOOKS_SETUP

    // START_DEBOUNCED_SEARCH_HANDLER: [Обработчик ввода с 300мс задержкой для предотвращения частых запросов.]
    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);
    // END_DEBOUNCED_SEARCH_HANDLER

    // START_RENDER_BLOCK: [Рендеринг поля ввода.]
    return (
        <div className="relative">
            <label htmlFor="search" className="sr-only">
                Поиск
            </label>
            <input
                id="search"
                className="peer block w-full rounded-md border border-gray-500 bg-gray-800 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-400"
                placeholder="Найти продукт..."
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('q')?.toString()}
            />
            {/* Иконка лупы может быть добавлена здесь */}
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_ProductSearch