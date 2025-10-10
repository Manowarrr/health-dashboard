// MODULE_CONTRACT:
// PURPOSE: [Содержит все серверные действия (Server Actions) для приложения.
//           Обрабатывает мутации данных (создание, обновление, удаление) на сервере.]
// SCOPE: [Server Actions, Мутации данных, Бизнес-логика.]
// KEYWORDS_MODULE: [server-actions, data-mutation, supabase, zod]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2, Business Requirement: Прямой ввод калорий]

'use server';

import { createClient } from '../../lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// START_ZOD_SCHEMA_addProductSchema
// CONTRACT:
// PURPOSE: [Определяет схему валидации для данных, поступающих из формы добавления продукта.]
const addProductSchema = z.object({
    name: z.string().min(2, { message: 'Название должно быть длиннее 2 символов' }),
    calories: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}),
    protein: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}),
    fat: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}),
    carbs: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}),
});
// END_ZOD_SCHEMA_addProductSchema


// START_ZOD_SCHEMA_addFoodLogSchema
// CONTRACT:
// PURPOSE: [Определяет схему валидации для данных, поступающих из формы логирования приема пищи.]
const addFoodLogSchema = z.object({
    productId: z.string().uuid({ message: 'Необходимо выбрать продукт.' }),
    weight: z.coerce.number().positive({ message: 'Вес должен быть больше нуля.' }),
    mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack'], { message: 'Необходимо выбрать тип приема пищи.'})
});
// END_ZOD_SCHEMA_addFoodLogSchema


// START_TYPE_DEFINITION_FormState
// CONTRACT:
// PURPOSE: [Определяет структуру объекта состояния для форм, использующих Server Actions.]
export type FormState = {
    message: string;
    errors?: Record<string, string[] | undefined>;
};
// END_TYPE_DEFINITION_FormState


// START_SERVER_ACTION_addProduct
// CONTRACT:
// PURPOSE: [Обрабатывает отправку формы для добавления нового продукта в личный справочник пользователя.]
// INPUTS:
//   - previousState: FormState - Предыдущее состояние формы (для useFormState).
//   - formData: FormData - Данные, отправленные из HTML-формы.
// OUTPUTS:
//   - FormState - Новое состояние формы с сообщением об успехе или ошибке.
// SIDE_EFFECTS:
//   - Вставляет новую запись в таблицу 'products' в Supabase.
//   - Вызывает revalidatePath('/dashboard') для обновления UI.
export async function addProduct(previousState: FormState, formData: FormData): Promise<FormState> {
    // START_VALIDATION_BLOCK: [Валидация входящих данных формы с помощью Zod.]
    const validatedFields = addProductSchema.safeParse({
        name: formData.get('name'),
        calories: formData.get('calories'),
        protein: formData.get('protein'),
        fat: formData.get('fat'),
        carbs: formData.get('carbs'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Ошибка валидации. Пожалуйста, проверьте введенные данные.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    // END_VALIDATION_BLOCK

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Ошибка: Пользователь не авторизован.' };
    }

    // START_ENSURE_USER_PROFILE_EXISTS: [Проверка и создание профиля пользователя в public.users, если он отсутствует.]
    const { error: upsertError } = await supabase.from('users').upsert({ id: user.id });
    if (upsertError) {
        console.error('User Profile Upsert Error:', upsertError);
        return { message: `Ошибка синхронизации профиля: ${upsertError.message}` };
    }
    // END_ENSURE_USER_PROFILE_EXISTS

    // START_DB_INSERT_BLOCK: [Вставка проверенных данных в базу данных Supabase.]
    const { error } = await supabase.from('products').insert({
        user_id: user.id,
        name: validatedFields.data.name,
        calories_per_100g: validatedFields.data.calories,
        protein_per_100g: validatedFields.data.protein,
        fat_per_100g: validatedFields.data.fat,
        carbs_per_100g: validatedFields.data.carbs,
        fiber_per_100g: 0,
        sugar_per_100g: 0,
        alcohol_per_100g: 0,
        caffeine_per_100g_mg: 0,
    });

    if (error) {
        return { message: `Ошибка базы данных: ${error.message}` };
    }
    // END_DB_INSERT_BLOCK

    revalidatePath('/dashboard');
    return { message: `Продукт "${validatedFields.data.name}" успешно добавлен!` };
}
// END_SERVER_ACTION_addProduct


// START_TYPE_DEFINITION_Product
// CONTRACT:
// PURPOSE: [Определяет структуру объекта продукта для использования в UI.]
export type Product = {
    id: string;
    name: string;
    calories_per_100g: number;
    protein_per_100g: number;
    fat_per_100g: number;
    carbs_per_100g: number;
};
// END_TYPE_DEFINITION_Product

// START_SERVER_ACTION_getProducts
// CONTRACT:
// PURPOSE: [Извлекает список всех продуктов, добавленных текущим пользователем, с возможностью фильтрации по названию.]
// INPUTS:
//   - query: string (optional) - Строка для поиска по названию продукта.
// OUTPUTS:
//   - Promise<Product[]> - Массив объектов продуктов.
export async function getProducts(query?: string): Promise<Product[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let queryBuilder = supabase
        .from('products')
        .select('id, name, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g')
        .eq('user_id', user.id);

    // START_QUERY_FILTERING_BLOCK: [Если есть поисковый запрос, добавляем фильтр ilike.]
    if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }
    // END_QUERY_FILTERING_BLOCK

    const { data, error } = await queryBuilder.order('name', { ascending: true });

    if (error) {
        console.error('Database Error:', error.message);
        throw new Error('Не удалось загрузить продукты.');
    }
    
    return data;
}
// END_SERVER_ACTION_getProducts


// START_SERVER_ACTION_addFoodLog
// CONTRACT:
// PURPOSE: [Обрабатывает отправку формы для записи приема пищи в журнал.]
export async function addFoodLog(previousState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = addFoodLogSchema.safeParse({
        productId: formData.get('productId'),
        weight: formData.get('weight'),
        mealType: formData.get('mealType'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Ошибка валидации.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: 'Ошибка: Пользователь не авторизован.' };

    const { error: upsertError } = await supabase.from('users').upsert({ id: user.id });
    if (upsertError) {
        return { message: `Ошибка синхронизации профиля: ${upsertError.message}` };
    }

    const { error } = await supabase.from('food_log').insert({
        user_id: user.id,
        product_id: validatedFields.data.productId,
        weight_g: validatedFields.data.weight,
        meal_type: validatedFields.data.mealType,
        logged_at: new Date().toISOString(),
    });

    if (error) {
        return { message: `Ошибка базы данных: ${error.message}` };
    }

    revalidatePath('/dashboard');
    return { message: `Прием пищи успешно записан!` };
}
// END_SERVER_ACTION_addFoodLog


// START_TYPE_DEFINITION_NutritionSummary
// CONTRACT:
// PURPOSE: [Определяет структуру объекта с итоговыми данными по питанию за день.]
export type NutritionSummary = {
    total_calories: number;
    total_protein: number;
    total_fat: number;
    total_carbs: number;
};
// END_TYPE_DEFINITION_NutritionSummary


// START_SERVER_ACTION_getDailyNutritionSummary
// CONTRACT:
// PURPOSE: [Извлекает все записи о приемах пищи за текущий день и рассчитывает
//           итоговую сумму калорий, белков, жиров и углеводов.]
// OUTPUTS:
//   - Promise<NutritionSummary> - Объект с итоговыми данными по питанию.
export async function getDailyNutritionSummary(): Promise<NutritionSummary> {
    const supabase = createClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data, error } = await supabase
        .from('food_log')
        .select(`
            weight_g,
            products (
                calories_per_100g,
                protein_per_100g,
                fat_per_100g,
                carbs_per_100g
            )
        `)
        .gte('logged_at', today.toISOString())
        .lt('logged_at', tomorrow.toISOString());

    if (error) {
        console.error("Database Error:", error.message);
        throw new Error("Failed to fetch nutrition data.");
    }

    const summary: NutritionSummary = {
        total_calories: 0,
        total_protein: 0,
        total_fat: 0,
        total_carbs: 0,
    };

    if (data) {
        for (const log of data) {
            if (log.products) {
                // The type from Supabase for a joined table can be inferred incorrectly as an array.
                // We force the type cast via 'unknown' as suggested by the TypeScript error.
                // This is safe because the DB schema ensures a one-to-one relationship here.
                const product = log.products as unknown as { calories_per_100g: number; protein_per_100g: number; fat_per_100g: number; carbs_per_100g: number; };
                const ratio = log.weight_g / 100;
                
                summary.total_calories += product.calories_per_100g * ratio;
                summary.total_protein += product.protein_per_100g * ratio;
                summary.total_fat += product.fat_per_100g * ratio;
                summary.total_carbs += product.carbs_per_100g * ratio;
            }
        }
    }
    
    return summary;
}
// END_SERVER_ACTION_getDailyNutritionSummary

