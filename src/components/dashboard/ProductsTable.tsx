// MODULE_CONTRACT:
// PURPOSE: [Отображает таблицу с продуктами пользователя, полученными с сервера.]
// SCOPE: [Отображение данных, продукты]
// KEYWORDS_MODULE: [products, table, ui, dashboard, server-component]
// LINKS_TO_SPECIFICATION: [Development Plan: 2.2]

import { getProducts, Product } from "../../app/actions";
import DeleteProductButton from "./DeleteProductButton";
import EditProductButton from "./EditProductButton";

// START_COMPONENT_ProductsTable
// CONTRACT:
// PURPOSE: [Асинхронный серверный компонент для получения и отображения списка продуктов.]
// INPUTS:
//   - query: string - Поисковый запрос для фильтрации продуктов.
export default async function ProductsTable({ query }: { query: string }) {
    // START_DATA_FETCH_BLOCK: [Получение списка продуктов с помощью Server Action.]
    const products = await getProducts(query);
    // END_DATA_FETCH_BLOCK

    // START_EMPTY_STATE_BLOCK: [Отображение сообщения, если список продуктов пуст.]
    if (products.length === 0) {
        return <p>Продукты не найдены. Попробуйте другой поисковый запрос или добавьте новый продукт.</p>;
    }
    // END_EMPTY_STATE_BLOCK

    // START_RENDER_BLOCK: [Рендеринг таблицы с продуктами.]
    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        <th scope="col" className="py-3 px-6">Название</th>
                        <th scope="col" className="py-3 px-6">Калории (на 100г)</th>
                        <th scope="col" className="py-3 px-6">Белки (г)</th>
                        <th scope="col" className="py-3 px-6">Жиры (г)</th>
                        <th scope="col" className="py-3 px-6">Углеводы (г)</th>
                        <th scope="col" className="py-3 px-6">Клетчатка (г)</th>
                        <th scope="col" className="py-3 px-6">Сахар (г)</th>
                        <th scope="col" className="py-3 px-6">Алкоголь (г)</th>
                        <th scope="col" className="py-3 px-6">Кофеин (мг)</th>
                        <th scope="col" className="py-3 px-6">
                            <span className="sr-only">Действия</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: Product) => (
                        <tr key={product.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                            <th scope="row" className="py-4 px-6 font-medium whitespace-nowrap text-white">
                                {product.name}
                            </th>
                            <td className="py-4 px-6">{product.calories_per_100g}</td>
                            <td className="py-4 px-6">{product.protein_per_100g}</td>
                            <td className="py-4 px-6">{product.fat_per_100g}</td>
                            <td className="py-4 px-6">{product.carbs_per_100g}</td>
                            <td className="py-4 px-6">{product.fiber_per_100g || 0}</td>
                            <td className="py-4 px-6">{product.sugar_per_100g || 0}</td>
                            <td className="py-4 px-6">{product.alcohol_per_100g || 0}</td>
                            <td className="py-4 px-6">{product.caffeine_per_100g_mg || 0}</td>
                            <td className="py-4 px-6 text-right space-x-4">
                                <EditProductButton product={product} />
                                <DeleteProductButton productId={product.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_ProductsTable