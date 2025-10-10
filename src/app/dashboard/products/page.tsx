// MODULE_CONTRACT:
// PURPOSE: [Отображает страницу "Справочник Продуктов", включая таблицу с продуктами и элементы управления.]
// SCOPE: [Управление продуктами, отображение данных]
// KEYWORDS_MODULE: [products, dashboard, ui, nextjs, server-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.2]

import { Suspense } from 'react';
import ProductsTable from '../../../components/dashboard/ProductsTable';
import ProductSearch from '../../../components/dashboard/ProductSearch';

// START_COMPONENT_ProductsPage
// CONTRACT:
// PURPOSE: [Главный компонент страницы, который организует отображение данных о продуктах.]
// INPUTS:
//   - searchParams: { [key: string]: string | string[] | undefined } - Параметры URL, содержащие поисковый запрос 'q'.
export default async function ProductsPage({ searchParams }: { searchParams?: { q?: string; }; }) {
    // START_QUERY_EXTRACTION_BLOCK: [Извлечение поискового запроса из параметров URL.]
    const query = searchParams?.q || '';
    // END_QUERY_EXTRACTION_BLOCK

    // START_RENDER_BLOCK
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Справочник продуктов</h1>
            
            <div className="flex justify-between items-center">
                <ProductSearch />
                {/* "Add Product" button will be added here */}
            </div>

            <Suspense key={query} fallback={<p>Загрузка таблицы продуктов...</p>}>
                <ProductsTable query={query} />
            </Suspense>
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_ProductsPage